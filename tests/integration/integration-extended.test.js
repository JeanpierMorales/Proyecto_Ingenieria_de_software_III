const request = require("supertest");
const app = require("../../backend/server");

describe("Pruebas de Integración Extendidas", () => {
  test("1. Flujo completo de proyecto - Crear, asignar presupuesto y generar reporte", async () => {
    // Crear proyecto
    const projectResponse = await request(app).post("/api/projects").send({
      name: "Proyecto Completo",
      description: "Proyecto para pruebas de integración",
      budget: 50000,
    });

    expect(projectResponse.status).toBe(201);
    const projectId = projectResponse.body.id;

    // Crear presupuesto para el proyecto
    const budgetResponse = await request(app).post("/api/budgets").send({
      name: "Presupuesto Principal",
      amount: 40000,
      projectId: projectId,
    });

    expect(budgetResponse.status).toBe(201);

    // Crear cotización
    const quotationResponse = await request(app).post("/api/quotations").send({
      description: "Cotización de servicios",
      amount: 35000,
      projectId: projectId,
    });

    expect(quotationResponse.status).toBe(201);

    // Generar reporte del proyecto
    const reportResponse = await request(app)
      .post("/api/reports/generate")
      .send({
        projectId: projectId,
        type: "project-summary",
      });

    expect(reportResponse.status).toBe(200);
    expect(reportResponse.body.project).toBeDefined();
    expect(reportResponse.body.budget).toBeDefined();
    expect(reportResponse.body.quotations).toBeDefined();
  });

  test("2. Gestión de usuarios - Registro, login y actualización de perfil", async () => {
    // Registro
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Usuario Integración",
        email: "integracion@test.com",
        password: "password123",
        role: "manager",
      });

    expect(registerResponse.status).toBe(201);
    const userId = registerResponse.body.user.id;

    // Login
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "integracion@test.com",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    const token = loginResponse.body.token;

    // Actualizar perfil
    const updateResponse = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Usuario Integración Actualizado",
        phone: "+1234567890",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.user.name).toBe(
      "Usuario Integración Actualizado"
    );
  });

  test("3. Sistema de compras - Crear orden, aprobar y registrar pago", async () => {
    // Crear orden de compra
    const orderResponse = await request(app)
      .post("/api/purchase-orders")
      .send({
        description: "Orden de compra de equipo",
        items: [
          { name: "Laptop", quantity: 2, unitPrice: 1500 },
          { name: "Monitor", quantity: 2, unitPrice: 300 },
        ],
        totalAmount: 3600,
      });

    expect(orderResponse.status).toBe(201);
    const orderId = orderResponse.body.id;

    // Aprobar orden
    const approveResponse = await request(app)
      .post(`/api/purchase-orders/${orderId}/approve`)
      .send({
        approvedBy: "manager@example.com",
        comments: "Aprobado para proyecto",
      });

    expect(approveResponse.status).toBe(200);

    // Registrar pago
    const paymentResponse = await request(app).post(`/api/payments`).send({
      orderId: orderId,
      amount: 3600,
      method: "transfer",
      reference: "PAY-001",
    });

    expect(paymentResponse.status).toBe(201);

    // Verificar estado final
    const finalOrder = await request(app).get(
      `/api/purchase-orders/${orderId}`
    );

    expect(finalOrder.body.status).toBe("paid");
  });

  test("4. Gestión de inventario - Agregar producto, actualizar stock y generar alerta", async () => {
    // Agregar producto al inventario
    const productResponse = await request(app)
      .post("/api/inventory/products")
      .send({
        name: "Producto de Prueba",
        description: "Producto para integración",
        category: "Herramientas",
        unitPrice: 50,
        minStock: 10,
      });

    expect(productResponse.status).toBe(201);
    const productId = productResponse.body.id;

    // Agregar stock inicial
    const stockResponse = await request(app)
      .post(`/api/inventory/products/${productId}/stock`)
      .send({
        quantity: 25,
        type: "initial",
        notes: "Stock inicial",
      });

    expect(stockResponse.status).toBe(200);

    // Simular venta/reducción de stock
    const reduceResponse = await request(app)
      .post(`/api/inventory/products/${productId}/stock`)
      .send({
        quantity: -20,
        type: "sale",
        notes: "Venta de productos",
      });

    expect(reduceResponse.status).toBe(200);

    // Verificar alerta de stock bajo
    const alertsResponse = await request(app).get("/api/inventory/alerts");

    expect(alertsResponse.status).toBe(200);
    const lowStockAlert = alertsResponse.body.find(
      (alert) => alert.productId === productId && alert.type === "low_stock"
    );
    expect(lowStockAlert).toBeDefined();
  });

  test("5. Sistema de notificaciones - Crear evento y verificar notificaciones", async () => {
    // Crear proyecto que active notificaciones
    const projectResponse = await request(app)
      .post("/api/projects")
      .send({
        name: "Proyecto con Notificaciones",
        description: "Proyecto para probar notificaciones",
        budget: 100000,
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Mañana
      });

    expect(projectResponse.status).toBe(201);
    const projectId = projectResponse.body.id;

    // Simular que se acerca la fecha límite (esto normalmente sería por un job)
    await request(app).post("/api/notifications/trigger").send({
      type: "deadline_approaching",
      projectId: projectId,
    });

    // Verificar notificaciones generadas
    const notificationsResponse = await request(app)
      .get("/api/notifications")
      .query({ userId: 1 }); // Asumiendo usuario admin

    expect(notificationsResponse.status).toBe(200);
    const deadlineNotification = notificationsResponse.body.find(
      (n) => n.type === "deadline_approaching" && n.projectId === projectId
    );
    expect(deadlineNotification).toBeDefined();
  });

  test("6. API de búsqueda - Búsqueda avanzada con filtros", async () => {
    // Crear datos de prueba
    await request(app).post("/api/projects").send({
      name: "Proyecto Alfa",
      description: "Proyecto de desarrollo",
      budget: 30000,
      status: "active",
    });

    await request(app).post("/api/projects").send({
      name: "Proyecto Beta",
      description: "Proyecto de marketing",
      budget: 20000,
      status: "completed",
    });

    // Búsqueda por nombre
    const searchResponse = await request(app).get("/api/search").query({
      q: "Alfa",
      type: "projects",
    });

    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.results.length).toBe(1);
    expect(searchResponse.body.results[0].name).toBe("Proyecto Alfa");

    // Búsqueda con filtros
    const filteredResponse = await request(app).get("/api/search").query({
      type: "projects",
      status: "active",
      budget_min: 25000,
    });

    expect(filteredResponse.status).toBe(200);
    expect(filteredResponse.body.results.length).toBe(1);
    expect(filteredResponse.body.results[0].status).toBe("active");
  });

  test("7. Sistema de respaldo - Crear respaldo y verificar integridad", async () => {
    // Crear respaldo
    const backupResponse = await request(app).post("/api/backup/create").send({
      type: "full",
      description: "Respaldo de integración",
    });

    expect(backupResponse.status).toBe(200);
    const backupId = backupResponse.body.backupId;

    // Verificar estado del respaldo
    const statusResponse = await request(app).get(
      `/api/backup/${backupId}/status`
    );

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.status).toBe("completed");

    // Verificar integridad del respaldo
    const integrityResponse = await request(app).post(
      `/api/backup/${backupId}/verify`
    );

    expect(integrityResponse.status).toBe(200);
    expect(integrityResponse.body.integrity).toBe("valid");
  });

  test("8. API de analytics - Generar métricas y reportes", async () => {
    // Crear datos para analytics
    await request(app)
      .post("/api/projects")
      .send({
        name: "Proyecto Analytics 1",
        budget: 50000,
        status: "completed",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
      });

    await request(app).post("/api/projects").send({
      name: "Proyecto Analytics 2",
      budget: 75000,
      status: "active",
      createdAt: new Date(),
    });

    // Generar métricas
    const metricsResponse = await request(app)
      .get("/api/analytics/metrics")
      .query({
        period: "month",
        type: "projects",
      });

    expect(metricsResponse.status).toBe(200);
    expect(metricsResponse.body.totalProjects).toBeDefined();
    expect(metricsResponse.body.totalBudget).toBeDefined();
    expect(metricsResponse.body.completionRate).toBeDefined();

    // Generar reporte de analytics
    const reportResponse = await request(app)
      .post("/api/analytics/reports")
      .send({
        type: "monthly-summary",
        format: "json",
      });

    expect(reportResponse.status).toBe(200);
    expect(reportResponse.body.summary).toBeDefined();
  });

  test("9. Gestión de permisos - Verificar control de acceso", async () => {
    // Crear usuario con rol limitado
    const userResponse = await request(app).post("/api/auth/register").send({
      name: "Usuario Limitado",
      email: "limited@test.com",
      password: "password123",
      role: "user",
    });

    const userId = userResponse.body.user.id;
    const token = userResponse.body.token;

    // Intentar acceder a endpoint administrativo
    const adminResponse = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(adminResponse.status).toBe(403);

    // Acceder a endpoint permitido
    const allowedResponse = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(allowedResponse.status).toBe(200);

    // Cambiar permisos del usuario
    await request(app)
      .put(`/api/admin/users/${userId}/permissions`)
      .send({
        permissions: ["read:projects", "write:projects"],
      });

    // Verificar nuevos permisos
    const permissionsResponse = await request(app)
      .get("/api/users/permissions")
      .set("Authorization", `Bearer ${token}`);

    expect(permissionsResponse.body.permissions).toContain("write:projects");
  });

  test("10. Sistema de auditoría - Registrar y consultar logs", async () => {
    // Realizar acción que genere log de auditoría
    const projectResponse = await request(app).post("/api/projects").send({
      name: "Proyecto Auditado",
      description: "Proyecto para auditoría",
      budget: 25000,
    });

    expect(projectResponse.status).toBe(201);
    const projectId = projectResponse.body.id;

    // Consultar logs de auditoría
    const auditResponse = await request(app).get("/api/audit/logs").query({
      entity: "projects",
      entityId: projectId,
      action: "create",
    });

    expect(auditResponse.status).toBe(200);
    expect(auditResponse.body.logs.length).toBeGreaterThan(0);

    const createLog = auditResponse.body.logs[0];
    expect(createLog.action).toBe("create");
    expect(createLog.entity).toBe("projects");
    expect(createLog.entityId).toBe(projectId);
    expect(createLog.userId).toBeDefined();
    expect(createLog.timestamp).toBeDefined();
  });
});
