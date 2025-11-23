import express from "express";
import request from "supertest";

// Mock de la base de datos
jest.mock("../../backend/db", () => ({
  pool: {
    execute: jest.fn(),
  },
}));

// Importar APIs después del mock
import {
  projectsAPI,
  budgetsAPI,
  reportsAPI,
  usersAPI,
} from "../../src/services/api.js";

// Función auxiliar para crear app de prueba
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Mock de rutas para simular backend
  app.get("/api/projects", async (req, res) => {
    try {
      const result = await projectsAPI.getProjects();
      res.status(200).json(result.data);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = await projectsAPI.createProject(req.body);
      res
        .status(201)
        .json({ message: "Proyecto registrado con éxito", ...result });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const result = await projectsAPI.updateProject(req.params.id, req.body);
      if (result.success) {
        res.status(200).json({
          message: "Proyecto actualizado correctamente",
          data: result.data,
        });
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const result = await projectsAPI.deleteProject(req.params.id);
      if (result.success) {
        res
          .status(200)
          .json({ message: "Proyecto eliminado con éxito", affectedRows: 1 });
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  // Rutas para budgets
  app.get("/api/budgets", async (req, res) => {
    try {
      const result = await budgetsAPI.getBudgets();
      res.status(200).json(result.data);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  app.get("/api/budgets/:id", async (req, res) => {
    try {
      const result = await budgetsAPI.getBudgets();
      const budget = result.data.find((b) => b.id === parseInt(req.params.id));
      if (budget) {
        res.status(200).json(budget);
      } else {
        res.status(404).json({ message: "Presupuesto no encontrado" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  // Rutas para reports
  app.get("/api/reports", async (req, res) => {
    try {
      const result = await reportsAPI.getReports();
      res.status(200).json(result.data);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const result = await reportsAPI.createReport(req.body);
      res
        .status(201)
        .json({ message: "Reporte creado exitosamente", data: result.data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  // Rutas para users
  app.get("/api/users", async (req, res) => {
    try {
      const result = await usersAPI.getUsers();
      res.status(200).json(result.data);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const result = await usersAPI.createUser(req.body);
      res.status(201).json({
        message: "Usuario registrado exitosamente",
        data: result.data,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  return app;
};

describe("Casos de Prueba API", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe("🧩 CP_001 – Listar Proyectos", () => {
    test("GET /api/projects - debe retornar lista de proyectos", async () => {
      const response = await request(app).get("/api/projects");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("description");
      expect(response.body[0]).toHaveProperty("budget");
    });
  });

  describe("🧩 CP_002 – Crear Proyecto", () => {
    test("POST /api/projects - debe crear proyecto válido", async () => {
      const newProject = {
        name: "Nuevo Proyecto",
        description: "Descripción Nueva",
        budget: 20000,
      };

      const response = await request(app)
        .post("/api/projects")
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Proyecto registrado con éxito");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.name).toBe(newProject.name);
      expect(response.body.data.description).toBe(newProject.description);
      expect(response.body.data.budget).toBe(newProject.budget);
    });
  });

  describe("🧩 CP_003 – Actualizar Proyecto", () => {
    test("PUT /api/projects/:id - debe actualizar proyecto existente", async () => {
      const updateData = {
        nombre: "Proyecto Actualizado",
      };

      const response = await request(app)
        .put("/api/projects/1")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Proyecto actualizado correctamente");
      expect(response.body.data.nombre).toBe(updateData.nombre);
    });
  });

  describe("🧩 CP_004 – Eliminar Proyecto", () => {
    test("DELETE /api/projects/:id - debe eliminar proyecto existente", async () => {
      const response = await request(app).delete("/api/projects/1");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Proyecto eliminado con éxito");
      expect(response.body.affectedRows).toBe(1);
    });
  });

  describe("🧩 CP_005 – Listar Presupuestos", () => {
    test("GET /api/budgets - debe retornar lista de presupuestos", async () => {
      const response = await request(app).get("/api/budgets");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("nombre");
      expect(response.body[0]).toHaveProperty("monto");
      expect(response.body[0]).toHaveProperty("proyectoId");
    });
  });

  describe("🧩 CP_006 – Obtener Presupuesto por ID", () => {
    test("GET /api/budgets/:id - debe retornar presupuesto específico", async () => {
      const response = await request(app).get("/api/budgets/1");
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(1);
      expect(response.body.nombre).toBe(
        "Presupuesto Sistema Inventario - Fase 1"
      );
      expect(response.body.monto).toBe(25000);
    });
  });

  describe("🧩 CP_007 – Listar Reportes", () => {
    test("GET /api/reports - debe retornar lista de reportes", async () => {
      const response = await request(app).get("/api/reports");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("title");
      expect(response.body[0]).toHaveProperty("type");
      expect(response.body[0]).toHaveProperty("projectId");
    });
  });

  describe("🧩 CP_008 – Crear Reporte", () => {
    test("POST /api/reports - debe crear reporte válido", async () => {
      const newReport = {
        title: "Nuevo Reporte",
        type: "mensual",
        projectId: 1,
      };

      const response = await request(app).post("/api/reports").send(newReport);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Reporte creado exitosamente");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.title).toBe(newReport.title);
      expect(response.body.data.type).toBe(newReport.type);
      expect(response.body.data.projectId).toBe(newReport.projectId);
    });
  });

  describe("🧩 CP_009 – Listar Usuarios", () => {
    test("GET /api/users - debe retornar lista de usuarios", async () => {
      const response = await request(app).get("/api/users");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("nombre");
      expect(response.body[0]).toHaveProperty("email");
      expect(response.body[0]).toHaveProperty("rol");
    });
  });

  describe("🧩 CP_010 – Crear Usuario", () => {
    test("POST /api/users - debe crear usuario válido", async () => {
      const newUser = {
        nombre: "Nuevo Usuario",
        email: "new@example.com",
        password: "password123",
        rol: "cliente",
      };

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Usuario registrado exitosamente");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.nombre).toBe(newUser.nombre);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.rol).toBe(newUser.rol);
    });
  });
});
