const request = require("supertest");
const app = require("../../backend/server");

describe("Pruebas de Regresión", () => {
  test("1. API de Proyectos - Crear proyecto existente", async () => {
    // Primero crear un proyecto
    await request(app).post("/api/projects").send({
      name: "Proyecto Regresión",
      description: "Descripción de prueba",
      budget: 10000,
    });

    // Intentar crear el mismo proyecto
    const response = await request(app).post("/api/projects").send({
      name: "Proyecto Regresión",
      description: "Descripción de prueba",
      budget: 10000,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toContain("ya existe");
  });

  test("2. API de Usuarios - Actualizar usuario inexistente", async () => {
    const response = await request(app).put("/api/users/99999").send({
      name: "Usuario Inexistente",
      email: "inexistente@test.com",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("no encontrado");
  });

  test("3. API de Presupuestos - Eliminar presupuesto con dependencias", async () => {
    // Crear presupuesto
    const budgetResponse = await request(app).post("/api/budgets").send({
      name: "Presupuesto con Dependencias",
      amount: 50000,
      projectId: 1,
    });

    const budgetId = budgetResponse.body.id;

    // Intentar eliminar
    const deleteResponse = await request(app).delete(
      `/api/budgets/${budgetId}`
    );

    expect(deleteResponse.status).toBe(400);
    expect(deleteResponse.body.message).toContain("dependencias");
  });

  test("4. Validaciones - Email duplicado en registro", async () => {
    // Registrar usuario
    await request(app).post("/api/auth/register").send({
      name: "Usuario Original",
      email: "duplicado@test.com",
      password: "password123",
    });

    // Intentar registrar con mismo email
    const response = await request(app).post("/api/auth/register").send({
      name: "Usuario Duplicado",
      email: "duplicado@test.com",
      password: "password456",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toContain("email ya existe");
  });

  test("5. API de Reportes - Generar reporte con datos insuficientes", async () => {
    const response = await request(app).post("/api/reports/generate").send({
      type: "monthly",
      // Faltan parámetros requeridos
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("parámetros requeridos");
  });

  test("6. API de Compras - Actualizar compra completada", async () => {
    // Crear compra completada
    const purchaseResponse = await request(app).post("/api/purchases").send({
      description: "Compra Completada",
      amount: 1000,
      status: "completed",
    });

    const purchaseId = purchaseResponse.body.id;

    // Intentar actualizar
    const updateResponse = await request(app)
      .put(`/api/purchases/${purchaseId}`)
      .send({
        amount: 1500,
      });

    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body.message).toContain("no se puede modificar");
  });

  test("7. API de Estrategias - Eliminar estrategia en uso", async () => {
    // Crear estrategia
    const strategyResponse = await request(app).post("/api/strategies").send({
      name: "Estrategia en Uso",
      description: "Descripción",
    });

    const strategyId = strategyResponse.body.id;

    // Simular que está en uso (esto requeriría lógica adicional en la app)
    // Para esta prueba, asumimos que la validación existe
    const deleteResponse = await request(app).delete(
      `/api/strategies/${strategyId}`
    );

    // Debería fallar si está en uso
    expect([400, 409]).toContain(deleteResponse.status);
  });

  test("8. API de Cotizaciones - Aprobar cotización expirada", async () => {
    // Crear cotización expirada
    const quotationResponse = await request(app)
      .post("/api/quotations")
      .send({
        description: "Cotización Expirada",
        amount: 5000,
        expiryDate: new Date(Date.now() - 86400000).toISOString(), // Fecha pasada
      });

    const quotationId = quotationResponse.body.id;

    // Intentar aprobar
    const approveResponse = await request(app).post(
      `/api/quotations/${quotationId}/approve`
    );

    expect(approveResponse.status).toBe(400);
    expect(approveResponse.body.message).toContain("expirada");
  });

  test("9. Autenticación - Token expirado", async () => {
    // Simular token expirado
    const response = await request(app)
      .get("/api/protected-route")
      .set("Authorization", "Bearer expired_token_here");

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("token expirado");
  });

  test("10. Integridad de datos - Relaciones entre entidades", async () => {
    // Crear proyecto
    const projectResponse = await request(app).post("/api/projects").send({
      name: "Proyecto con Relaciones",
      description: "Descripción",
      budget: 20000,
    });

    const projectId = projectResponse.body.id;

    // Crear presupuesto para el proyecto
    await request(app).post("/api/budgets").send({
      name: "Presupuesto Relacionado",
      amount: 15000,
      projectId: projectId,
    });

    // Verificar que el presupuesto aparece en el proyecto
    const projectWithBudgets = await request(app).get(
      `/api/projects/${projectId}`
    );

    expect(projectWithBudgets.body.budgets).toBeDefined();
    expect(projectWithBudgets.body.budgets.length).toBeGreaterThan(0);
  });
});
