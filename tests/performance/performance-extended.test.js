const request = require("supertest");
const app = require("../../backend/server");

describe("Pruebas de Rendimiento Extendidas", () => {
  test("1. Tiempo de respuesta API - Endpoint de proyectos", async () => {
    const startTime = Date.now();
    const response = await request(app).get("/api/projects");
    const responseTime = Date.now() - startTime;

    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(500); // Menos de 500ms
  });

  test("2. Throughput - Múltiples solicitudes concurrentes", async () => {
    const numberOfRequests = 50;
    const startTime = Date.now();

    const requests = [];
    for (let i = 0; i < numberOfRequests; i++) {
      requests.push(request(app).get("/api/projects"));
    }

    const responses = await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    const successfulResponses = responses.filter((r) => r.status === 200);
    expect(successfulResponses.length).toBe(numberOfRequests);

    const throughput = numberOfRequests / (totalTime / 1000); // solicitudes por segundo
    expect(throughput).toBeGreaterThan(10); // Al menos 10 req/seg
  });

  test("3. Memory Usage - Creación masiva de proyectos", async () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Crear 100 proyectos
    const createPromises = [];
    for (let i = 0; i < 100; i++) {
      createPromises.push(
        request(app)
          .post("/api/projects")
          .send({
            name: `Proyecto Rendimiento ${i}`,
            description: `Descripción del proyecto ${i}`,
            budget: 10000 + i,
          })
      );
    }

    await Promise.all(createPromises);
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // El aumento de memoria debería ser razonable (< 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  test("4. Database Query Performance - Consultas complejas", async () => {
    // Crear datos de prueba
    for (let i = 0; i < 50; i++) {
      await request(app)
        .post("/api/projects")
        .send({
          name: `Proyecto Query ${i}`,
          description: `Descripción ${i}`,
          budget: Math.floor(Math.random() * 100000),
          status: i % 2 === 0 ? "active" : "completed",
        });
    }

    const startTime = Date.now();
    const response = await request(app).get("/api/projects").query({
      status: "active",
      budget_min: 25000,
      sort: "budget",
      limit: 20,
    });
    const queryTime = Date.now() - startTime;

    expect(response.status).toBe(200);
    expect(queryTime).toBeLessThan(1000); // Menos de 1 segundo
  });

  test("5. Caching Effectiveness - Respuestas cacheadas", async () => {
    // Primera solicitud
    const firstStart = Date.now();
    const firstResponse = await request(app).get("/api/projects");
    const firstTime = Date.now() - firstStart;

    // Segunda solicitud (debería ser más rápida si hay cache)
    const secondStart = Date.now();
    const secondResponse = await request(app).get("/api/projects");
    const secondTime = Date.now() - secondStart;

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    // La segunda solicitud debería ser al menos 20% más rápida
    expect(secondTime).toBeLessThan(firstTime * 0.8);
  });

  test("6. Connection Pool Efficiency - Múltiples conexiones DB", async () => {
    const concurrentQueries = 20;
    const startTime = Date.now();

    const queries = [];
    for (let i = 0; i < concurrentQueries; i++) {
      queries.push(request(app).get("/api/projects").query({ limit: 5 }));
    }

    const responses = await Promise.all(queries);
    const totalTime = Date.now() - startTime;

    const successfulResponses = responses.filter((r) => r.status === 200);
    expect(successfulResponses.length).toBe(concurrentQueries);

    const avgResponseTime = totalTime / concurrentQueries;
    expect(avgResponseTime).toBeLessThan(300); // Menos de 300ms promedio
  });

  test("7. File Upload Performance - Archivos grandes", async () => {
    const largeFile = Buffer.alloc(1024 * 1024); // 1MB file
    const startTime = Date.now();

    const response = await request(app)
      .post("/api/files/upload")
      .attach("file", largeFile, "large-test-file.dat");

    const uploadTime = Date.now() - startTime;

    expect(response.status).toBe(201);
    expect(uploadTime).toBeLessThan(5000); // Menos de 5 segundos
  });

  test("8. API Response Size - Paginación eficiente", async () => {
    // Crear muchos proyectos
    const createPromises = [];
    for (let i = 0; i < 200; i++) {
      createPromises.push(
        request(app)
          .post("/api/projects")
          .send({
            name: `Proyecto Paginación ${i}`,
            description: `Descripción ${i}`,
            budget: 10000,
          })
      );
    }
    await Promise.all(createPromises);

    // Probar paginación
    const pageResponse = await request(app)
      .get("/api/projects")
      .query({ page: 1, limit: 20 });

    expect(pageResponse.status).toBe(200);
    expect(pageResponse.body.data.length).toBe(20);
    expect(pageResponse.body.totalPages).toBeDefined();
    expect(pageResponse.body.currentPage).toBe(1);
  });

  test("9. Background Job Performance - Procesamiento asíncrono", async () => {
    // Iniciar un trabajo en background (ej: generar reporte)
    const jobStartTime = Date.now();
    const jobResponse = await request(app).post("/api/reports/generate").send({
      type: "comprehensive",
      async: true,
    });

    expect(jobResponse.status).toBe(202); // Accepted
    const jobId = jobResponse.body.jobId;

    // Esperar a que termine el trabajo
    let jobStatus;
    let attempts = 0;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const statusResponse = await request(app).get(
        `/api/jobs/${jobId}/status`
      );
      jobStatus = statusResponse.body.status;
      attempts++;
    } while (jobStatus === "processing" && attempts < 30);

    const jobTotalTime = Date.now() - jobStartTime;

    expect(jobStatus).toBe("completed");
    expect(jobTotalTime).toBeLessThan(30000); // Menos de 30 segundos
  });

  test("10. Resource Cleanup - Manejo de memoria y conexiones", async () => {
    const initialConnections = process._getActiveHandles().length;

    // Realizar operaciones intensivas
    const operations = [];
    for (let i = 0; i < 100; i++) {
      operations.push(
        request(app)
          .get("/api/projects")
          .then(() =>
            request(app)
              .post("/api/projects")
              .send({
                name: `Temp Project ${i}`,
                description: "Temporary",
              })
          )
      );
    }

    await Promise.all(operations);

    // Pequeña pausa para cleanup
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const finalConnections = process._getActiveHandles().length;

    // Las conexiones deberían haber sido liberadas
    expect(finalConnections).toBeLessThanOrEqual(initialConnections + 5);
  });
});
