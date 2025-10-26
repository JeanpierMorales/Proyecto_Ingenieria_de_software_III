// Constantes de la aplicación
export const USER_ROLES = {
  ADMIN: 'administrador',
  ANALYST: 'analista',
  CLIENT: 'cliente'
};

export const PROJECT_STATUS = {
  PENDING: 'pendiente',
  IN_PROGRESS: 'en_progreso',
  COMPLETED: 'completado',
  CANCELLED: 'cancelado'
};

export const BUDGET_STATUS = {
  DRAFT: 'borrador',
  PENDING: 'pendiente',
  APPROVED: 'aprobado',
  REJECTED: 'rechazado'
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', name: 'Tablero', path: '/dashboard', icon: 'LayoutDashboard' },
  { id: 'projects', name: 'Proyectos', path: '/projects', icon: 'FolderOpen' },
  { id: 'budgets', name: 'Presupuestos', path: '/budgets', icon: 'Calculator' },
  { id: 'reports', name: 'Reportes', path: '/reports', icon: 'FileText' },
  { id: 'users', name: 'Usuarios', path: '/users', icon: 'Users' },
  { id: 'purchases', name: 'Compras', path: '/purchases', icon: 'ShoppingCart' },
  { id: 'strategies', name: 'Estrategias', path: '/strategies', icon: 'Target' },
  { id: 'quotations', name: 'Cotizaciones', path: '/quotations', icon: 'Receipt' }
];