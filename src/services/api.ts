// API service integrated with Node/Express + MySQL backend
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};

// API de Proyectos
export const projectsAPI = {
  async getProjects() {
    return await apiCall("/projects");
  },

  async createProject(project) {
    return await apiCall("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
  },

  async updateProject(id, project) {
    return await apiCall(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    });
  },

  async deleteProject(id) {
    return await apiCall(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};

// API de Presupuestos
export const budgetsAPI = {
  async getBudgets() {
    return await apiCall("/budgets");
  },

  async createBudget(budget) {
    return await apiCall("/budgets", {
      method: "POST",
      body: JSON.stringify(budget),
    });
  },

  async updateBudget(id, budget) {
    return await apiCall(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(budget),
    });
  },

  async getBudget(id) {
    return await apiCall(`/budgets/${id}`);
  },
};

// API de Reportes
export const reportsAPI = {
  async getReports() {
    return await apiCall("/reports");
  },

  async createReport(report) {
    return await apiCall("/reports", {
      method: "POST",
      body: JSON.stringify(report),
    });
  },

  async updateReport(id, report) {
    return await apiCall(`/reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(report),
    });
  },

  async getReport(id) {
    return await apiCall(`/reports/${id}`);
  },

  async exportReports(format = "pdf") {
    return await apiCall("/reports/export", {
      method: "POST",
      body: JSON.stringify({ format }),
    });
  },
};

// API de Usuarios
export const usersAPI = {
  async getUsers() {
    return await apiCall("/users");
  },

  async createUser(user) {
    return await apiCall("/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
};

// API de Compras
export const purchasesAPI = {
  async getPurchases() {
    return await apiCall("/purchases");
  },

  async createPurchase(purchase) {
    return await apiCall("/purchases", {
      method: "POST",
      body: JSON.stringify(purchase),
    });
  },

  async updatePurchase(id, purchase) {
    return await apiCall(`/purchases/${id}`, {
      method: "PUT",
      body: JSON.stringify(purchase),
    });
  },

  async getPurchase(id) {
    return await apiCall(`/purchases/${id}`);
  },
};

// API de Estrategias
export const strategiesAPI = {
  async getStrategies() {
    return await apiCall("/strategies");
  },

  async createStrategy(strategy) {
    return await apiCall("/strategies", {
      method: "POST",
      body: JSON.stringify(strategy),
    });
  },

  async updateStrategy(id, strategy) {
    return await apiCall(`/strategies/${id}`, {
      method: "PUT",
      body: JSON.stringify(strategy),
    });
  },

  async getStrategy(id) {
    return await apiCall(`/strategies/${id}`);
  },
};

// API de Cotizaciones
export const quotationsAPI = {
  async getQuotations() {
    return await apiCall("/quotations");
  },

  async createQuotation(quotation) {
    return await apiCall("/quotations", {
      method: "POST",
      body: JSON.stringify(quotation),
    });
  },

  async updateQuotation(id, quotation) {
    return await apiCall(`/quotations/${id}`, {
      method: "PUT",
      body: JSON.stringify(quotation),
    });
  },

  async getQuotation(id) {
    return await apiCall(`/quotations/${id}`);
  },

  async sendQuotationByEmail(id, emailData) {
    return await apiCall(`/quotations/${id}/send-email`, {
      method: "POST",
      body: JSON.stringify(emailData),
    });
  },
};
