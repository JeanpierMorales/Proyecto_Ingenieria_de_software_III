/**
 * Pruebas unitarias para funciones de validación
 * Cada prueba mostrará en consola si pasó o falló
 * y detalles de errores en caso de datos inválidos.
 */

const {
  validateEmail,
  validatePassword,
  validateRequired,
  validateNumber,
  validateProject,
  validateUser,
  validateBudget,
  validateReport,
  validatePurchase,
  validateStrategy,
  validateQuotation,
} = require("../../src/utils/validations");

// Función auxiliar para mostrar resultados en consola
function logResult(testName, result) {
  if (result) {
    console.log(`✅ ${testName} pasó correctamente.`);
  } else {
    console.log(`❌ ${testName} falló.`);
  }
}

describe("Funciones de validación con consola", () => {
  // VALIDACIÓN DE CORREO ELECTRÓNICO
  describe("validateEmail", () => {
    test("formatos válidos", () => {
      logResult(
        "validateEmail('test@example.com')",
        validateEmail("test@example.com")
      );
      logResult(
        "validateEmail('user.name+tag@domain.co.uk')",
        validateEmail("user.name+tag@domain.co.uk")
      );
    });

    test("formatos inválidos", () => {
      logResult(
        "validateEmail('invalid-email')",
        !validateEmail("invalid-email")
      );
      logResult("validateEmail('test@')", !validateEmail("test@"));
      logResult(
        "validateEmail('@example.com')",
        !validateEmail("@example.com")
      );
      logResult("validateEmail('')", !validateEmail(""));
    });
  });

  // VALIDACIÓN DE CONTRASEÑAS
  describe("validatePassword", () => {
    test("contraseñas válidas", () => {
      logResult("validatePassword('123456')", validatePassword("123456"));
      logResult(
        "validatePassword('password123')",
        validatePassword("password123")
      );
    });

    test("contraseñas inválidas", () => {
      logResult("validatePassword('12345')", !validatePassword("12345"));
      logResult("validatePassword('')", !validatePassword(""));
      logResult("validatePassword(null)", !validatePassword(null));
      logResult("validatePassword(undefined)", !validatePassword(undefined));
    });
  });

  // VALIDACIÓN DE CAMPOS REQUERIDOS
  describe("validateRequired", () => {
    test("valores válidos", () => {
      logResult("validateRequired('test')", validateRequired("test"));
      logResult("validateRequired('  test  ')", validateRequired("  test  "));
      logResult("validateRequired(123)", validateRequired(123));
    });

    test("valores inválidos", () => {
      logResult("validateRequired('')", !validateRequired(""));
      logResult("validateRequired('   ')", !validateRequired("   "));
      logResult("validateRequired(null)", !validateRequired(null));
      logResult("validateRequired(undefined)", !validateRequired(undefined));
    });
  });

  // VALIDACIÓN DE NÚMEROS POSITIVOS
  describe("validateNumber", () => {
    test("números válidos", () => {
      logResult("validateNumber(100)", validateNumber(100));
      logResult("validateNumber(0.5)", validateNumber(0.5));
      logResult("validateNumber('100')", validateNumber("100"));
    });

    test("números inválidos", () => {
      logResult("validateNumber(0)", !validateNumber(0));
      logResult("validateNumber(-1)", !validateNumber(-1));
      logResult("validateNumber('abc')", !validateNumber("abc"));
      logResult("validateNumber(null)", !validateNumber(null));
    });
  });

  // VALIDACIÓN DE PROYECTOS
  describe("validateProject", () => {
    test("proyecto válido", () => {
      const validProject = {
        nombre: "Proyecto de prueba",
        descripcion: "Descripción de prueba",
        presupuesto: 10000,
        fechaInicio: "2024-01-01",
      };
      const result = validateProject(validProject);
      logResult("validateProject(validProject)", result.isValid);
      if (!result.isValid) console.log("Errores:", result.errors);
    });

    test("proyecto inválido", () => {
      const invalidProject = {
        nombre: "",
        descripcion: "",
        presupuesto: -100,
      };
      const result = validateProject(invalidProject);
      logResult("validateProject(invalidProject)", !result.isValid);
      console.log("Errores:", result.errors);
    });
  });

  // VALIDACIÓN DE USUARIOS
  describe("validateUser", () => {
    test("usuario válido", () => {
      const validUser = {
        nombre: "Usuario de prueba",
        email: "test@example.com",
        password: "password123",
        rol: "analista",
      };
      const result = validateUser(validUser);
      logResult("validateUser(validUser)", result.isValid);
      if (!result.isValid) console.log("Errores:", result.errors);
    });

    test("usuario inválido", () => {
      const invalidUser = {
        nombre: "",
        email: "correo-invalido",
        password: "123",
        rol: "",
      };
      const result = validateUser(invalidUser);
      logResult("validateUser(invalidUser)", !result.isValid);
      console.log("Errores:", result.errors);
    });
  });

  // VALIDACIÓN DE PRESUPUESTOS
  describe("validateBudget", () => {
    test("presupuesto válido", () => {
      const validBudget = {
        nombre: "Presupuesto de prueba",
        monto: 5000,
        proyectoId: 1,
      };
      const result = validateBudget(validBudget);
      logResult("validateBudget(validBudget)", result.isValid);
      if (!result.isValid) console.log("Errores:", result.errors);
    });

    test("presupuesto inválido", () => {
      const invalidBudget = {
        nombre: "",
        monto: 0,
        proyectoId: null,
      };
      const result = validateBudget(invalidBudget);
      logResult("validateBudget(invalidBudget)", !result.isValid);
      console.log("Errores:", result.errors);
    });
  });

  // VALIDACIÓN DE REPORTES
  describe("validateReport", () => {
    test("reporte válido", () => {
      const validReport = {
        titulo: "Reporte de prueba",
        tipo: "mensual",
        proyectoId: 1,
        progreso: 50,
      };
      const result = validateReport(validReport);
      logResult("validateReport(validReport)", result.isValid);
      if (!result.isValid) console.log("Errores:", result.errors);
    });

    test("reporte inválido", () => {
      const invalidReport = {
        titulo: "",
        tipo: "",
        proyectoId: null,
        progreso: 150,
      };
      const result = validateReport(invalidReport);
      logResult("validateReport(invalidReport)", !result.isValid);
      console.log("Errores:", result.errors);
    });
  });

  // VALIDACIÓN DE COMPRAS
  describe("validatePurchase", () => {
    test("compra válida", () => {
      const validPurchase = {
        descripcion: "Compra de prueba",
        categoria: "software",
        monto: 1000,
        proyectoId: 1,
        proveedor: "Proveedor de prueba",
      };
      const result = validatePurchase(validPurchase);
      logResult("validatePurchase(validPurchase)", result.isValid);
      if (!result.isValid) console.log("Errores:", result.errors);
    });

    test("compra inválida", () => {
      const invalidPurchase = {
        descripcion: "",
        categoria: "",
        monto: 0,
        proyectoId: null,
        proveedor: "",
      };
      const result = validatePurchase(invalidPurchase);
      logResult("validatePurchase(invalidPurchase)", !result.isValid);
      console.log("Errores:", result.errors);
    });
  });

  // VALIDACIÓN DE ESTRATEGIAS
  describe("validateStrategy", () => {
    test("estrategia válida", () => {
      const validStrategy = {
        nombre: "Estrategia de prueba",
        descripcion: "Descripción de prueba",
        tipo: "proceso",
        prioridad: "alta",
        proyectoId: 1,
        fechaInicio: "2024-01-01",
        responsable: "Usuario de prueba",
      };
      const result = validateStrategy(validStrategy);
      logResult("validateStrategy(validStrategy)", result.isValid);
      if (!result.isValid) console.log("Errores:", result.errors);
    });

    test("estrategia inválida", () => {
      const invalidStrategy = {
        nombre: "",
        descripcion: "",
        tipo: "",
        prioridad: "",
        proyectoId: null,
        responsable: "",
      };
      const result = validateStrategy(invalidStrategy);
      logResult("validateStrategy(invalidStrategy)", !result.isValid);
      console.log("Errores:", result.errors);
    });
  });

  // VALIDACIÓN DE COTIZACIONES
  describe("validateQuotation", () => {
    test("cotización válida", () => {
      const validQuotation = {
        numero: "COT-2024-001",
        cliente: "Cliente de prueba",
        proyecto: "Proyecto de prueba",
        monto: 10000,
        fechaCreacion: "2024-01-01",
        vigencia: "2024-12-31",
      };
      const result = validateQuotation(validQuotation);
      logResult("validateQuotation(validQuotation)", result.isValid);
      if (!result.isValid) console.log("Errores:", result.errors);
    });

    test("cotización inválida", () => {
      const invalidQuotation = {
        numero: "",
        cliente: "",
        proyecto: "",
        monto: 0,
      };
      const result = validateQuotation(invalidQuotation);
      logResult("validateQuotation(invalidQuotation)", !result.isValid);
      console.log("Errores:", result.errors);
    });
  });
});
