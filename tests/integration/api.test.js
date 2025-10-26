// Importamos las librerías necesarias
const request = require("supertest"); // Para hacer peticiones HTTP al servidor de pruebas
const express = require("express"); // Framework web
const cors = require("cors"); // Para habilitar CORS en la app

// MOCK: simulamos la base de datos para no depender de datos reales
jest.mock("../../backend/db", () => ({
  execute: jest.fn(), // mock de la función execute
}));

const pool = require("../../backend/db"); // Importamos la base de datos mockeada

// Importamos los routers de nuestra API
const projectsRouter = require("../../backend/routes/projects");
const budgetsRouter = require("../../backend/routes/budgets");
const reportsRouter = require("../../backend/routes/reports");
const usersRouter = require("../../backend/routes/users");
const purchasesRouter = require("../../backend/routes/purchases");
const strategiesRouter = require("../../backend/routes/strategies");
const quotationsRouter = require("../../backend/routes/quotations");

// Creamos la aplicación de prueba con Express
const app = express();
app.use(cors()); // Habilitamos CORS
app.use(express.json()); // Habilitamos parseo de JSON

// Montamos los routers en sus respectivas rutas
app.use("/api/projects", projectsRouter);
app.use("/api/budgets", budgetsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/users", usersRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/strategies", strategiesRouter);
app.use("/api/quotations", quotationsRouter);

// DESCRIPCIÓN GENERAL DE LAS PRUEBAS
describe("Pruebas de integración de la API", () => {
  // Antes de cada prueba limpiamos todos los mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =======================
  // PRUEBAS DE PROYECTOS
  // =======================
  describe("API de Proyectos", () => {
    test("GET /api/projects debería devolver la lista de proyectos", async () => {
      // Datos simulados
      const mockProjects = [
        {
          id: 1,
          nombre: "Proyecto Test",
          descripcion: "Descripción Test",
          presupuesto: 10000,
        },
      ];
      pool.execute.mockResolvedValue([mockProjects]); // La función execute devuelve la lista

      const response = await request(app).get("/api/projects").expect(200);

      expect(response.body.success).toBe(true); // Debe indicar éxito
      expect(response.body.data).toEqual(mockProjects); // Debe devolver los datos simulados
    });

    test("POST /api/projects debería crear un nuevo proyecto", async () => {
      const newProject = {
        nombre: "Nuevo Proyecto",
        descripcion: "Descripción Nueva",
        presupuesto: 20000,
        fechaInicio: "2024-01-01",
      };

      const mockResult = { insertId: 2 }; // Simulamos el insert en la DB
      pool.execute.mockResolvedValueOnce([mockResult]); // Primer execute: inserción
      pool.execute.mockResolvedValueOnce([
        [{ id: 2, ...newProject, estado: "pendiente" }],
      ]); // Segundo execute: obtención del proyecto creado

      const response = await request(app)
        .post("/api/projects")
        .send(newProject)
        .expect(201); // Código HTTP 201 = creado

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(2); // Debe devolver el ID creado
    });

    test("PUT /api/projects/:id debería actualizar un proyecto", async () => {
      const updateData = { nombre: "Proyecto Actualizado" };
      const mockResult = { affectedRows: 1 }; // Simulamos actualización exitosa

      pool.execute.mockResolvedValueOnce([mockResult]); // Primer execute: update
      pool.execute.mockResolvedValueOnce([
        [{ id: 1, nombre: "Proyecto Actualizado", descripcion: "Test" }],
      ]); // Segundo execute: obtener proyecto actualizado

      const response = await request(app)
        .put("/api/projects/1")
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nombre).toBe("Proyecto Actualizado");
    });

    test("DELETE /api/projects/:id debería eliminar un proyecto", async () => {
      const mockResult = { affectedRows: 1 }; // Simulamos eliminación exitosa
      pool.execute.mockResolvedValue([mockResult]);

      const response = await request(app).delete("/api/projects/1").expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // =======================
  // PRUEBAS DE PRESUPUESTOS
  // =======================
  describe("API de Presupuestos", () => {
    test("GET /api/budgets debería devolver la lista de presupuestos", async () => {
      const mockBudgets = [
        { id: 1, nombre: "Presupuesto Test", monto: 5000, proyectoId: 1 },
      ];
      pool.execute.mockResolvedValue([mockBudgets]);

      const response = await request(app).get("/api/budgets").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockBudgets);
    });

    test("GET /api/budgets/:id debería devolver un presupuesto específico", async () => {
      const mockBudget = { id: 1, nombre: "Presupuesto Test", monto: 5000 };
      pool.execute.mockResolvedValue([[mockBudget]]);

      const response = await request(app).get("/api/budgets/1").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockBudget);
    });
  });

  // =======================
  // PRUEBAS DE REPORTES
  // =======================
  describe("API de Reportes", () => {
    test("GET /api/reports debería devolver la lista de reportes", async () => {
      const mockReports = [
        { id: 1, titulo: "Reporte Test", tipo: "mensual", proyectoId: 1 },
      ];
      pool.execute.mockResolvedValue([mockReports]);

      const response = await request(app).get("/api/reports").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockReports);
    });

    test("POST /api/reports debería crear un nuevo reporte", async () => {
      const newReport = {
        titulo: "Nuevo Reporte",
        tipo: "mensual",
        proyectoId: 1,
      };
      const mockResult = { insertId: 2 };

      pool.execute.mockResolvedValueOnce([mockResult]); // Inserción
      pool.execute.mockResolvedValueOnce([
        [{ id: 2, ...newReport, estado: "borrador" }],
      ]); // Obtener creado

      const response = await request(app)
        .post("/api/reports")
        .send(newReport)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(2);
    });
  });

  // =======================
  // PRUEBAS DE USUARIOS
  // =======================
  describe("API de Usuarios", () => {
    test("GET /api/users debería devolver la lista de usuarios", async () => {
      const mockUsers = [
        {
          id: 1,
          nombre: "Usuario Test",
          email: "test@example.com",
          rol: "analista",
        },
      ];
      pool.execute.mockResolvedValue([mockUsers]);

      const response = await request(app).get("/api/users").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUsers);
    });

    test("POST /api/users debería crear un nuevo usuario", async () => {
      const newUser = {
        nombre: "Nuevo Usuario",
        email: "new@example.com",
        password: "password123",
        rol: "cliente",
      };
      const mockResult = { insertId: 2 };

      pool.execute.mockResolvedValueOnce([mockResult]); // Inserción
      pool.execute.mockResolvedValueOnce([
        [{ id: 2, ...newUser, activo: true }],
      ]); // Obtener creado

      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(2);
    });
  });

  // =======================
  // PRUEBAS DE COMPRAS
  // =======================
  describe("API de Compras", () => {
    test("GET /api/purchases debería devolver la lista de compras", async () => {
      const mockPurchases = [
        { id: 1, descripcion: "Compra Test", monto: 1000, proyectoId: 1 },
      ];
      pool.execute.mockResolvedValue([mockPurchases]);

      const response = await request(app).get("/api/purchases").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPurchases);
    });

    test("POST /api/purchases debería crear una nueva compra", async () => {
      const newPurchase = {
        descripcion: "Nueva Compra",
        categoria: "software",
        monto: 2000,
        proyectoId: 1,
        proveedor: "Proveedor Test",
      };
      const mockResult = { insertId: 2 };

      pool.execute.mockResolvedValueOnce([mockResult]); // Inserción
      pool.execute.mockResolvedValueOnce([
        [{ id: 2, ...newPurchase, estado: "pendiente" }],
      ]); // Obtener creado

      const response = await request(app)
        .post("/api/purchases")
        .send(newPurchase)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(2);
    });
  });

  // =======================
  // PRUEBAS DE ESTRATEGIAS
  // =======================
  describe("API de Estrategias", () => {
    test("GET /api/strategies debería devolver la lista de estrategias", async () => {
      const mockStrategies = [
        {
          id: 1,
          titulo: "Estrategia Test",
          descripcion: "Descripción Test",
          tipo: "proceso",
        },
      ];
      pool.execute.mockResolvedValue([mockStrategies]);

      const response = await request(app).get("/api/strategies").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockStrategies);
    });

    test("POST /api/strategies debería crear una nueva estrategia", async () => {
      const newStrategy = {
        titulo: "Nueva Estrategia",
        descripcion: "Descripción Nueva",
        tipo: "proceso",
        prioridad: "alta",
      };
      const mockResult = { insertId: 2 };

      pool.execute.mockResolvedValueOnce([mockResult]); // Inserción
      pool.execute.mockResolvedValueOnce([
        [{ id: 2, ...newStrategy, estado: "planificada" }],
      ]); // Obtener creado

      const response = await request(app)
        .post("/api/strategies")
        .send(newStrategy)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(2);
    });
  });

  // =======================
  // PRUEBAS DE COTIZACIONES
  // =======================
  describe("API de Cotizaciones", () => {
    test("GET /api/quotations debería devolver la lista de cotizaciones", async () => {
      const mockQuotations = [
        {
          id: 1,
          numero: "COT-2024-001",
          cliente: "Cliente Test",
          monto: 10000,
        },
      ];
      pool.execute.mockResolvedValue([mockQuotations]);

      const response = await request(app).get("/api/quotations").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockQuotations);
    });

    test("POST /api/quotations debería crear una nueva cotización", async () => {
      const newQuotation = {
        numero: "COT-2024-002",
        cliente: "Nuevo Cliente",
        proyecto: "Nuevo Proyecto",
        monto: 15000,
      };
      const mockResult = { insertId: 2 };

      pool.execute.mockResolvedValueOnce([mockResult]); // Inserción
      pool.execute.mockResolvedValueOnce([
        [{ id: 2, ...newQuotation, estado: "borrador" }],
      ]); // Obtener creado

      const response = await request(app)
        .post("/api/quotations")
        .send(newQuotation)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(2);
    });
  });
});
