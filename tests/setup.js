// Configuración global para Jest
// Configura el entorno de pruebas y mocks globales

// Mock de fetch para pruebas de API
global.fetch = jest.fn();

// Mock de console para reducir ruido en pruebas
global.console = {
  ...console,
  // Mantener log y error para debugging, silenciar otros
  warn: jest.fn(),
  info: jest.fn(),
};

// Configuración de Jest para pruebas de integración
process.env.NODE_ENV = "test";
process.env.REACT_APP_API_URL = "http://localhost:3001/api";
