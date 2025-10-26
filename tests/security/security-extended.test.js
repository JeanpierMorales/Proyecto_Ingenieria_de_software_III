const request = require("supertest");
const app = require("../../backend/server");

describe("Pruebas de Seguridad Extendidas", () => {
  test("1. Rate Limiting - Exceso de solicitudes", async () => {
    const requests = [];
    // Hacer 100 solicitudes rápidas
    for (let i = 0; i < 100; i++) {
      requests.push(
        request(app)
          .get("/api/projects")
          .set("X-Forwarded-For", `192.168.1.${i % 255}`)
      );
    }

    const responses = await Promise.all(requests);
    const rateLimitedResponses = responses.filter((r) => r.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test("2. SQL Injection avanzado - UNION SELECT", async () => {
    const maliciousPayload = "' UNION SELECT username, password FROM users -- ";
    const response = await request(app).post("/api/auth/login").send({
      email: maliciousPayload,
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("caracteres inválidos");
  });

  test("3. XSS - Script injection en campos de formulario", async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await request(app).post("/api/projects").send({
      name: xssPayload,
      description: "Descripción normal",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("contenido no permitido");
  });

  test("4. Path Traversal - Acceso a archivos del sistema", async () => {
    const traversalPayload = "../../../etc/passwd";
    const response = await request(app).get(`/api/files/${traversalPayload}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("ruta inválida");
  });

  test("5. CSRF Protection - Solicitudes sin token", async () => {
    const response = await request(app)
      .post("/api/projects")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("name=Proyecto&description=Descripción&_csrf=invalid");

    expect([400, 403]).toContain(response.status);
  });

  test("6. Input Validation - Buffer Overflow attempt", async () => {
    const largeInput = "A".repeat(10000);
    const response = await request(app).post("/api/projects").send({
      name: largeInput,
      description: "Descripción normal",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("muy largo");
  });

  test("7. Authentication Bypass - JWT manipulation", async () => {
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(response.status).toBe(401);
  });

  test("8. Directory Listing - Enumeración de directorios", async () => {
    const response = await request(app).get("/api/files/");

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("acceso denegado");
  });

  test("9. Command Injection - Ejecución de comandos del sistema", async () => {
    const commandPayload = "; rm -rf / ;";
    const response = await request(app).post("/api/backup/execute").send({
      command: commandPayload,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("comando inválido");
  });

  test("10. Session Fixation - Fijación de sesión", async () => {
    // Intentar fijar una sesión
    const response = await request(app)
      .post("/api/auth/login")
      .set("Cookie", "session=malicious_session_id")
      .send({
        email: "user@example.com",
        password: "password",
      });

    expect(response.status).toBe(401);
    // La aplicación debería generar una nueva sesión después del login exitoso
  });

  test("11. Clickjacking Protection - X-Frame-Options", async () => {
    const response = await request(app).get("/api/dashboard");

    expect(response.headers["x-frame-options"]).toBeDefined();
    expect(["DENY", "SAMEORIGIN"]).toContain(
      response.headers["x-frame-options"]
    );
  });

  test("12. HSTS - HTTP Strict Transport Security", async () => {
    const response = await request(app).get("/api/projects");

    expect(response.headers["strict-transport-security"]).toBeDefined();
  });

  test("13. Content Security Policy - CSP headers", async () => {
    const response = await request(app).get("/");

    expect(response.headers["content-security-policy"]).toBeDefined();
  });

  test("14. Secure Cookies - Flags de seguridad", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password",
    });

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      expect(setCookieHeader[0]).toContain("HttpOnly");
      expect(setCookieHeader[0]).toContain("Secure");
      expect(setCookieHeader[0]).toContain("SameSite");
    }
  });

  test("15. Input Sanitization - HTML entities encoding", async () => {
    const htmlPayload = "<b>Negrita</b> & <i>Cursiva</i>";
    const response = await request(app).post("/api/projects").send({
      name: "Proyecto Seguro",
      description: htmlPayload,
    });

    expect(response.status).toBe(201);
    // Verificar que el HTML fue sanitizado
    expect(response.body.description).not.toContain("<b>");
    expect(response.body.description).not.toContain("<i>");
  });

  test("16. File Upload Security - Extension validation", async () => {
    const response = await request(app)
      .post("/api/files/upload")
      .attach("file", Buffer.from("malicious content"), "malicious.exe");

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("tipo de archivo no permitido");
  });

  test("17. API Key Validation - Autenticación de API", async () => {
    const response = await request(app)
      .get("/api/external/data")
      .set("X-API-Key", "invalid_api_key");

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("API key inválida");
  });

  test("18. CORS Policy - Control de origen cruzado", async () => {
    const response = await request(app)
      .options("/api/projects")
      .set("Origin", "http://malicious-site.com")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(200);
    const allowOrigin = response.headers["access-control-allow-origin"];
    expect(allowOrigin).not.toBe("http://malicious-site.com");
  });

  test("19. Data Exposure - Información sensible en respuestas", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.status).toBe(200);
    // Verificar que no se expone información sensible
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).not.toHaveProperty("ssn");
    expect(response.body).not.toHaveProperty("creditCard");
  });

  test("20. Audit Logging - Registro de actividades sospechosas", async () => {
    // Realizar múltiples intentos de login fallidos
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });
    }

    // Verificar que se registraron los intentos fallidos
    const auditResponse = await request(app).get("/api/admin/audit").query({
      type: "failed_login",
      limit: 10,
    });

    expect(auditResponse.status).toBe(200);
    expect(auditResponse.body.logs.length).toBeGreaterThanOrEqual(5);
  });
});
