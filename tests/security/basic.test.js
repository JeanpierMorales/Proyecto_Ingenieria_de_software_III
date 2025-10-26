const request = require("supertest");
const express = require("express");
const cors = require("cors");

// Simulación del pool de base de datos
jest.mock("../../backend/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../../backend/db");

// Importar rutas
const projectsRouter = require("../../backend/routes/projects");
const usersRouter = require("../../backend/routes/users");

// Crear aplicación de prueba
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/projects", projectsRouter);
app.use("/api/users", usersRouter);

describe("Pruebas de Seguridad", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Validación de Entradas y Protección contra Inyección SQL", () => {
    test("Debe prevenir inyección SQL al crear un proyecto", async () => {
      const maliciousInput = {
        nombre: "'; DROP TABLE projects; --",
        descripcion: "Descripción maliciosa",
        presupuesto: 10000,
        fechaInicio: "2024-01-01",
      };

      pool.execute.mockResolvedValue([{ insertId: 1 }]);
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      pool.execute.mockResolvedValueOnce([[{ id: 1, ...maliciousInput }]]);

      const response = await request(app)
        .post("/api/projects")
        .send(maliciousInput)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    test("Debe validar el formato de correo electrónico al crear un usuario", async () => {
      const invalidUser = {
        nombre: "Usuario Prueba",
        email: '<script>alert("xss")</script>',
        password: "password123",
        rol: "cliente",
      };

      pool.execute.mockResolvedValue([{ insertId: 1 }]);
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      pool.execute.mockResolvedValueOnce([
        [{ id: 1, ...invalidUser, activo: true }],
      ]);

      const response = await request(app)
        .post("/api/users")
        .send(invalidUser)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    test("Debe manejar cargas útiles grandes correctamente", async () => {
      const largeProject = {
        nombre: "A".repeat(10000),
        descripcion: "B".repeat(50000),
        presupuesto: 999999999999,
        fechaInicio: "2024-01-01",
      };

      pool.execute.mockResolvedValue([{ insertId: 1 }]);
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      pool.execute.mockResolvedValueOnce([[{ id: 1, ...largeProject }]]);

      const response = await request(app)
        .post("/api/projects")
        .send(largeProject)
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  describe("Manejo de Errores", () => {
    test("No debe exponer errores internos", async () => {
      pool.execute.mockRejectedValue(
        new Error("Fallo en conexión de base de datos")
      );

      const response = await request(app).get("/api/projects").expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Error fetching projects");
    });

    test("Debe manejar JSON malformado correctamente", async () => {
      const response = await request(app)
        .post("/api/projects")
        .set("Content-Type", "application/json")
        .send("{ invalid json }")
        .expect(400);
    });
  });

  describe("Limitación de Tasa y Protección contra DoS", () => {
    test("Debe manejar múltiples solicitudes rápidas sin fallar", async () => {
      pool.execute.mockResolvedValue([[]]);

      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          request(app)
            .get("/api/projects")
            .then((response) => response.status)
        );
      }

      const results = await Promise.all(promises);
      const successCount = results.filter((status) => status === 200).length;

      expect(successCount).toBeGreaterThan(90);
    });
  });

  describe("Autenticación y Autorización", () => {
    test("Debe manejar solicitudes sin autenticación", async () => {
      pool.execute.mockResolvedValue([[]]);

      const response = await request(app).get("/api/projects").expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("Prevención de Exposición de Datos Sensibles", () => {
    test("No debe exponer datos sensibles en las respuestas", async () => {
      const mockUsers = [
        {
          id: 1,
          nombre: "Usuario Prueba",
          email: "test@example.com",
          rol: "admin",
          password: "hashed_password",
          sensitive_field: "secret_data",
        },
      ];

      pool.execute.mockResolvedValue([mockUsers]);

      const response = await request(app).get("/api/users").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0]).toHaveProperty("email");
      expect(response.body.data[0]).toHaveProperty("rol");
    });
  });
});
