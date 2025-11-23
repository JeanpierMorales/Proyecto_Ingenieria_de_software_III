import {
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
} from "../../src/utils/validations-extended.js";

// Función auxiliar para mostrar resultados
const logResult = (testName, passed, error = null) => {
  const status = passed ? "✅" : "❌";
  console.log(`${status} ${testName}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
};

describe("Validaciones Unitarias Completas", () => {
  describe("validateEmail", () => {
    test("debe validar emails correctos", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co",
        "test+tag@gmail.com",
      ];
      validEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result).toBe(true);
        logResult(`validateEmail(${email})`, result);
      });
    });

    test("debe rechazar emails inválidos", () => {
      const invalidEmails = [
        "invalid",
        "test@",
        "@domain.com",
        "test..test@domain.com",
      ];
      invalidEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result).toBe(false);
        logResult(`validateEmail(${email})`, !result);
      });
    });
  });

  describe("validatePassword", () => {
    test("debe validar contraseñas de al menos 6 caracteres", () => {
      const validPasswords = ["123456", "password", "abc123def"];
      validPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result).toBe(true);
        logResult(`validatePassword(${password})`, result);
      });
    });

    test("debe rechazar contraseñas cortas", () => {
      const invalidPasswords = ["", "12345", "abc"];
      invalidPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result).toBeFalsy();
        logResult(`validatePassword(${password})`, !result);
      });
    });
  });

  describe("validateRequired", () => {
    test("debe validar valores requeridos no vacíos", () => {
      const validValues = ["test", "123", "a"];
      validValues.forEach((value) => {
        const result = validateRequired(value);
        expect(result).toBe(true);
        logResult(`validateRequired(${value})`, result);
      });
    });

    test("debe rechazar valores vacíos", () => {
      const invalidValues = ["", "   ", null, undefined];
      invalidValues.forEach((value) => {
        const result = validateRequired(value);
        expect(result).toBeFalsy();
        logResult(`validateRequired(${value})`, !result);
      });
    });
  });

  describe("validateNumber", () => {
    test("debe validar números positivos", () => {
      const validNumbers = [1, 100, 999.99, "500"];
      validNumbers.forEach((value) => {
        const result = validateNumber(value);
        expect(result).toBe(true);
        logResult(`validateNumber(${value})`, result);
      });
    });

    test("debe rechazar números inválidos o negativos", () => {
      const invalidNumbers = [0, -1, "abc", "", null];
      invalidNumbers.forEach((value) => {
        const result = validateNumber(value);
        expect(result).toBe(false);
        logResult(`validateNumber(${value})`, !result);
      });
    });
  });

  describe("validateProject", () => {
    test("debe validar proyectos válidos", () => {
      const validProject = {
        nombre: "Proyecto Test",
        descripcion: "Descripción del proyecto",
        presupuesto: 50000,
        fechaInicio: "2024-01-01",
      };
      const result = validateProject(validProject);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      logResult("validateProject(valid)", result.isValid);
    });

    test("debe rechazar proyectos inválidos", () => {
      const invalidProject = {
        nombre: "",
        descripcion: "",
        presupuesto: -100,
        fechaInicio: "",
      };
      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors.nombre).toBeDefined();
      expect(result.errors.descripcion).toBeDefined();
      expect(result.errors.presupuesto).toBeDefined();
      expect(result.errors.fechaInicio).toBeDefined();
      logResult("validateProject(invalid)", !result.isValid);
    });
  });

  describe("validateUser", () => {
    test("debe validar usuarios válidos", () => {
      const validUser = {
        nombre: "Juan Pérez",
        email: "juan@example.com",
        password: "password123",
        rol: "analista",
      };
      const result = validateUser(validUser);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      logResult("validateUser(valid)", result.isValid);
    });

    test("debe rechazar usuarios inválidos", () => {
      const invalidUser = {
        nombre: "",
        email: "invalid-email",
        password: "123",
        rol: "",
      };
      const result = validateUser(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.nombre).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
      expect(result.errors.rol).toBeDefined();
      logResult("validateUser(invalid)", !result.isValid);
    });
  });

  describe("validateBudget", () => {
    test("debe validar presupuestos válidos", () => {
      const validBudget = {
        nombre: "Presupuesto Test",
        monto: 25000,
        proyectoId: 1,
      };
      const result = validateBudget(validBudget);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      logResult("validateBudget(valid)", result.isValid);
    });

    test("debe rechazar presupuestos inválidos", () => {
      const invalidBudget = {
        nombre: "",
        monto: 0,
        proyectoId: null,
      };
      const result = validateBudget(invalidBudget);
      expect(result.isValid).toBe(false);
      expect(result.errors.nombre).toBeDefined();
      expect(result.errors.monto).toBeDefined();
      expect(result.errors.proyectoId).toBeDefined();
      logResult("validateBudget(invalid)", !result.isValid);
    });
  });

  describe("validateReport", () => {
    test("debe validar reportes válidos", () => {
      const validReport = {
        titulo: "Informe Mensual - Enero 2024",
        tipo: "mensual",
        proyectoId: 1,
        progreso: 50,
      };
      const result = validateReport(validReport);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      logResult("validateReport(valid)", result.isValid);
    });

    test("debe rechazar reportes inválidos", () => {
      const invalidReport = {
        titulo: "",
        tipo: "invalido",
        proyectoId: null,
        progreso: 150,
      };
      const result = validateReport(invalidReport);
      expect(result.isValid).toBe(false);
      expect(result.errors.titulo).toBeDefined();
      expect(result.errors.tipo).toBeDefined();
      expect(result.errors.proyectoId).toBeDefined();
      expect(result.errors.progreso).toBeDefined();
      logResult("validateReport(invalid)", !result.isValid);
    });
  });

  describe("validatePurchase", () => {
    test("debe validar compras válidas", () => {
      const validPurchase = {
        descripcion: "Compra de software",
        categoria: "software",
        monto: 1000,
        proyectoId: 1,
        proveedor: "Proveedor XYZ",
      };
      const result = validatePurchase(validPurchase);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      logResult("validatePurchase(valid)", result.isValid);
    });

    test("debe rechazar compras inválidas", () => {
      const invalidPurchase = {
        descripcion: "",
        categoria: "",
        monto: 0,
        proyectoId: null,
        proveedor: "",
      };
      const result = validatePurchase(invalidPurchase);
      expect(result.isValid).toBe(false);
      expect(result.errors.descripcion).toBeDefined();
      expect(result.errors.categoria).toBeDefined();
      expect(result.errors.monto).toBeDefined();
      expect(result.errors.proyectoId).toBeDefined();
      expect(result.errors.proveedor).toBeDefined();
      logResult("validatePurchase(invalid)", !result.isValid);
    });
  });

  describe("validateStrategy", () => {
    test("debe validar estrategias válidas", () => {
      const validStrategy = {
        nombre: "Estrategia de Mejora",
        descripcion: "Descripción detallada",
        tipo: "proceso",
        prioridad: "alta",
        proyectoId: 1,
        fechaInicio: "2024-01-01",
        responsable: "Juan Pérez",
      };
      const result = validateStrategy(validStrategy);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      logResult("validateStrategy(valid)", result.isValid);
    });

    test("debe rechazar estrategias inválidas", () => {
      const invalidStrategy = {
        nombre: "",
        descripcion: "",
        tipo: "invalido",
        prioridad: "invalida",
        proyectoId: null,
        fechaInicio: "",
        responsable: "",
      };
      const result = validateStrategy(invalidStrategy);
      expect(result.isValid).toBe(false);
      expect(result.errors.nombre).toBeDefined();
      expect(result.errors.descripcion).toBeDefined();
      expect(result.errors.tipo).toBeDefined();
      expect(result.errors.prioridad).toBeDefined();
      expect(result.errors.proyectoId).toBeDefined();
      expect(result.errors.fechaInicio).toBeDefined();
      expect(result.errors.responsable).toBeDefined();
      logResult("validateStrategy(invalid)", !result.isValid);
    });
  });

  describe("validateQuotation", () => {
    test("debe validar cotizaciones válidas", () => {
      const validQuotation = {
        numero: "COT-2024-001",
        cliente: "Cliente ABC",
        proyecto: "Proyecto XYZ",
        monto: 10000,
        fechaCreacion: "2024-01-01",
        vigencia: "2024-12-31",
      };
      const result = validateQuotation(validQuotation);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      logResult("validateQuotation(valid)", result.isValid);
    });

    test("debe rechazar cotizaciones inválidas", () => {
      const invalidQuotation = {
        numero: "",
        cliente: "",
        proyecto: "",
        monto: 0,
        fechaCreacion: "",
        vigencia: "",
      };
      const result = validateQuotation(invalidQuotation);
      expect(result.isValid).toBe(false);
      expect(result.errors.numero).toBeDefined();
      expect(result.errors.cliente).toBeDefined();
      expect(result.errors.proyecto).toBeDefined();
      expect(result.errors.monto).toBeDefined();
      expect(result.errors.fechaCreacion).toBeDefined();
      expect(result.errors.vigencia).toBeDefined();
      logResult("validateQuotation(invalid)", !result.isValid);
    });
  });
});
