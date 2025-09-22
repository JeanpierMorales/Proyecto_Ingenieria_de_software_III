// Servicio de API mock para operaciones CRUD
// TODO: Integrar con backend Node/Express + MySQL

// Datos mock
let MOCK_PROJECTS = [
  {
    id: 1,
    nombre: 'Sistema de Inventario',
    descripcion: 'Desarrollo de sistema web para control de inventarios',
    presupuesto: 50000,
    fechaInicio: '2024-01-15',
    fechaFin: '2024-06-15',
    estado: 'en_progreso',
    clienteId: 3,
    responsable: 'Juan Pérez'
  },
  {
    id: 2,
    nombre: 'App Mobile Ventas',
    descripcion: 'Aplicación móvil para gestión de ventas',
    presupuesto: 75000,
    fechaInicio: '2024-02-01',
    fechaFin: '2024-08-01',
    estado: 'pendiente',
    clienteId: 3,
    responsable: 'María García'
  }
];

let MOCK_BUDGETS = [
  {
    id: 1,
    nombre: 'Presupuesto Sistema Inventario - Fase 1',
    descripcion: 'Desarrollo backend y base de datos',
    monto: 25000,
    proyectoId: 1,
    estado: 'aprobado',
    fechaCreacion: '2024-01-10',
    items: [
      { concepto: 'Desarrollo Backend', cantidad: 200, precioUnitario: 50, total: 10000 },
      { concepto: 'Base de Datos', cantidad: 100, precioUnitario: 75, total: 7500 },
      { concepto: 'Testing', cantidad: 50, precioUnitario: 60, total: 3000 }
    ]
  },
  {
    id: 2,
    nombre: 'Presupuesto App Mobile - Diseño UX/UI',
    descripcion: 'Diseño de interfaces y experiencia de usuario',
    monto: 15000,
    proyectoId: 2,
    estado: 'pendiente',
    fechaCreacion: '2024-01-20',
    items: [
      { concepto: 'Wireframes', cantidad: 40, precioUnitario: 100, total: 4000 },
      { concepto: 'Diseño UI', cantidad: 80, precioUnitario: 80, total: 6400 },
      { concepto: 'Prototipo', cantidad: 30, precioUnitario: 120, total: 3600 }
    ]
  }
];

let MOCK_REPORTS = [
  {
    id: 1,
    titulo: 'Informe Mensual - Enero 2024',
    tipo: 'mensual',
    proyectoId: 1,
    fechaCreacion: '2024-01-31',
    estado: 'completado',
    progreso: 25,
    observaciones: 'Avance según cronograma. Sin inconvenientes mayores.'
  },
  {
    id: 2,
    titulo: 'Reporte de Avance - App Mobile',
    tipo: 'avance',
    proyectoId: 2,
    fechaCreacion: '2024-02-15',
    estado: 'en_revision',
    progreso: 15,
    observaciones: 'Fase de diseño iniciada. Pendiente aprobación de wireframes.'
  }
];

let MOCK_USERS = [
  {
    id: 1,
    nombre: 'Administrador Sistema',
    email: 'admin@empresa.com',
    rol: 'administrador',
    activo: true,
    fechaRegistro: '2024-01-01'
  },
  {
    id: 2,
    nombre: 'Juan Pérez',
    email: 'analista@empresa.com',
    rol: 'analista',
    activo: true,
    fechaRegistro: '2024-01-02'
  },
  {
    id: 3,
    nombre: 'María García',
    email: 'cliente@empresa.com',
    rol: 'cliente',
    activo: true,
    fechaRegistro: '2024-01-03'
  }
];

let MOCK_PURCHASES = [
  {
    id: 1,
    descripcion: 'Licencias de software',
    categoria: 'software',
    monto: 5000,
    proyectoId: 1,
    proveedor: 'TechSoft Solutions',
    fechaCompra: '2024-01-20',
    estado: 'aprobado'
  },
  {
    id: 2,
    descripcion: 'Equipos de desarrollo',
    categoria: 'hardware',
    monto: 12000,
    proyectoId: 2,
    proveedor: 'CompuTech',
    fechaCompra: '2024-02-05',
    estado: 'pendiente'
  }
];

let MOCK_STRATEGIES = [
  {
    id: 1,
    titulo: 'Optimización de Procesos',
    descripcion: 'Implementar metodologías ágiles para mejorar la eficiencia',
    tipo: 'proceso',
    prioridad: 'alta',
    fechaCreacion: '2024-01-25',
    estado: 'activa'
  },
  {
    id: 2,
    titulo: 'Capacitación del Equipo',
    descripcion: 'Programa de formación en nuevas tecnologías',
    tipo: 'capacitacion',
    prioridad: 'media',
    fechaCreacion: '2024-02-01',
    estado: 'planificada'
  }
];

let MOCK_QUOTATIONS = [
  {
    id: 1,
    numero: 'COT-2024-001',
    cliente: 'Empresa ABC S.A.',
    proyecto: 'Sistema de Facturación',
    monto: 85000,
    fechaCreacion: '2024-01-30',
    vigencia: '2024-03-30',
    estado: 'enviada'
  },
  {
    id: 2,
    numero: 'COT-2024-002',
    cliente: 'Comercial XYZ Ltda.',
    proyecto: 'Portal Web Corporativo',
    monto: 45000,
    fechaCreacion: '2024-02-10',
    vigencia: '2024-04-10',
    estado: 'borrador'
  }
];

// Simular delay de red
const simulateNetworkDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 500));
};

// API de Proyectos
export const projectsAPI = {
  async getProjects() {
    await simulateNetworkDelay();
    return { success: true, data: MOCK_PROJECTS };
  },
  
  async createProject(project) {
    await simulateNetworkDelay();
    const newProject = {
      ...project,
      id: Math.max(...MOCK_PROJECTS.map(p => p.id)) + 1,
      estado: 'pendiente'
    };
    MOCK_PROJECTS.push(newProject);
    return { success: true, data: newProject };
  },
  
  async updateProject(id, project) {
    await simulateNetworkDelay();
    const index = MOCK_PROJECTS.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      MOCK_PROJECTS[index] = { ...MOCK_PROJECTS[index], ...project };
      return { success: true, data: MOCK_PROJECTS[index] };
    }
    return { success: false, message: 'Proyecto no encontrado' };
  },
  
  async deleteProject(id) {
    await simulateNetworkDelay();
    const index = MOCK_PROJECTS.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      MOCK_PROJECTS.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: 'Proyecto no encontrado' };
  }
};

// API de Presupuestos
export const budgetsAPI = {
  async getBudgets() {
    await simulateNetworkDelay();
    return { success: true, data: MOCK_BUDGETS };
  },
  
  async createBudget(budget) {
    await simulateNetworkDelay();
    const newBudget = {
      ...budget,
      id: Math.max(...MOCK_BUDGETS.map(b => b.id)) + 1,
      estado: 'borrador',
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    MOCK_BUDGETS.push(newBudget);
    return { success: true, data: newBudget };
  }
};

// API de Reportes
export const reportsAPI = {
  async getReports() {
    await simulateNetworkDelay();
    return { success: true, data: MOCK_REPORTS };
  },
  
  async updateReport(id, report) {
    await simulateNetworkDelay();
    const index = MOCK_REPORTS.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      MOCK_REPORTS[index] = { ...MOCK_REPORTS[index], ...report };
      return { success: true, data: MOCK_REPORTS[index] };
    }
    return { success: false, message: 'Reporte no encontrado' };
  }
};

// API de Usuarios
export const usersAPI = {
  async getUsers() {
    await simulateNetworkDelay();
    return { success: true, data: MOCK_USERS };
  },
  
  async createUser(user) {
    await simulateNetworkDelay();
    const newUser = {
      ...user,
      id: Math.max(...MOCK_USERS.map(u => u.id)) + 1,
      activo: true,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    MOCK_USERS.push(newUser);
    return { success: true, data: newUser };
  }
};

// API de Compras
export const purchasesAPI = {
  async getPurchases() {
    await simulateNetworkDelay();
    return { success: true, data: MOCK_PURCHASES };
  }
};

// API de Estrategias
export const strategiesAPI = {
  async getStrategies() {
    await simulateNetworkDelay();
    return { success: true, data: MOCK_STRATEGIES };
  }
};

// API de Cotizaciones
export const quotationsAPI = {
  async getQuotations() {
    await simulateNetworkDelay();
    return { success: true, data: MOCK_QUOTATIONS };
  }
};

// TODO: Integración futura con backend Node/Express + MySQL
/*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const projectsAPI = {
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`);
    return response.json();
  },
  
  async createProject(project) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return response.json();
  },
  
  // ... resto de métodos CRUD
};
*/