import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateNumber,
  validateProject,
  validateUser,
  validateBudget,
} from "../../src/utils/validations.js";

// Función auxiliar para mostrar resultados
const logResult = (testName, passed, error = null) => {
  const status = passed ? "✅" : "❌";
  console.log(`${status} ${testName}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
};

describe("Validaciones Unitarias", () => {
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
});
