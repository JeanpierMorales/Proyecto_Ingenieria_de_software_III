// Configuración global de Jest para pruebas
import { jest } from "@jest/globals";

// Mock de fetch para simular llamadas a API
global.fetch = jest.fn();

// Configurar mocks de console para reducir ruido
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = jest.fn();
console.warn = jest.fn();
console.error = originalConsoleError; // Mantener error para debugging

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = "test";
process.env.REACT_APP_API_URL = "http://localhost:3001/api";

// Limpiar mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
  global.fetch.mockClear();
});

// Restaurar console después de todas las pruebas
afterAll(() => {
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});
