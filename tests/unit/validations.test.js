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

describe("Validaciones Unitarias", () => {
  describe("🧩 CP_001 – validateEmail (válido)", () => {
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
  });

  describe("🧩 CP_002 – validateEmail (inválido)", () => {
    test("debe rechazar emails inválidos", () => {
      const invalidEmails = [
        "",
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

  describe("🧩 CP_003 – validatePassword (válido)", () => {
    test("debe validar contraseñas de al menos 6 caracteres", () => {
      const validPasswords = ["123456", "password", "abc123def"];
      validPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result).toBe(true);
        logResult(`validatePassword(${password})`, result);
      });
    });
  });

  describe("🧩 CP_004 – validatePassword (inválido)", () => {
    test("debe rechazar contraseñas cortas", () => {
      const invalidPasswords = ["", "12345", "abc"];
      invalidPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result).toBe(false);
        logResult(`validatePassword(${password})`, !result);
      });
    });
  });

  describe("🧩 CP_005 – validateRequired (válido)", () => {
    test("debe validar valores requeridos no vacíos", () => {
      const validValues = ["test", "123", "a"];
      validValues.forEach((value) => {
        const result = validateRequired(value);
        expect(result).toBe(true);
        logResult(`validateRequired(${value})`, result);
      });
    });
  });

  describe("🧩 CP_006 – validateRequired (inválido)", () => {
    test("debe rechazar valores vacíos", () => {
      const invalidValues = ["", "   ", null, undefined];
      invalidValues.forEach((value) => {
        const result = validateRequired(value);
        expect(result).toBe(false);
        logResult(`validateRequired(${value})`, !result);
      });
    });
  });

  describe("🧩 CP_007 – validateNumber (válido)", () => {
    test("debe validar números positivos", () => {
      const validNumbers = [1, 100, 999.99, "500"];
      validNumbers.forEach((value) => {
        const result = validateNumber(value);
        expect(result).toBe(true);
        logResult(`validateNumber(${value})`, result);
      });
    });
  });

  describe("🧩 CP_008 – validateNumber (inválido)", () => {
    test("debe rechazar números inválidos o negativos", () => {
      const invalidNumbers = [0, -1, "abc", "", null];
      invalidNumbers.forEach((value) => {
        const result = validateNumber(value);
        expect(result).toBe(false);
        logResult(`validateNumber(${value})`, !result);
      });
    });
  });

  describe("🧩 CP_009 – validateProject (válido)", () => {
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
  });

  describe("🧩 CP_010 – validateProject (inválido)", () => {
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

  describe("🧩 CP_030 – validateEmail (válido)", () => {
    test("debe validar email válido", () => {
      const result = validateEmail("test@example.com");
      expect(result).toBe(true);
      logResult("validateEmail('test@example.com')", result);
    });
  });

  describe("🧩 CP_031 – validateEmail (inválido)", () => {
    test("debe rechazar email inválido", () => {
      const result = validateEmail("correo-invalido");
      expect(result).toBe(false);
      logResult("validateEmail('correo-invalido')", !result);
    });
  });

  describe("🧩 CP_032 – validatePassword (válido)", () => {
    test("debe validar contraseña válida", () => {
      const result = validatePassword("Password123");
      expect(result).toBe(true);
      logResult("validatePassword('Password123')", result);
    });
  });

  describe("🧩 CP_033 – validatePassword (inválido)", () => {
    test("debe rechazar contraseña inválida", () => {
      const result = validatePassword("123");
      expect(result).toBe(false);
      logResult("validatePassword('123')", !result);
    });
  });

  describe("🧩 CP_034 – validateProject (datos válidos)", () => {
    test("debe validar proyecto válido", () => {
      const validProject = {
        nombre: "Proyecto A",
        descripcion: "Descripción del proyecto",
        presupuesto: 10000,
        fechaInicio: "2024-01-01",
      };
      const result = validateProject(validProject);
      expect(result.isValid).toBe(true);
      logResult("validateProject(valid)", result.isValid);
    });
  });

  describe("🧩 CP_035 – validateProject (datos inválidos)", () => {
    test("debe rechazar proyecto inválido", () => {
      const invalidProject = {
        nombre: "",
        presupuesto: -5000,
      };
      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      logResult("validateProject(invalid)", !result.isValid);
    });
  });

  describe("🧩 CP_036 – validateUser (datos válidos)", () => {
    test("debe validar usuario válido", () => {
      const validUser = {
        nombre: "Usuario Test",
        email: "user@example.com",
        password: "Password123",
        rol: "analista",
      };
      const result = validateUser(validUser);
      expect(result.isValid).toBe(true);
      logResult("validateUser(valid)", result.isValid);
    });
  });

  describe("🧩 CP_037 – validateUser (datos inválidos)", () => {
    test("debe rechazar usuario inválido", () => {
      const invalidUser = {
        nombre: "Usuario",
        email: "correo",
        password: "123",
        rol: "admin",
      };
      const result = validateUser(invalidUser);
      expect(result.isValid).toBe(false);
      logResult("validateUser(invalid)", !result.isValid);
    });
  });

  describe("🧩 CP_038 – validateBudget (datos válidos)", () => {
    test("debe validar presupuesto válido", () => {
      const validBudget = {
        nombre: "Presupuesto A",
        monto: 5000,
        proyectoId: 1,
      };
      const result = validateBudget(validBudget);
      expect(result.isValid).toBe(true);
      logResult("validateBudget(valid)", result.isValid);
    });
  });

  describe("🧩 CP_039 – validateReport (datos válidos)", () => {
    test("debe validar reporte válido", () => {
      const validReport = {
        titulo: "Reporte A",
        tipo: "mensual",
        proyectoId: 1,
        progreso: 80,
      };
      const result = validateReport(validReport);
      expect(result.isValid).toBe(true);
      logResult("validateReport(valid)", result.isValid);
    });
  });

  describe("🧩 CP_040 – validatePurchase (datos válidos)", () => {
    test("debe validar compra válida", () => {
      const validPurchase = {
        descripcion: "Compra A",
        categoria: "software",
        monto: 1200,
        proyectoId: 1,
        proveedor: "Proveedor X",
      };
      const result = validatePurchase(validPurchase);
      expect(result.isValid).toBe(true);
      logResult("validatePurchase(valid)", result.isValid);
    });
  });

  describe("🧩 CP_041 – validateStrategy (datos válidos)", () => {
    test("debe validar estrategia válida", () => {
      const validStrategy = {
        nombre: "Estrategia A",
        descripcion: "Descripción",
        tipo: "proceso",
        prioridad: "alta",
        proyectoId: 1,
        fechaInicio: "2024-01-01",
        responsable: "Usuario X",
      };
      const result = validateStrategy(validStrategy);
      expect(result.isValid).toBe(true);
      logResult("validateStrategy(valid)", result.isValid);
    });
  });

  describe("🧩 CP_042 – validateQuotation (datos válidos)", () => {
    test("debe validar cotización válida", () => {
      const validQuotation = {
        numero: "COT-2024-001",
        cliente: "Cliente A",
        proyecto: "Proyecto A",
        monto: 10000,
        fechaCreacion: "2024-01-01",
        vigencia: "2024-12-31",
      };
      const result = validateQuotation(validQuotation);
      expect(result.isValid).toBe(true);
      logResult("validateQuotation(valid)", result.isValid);
    });
  });
});
