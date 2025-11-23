// Servicio de autenticación mock
// TODO: Integrar con backend Node/Express + MySQL

const MOCK_USERS = [
  {
    id: 1,
    email: "admin@empresa.com",
    password: "123456",
    nombre: "Administrador Sistema",
    rol: "administrador",
    activo: true,
  },
  {
    id: 2,
    email: "analista@empresa.com",
    password: "123456",
    nombre: "Juan Pérez",
    rol: "analista",
    activo: true,
  },
  {
    id: 3,
    email: "cliente@empresa.com",
    password: "123456",
    nombre: "María García",
    rol: "cliente",
    activo: true,
  },
];

// Simula delay de red
const simulateNetworkDelay = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const authService = {
  // Función de login
  async login(email, password) {
    await simulateNetworkDelay();

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password && u.activo
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: "Credenciales incorrectas" };
  },

  // Función de logout
  logout() {
    localStorage.removeItem("currentUser");
    return { success: true };
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  // Verificar rol del usuario
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.rol === role;
  },
};

// Integración futura con backend pendiente
