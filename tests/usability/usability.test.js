const puppeteer = require("puppeteer");

describe("Pruebas de Usabilidad", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("1. Navegación al Dashboard - Verificar carga inicial", async () => {
    await page.goto("http://localhost:5173/dashboard");
    const title = await page.title();
    expect(title).toBe("Dashboard");
    const dashboardElement = await page.$(
      '[data-testid="dashboard-container"]'
    );
    expect(dashboardElement).toBeTruthy();
  });

  test("2. Interacción con formulario de proyecto - Completar campos", async () => {
    await page.goto("http://localhost:5173/projects/new");
    await page.type('[data-testid="project-name"]', "Proyecto de Prueba");
    await page.type(
      '[data-testid="project-description"]',
      "Descripción de prueba"
    );
    await page.click('[data-testid="submit-project"]');
    await page.waitForSelector('[data-testid="success-message"]');
    const message = await page.$eval(
      '[data-testid="success-message"]',
      (el) => el.textContent
    );
    expect(message).toContain("Proyecto creado");
  });

  test("3. Navegación entre páginas - Usar menú de navegación", async () => {
    await page.goto("http://localhost:5173/dashboard");
    await page.click('[data-testid="nav-quotations"]');
    await page.waitForSelector('[data-testid="quotations-page"]');
    const url = page.url();
    expect(url).toContain("/quotations");
  });

  test("4. Validación de formulario - Mensajes de error visibles", async () => {
    await page.goto("http://localhost:5173/projects/new");
    await page.click('[data-testid="submit-project"]');
    await page.waitForSelector('[data-testid="error-name"]');
    const error = await page.$eval(
      '[data-testid="error-name"]',
      (el) => el.textContent
    );
    expect(error).toContain("Nombre requerido");
  });

  test("5. Accesibilidad - Elementos con etiquetas adecuadas", async () => {
    await page.goto("http://localhost:5173/dashboard");
    const inputs = await page.$$("input");
    for (const input of inputs) {
      const ariaLabel = await page.evaluate(
        (el) => el.getAttribute("aria-label"),
        input
      );
      expect(ariaLabel).toBeTruthy();
    }
  });

  test("6. Respuesta visual - Cambios en hover", async () => {
    await page.goto("http://localhost:5173/dashboard");
    const button = await page.$('[data-testid="action-button"]');
    const initialColor = await page.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
      button
    );
    await button.hover();
    const hoverColor = await page.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
      button
    );
    expect(hoverColor).not.toBe(initialColor);
  });

  test("7. Flujo completo - Crear y editar proyecto", async () => {
    await page.goto("http://localhost:5173/projects/new");
    await page.type('[data-testid="project-name"]', "Proyecto Completo");
    await page.type(
      '[data-testid="project-description"]',
      "Descripción completa"
    );
    await page.click('[data-testid="submit-project"]');
    await page.waitForSelector('[data-testid="project-list"]');
    await page.click('[data-testid="edit-project-1"]');
    await page.type('[data-testid="project-name"]', " (Editado)");
    await page.click('[data-testid="submit-project"]');
    const updatedName = await page.$eval(
      '[data-testid="project-1-name"]',
      (el) => el.textContent
    );
    expect(updatedName).toBe("Proyecto Completo (Editado)");
  });

  test("8. Manejo de errores - Página 404", async () => {
    await page.goto("http://localhost:5173/nonexistent");
    const errorMessage = await page.$eval(
      '[data-testid="404-message"]',
      (el) => el.textContent
    );
    expect(errorMessage).toContain("Página no encontrada");
  });

  test("9. Rendimiento de carga - Tiempo de respuesta", async () => {
    const startTime = Date.now();
    await page.goto("http://localhost:5173/dashboard");
    await page.waitForSelector('[data-testid="dashboard-container"]');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Menos de 3 segundos
  });

  test("10. Compatibilidad móvil - Vista responsive", async () => {
    await page.setViewport({ width: 375, height: 667 });
    await page.goto("http://localhost:5173/dashboard");
    const menu = await page.$('[data-testid="mobile-menu"]');
    expect(menu).toBeTruthy();
    const isVisible = await page.evaluate((el) => el.offsetWidth > 0, menu);
    expect(isVisible).toBe(true);
  });
});
