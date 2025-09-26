// Utilidades de validación para formularios
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim() !== "";
};

export const validateNumber = (value) => {
  return !isNaN(value) && parseFloat(value) > 0;
};

export const validateProject = (project) => {
  const errors = {};

  if (!validateRequired(project.nombre)) {
    errors.nombre = "El nombre del proyecto es obligatorio";
  }

  if (!validateRequired(project.descripcion)) {
    errors.descripcion = "La descripción es obligatoria";
  }

  if (!validateNumber(project.presupuesto)) {
    errors.presupuesto = "El presupuesto debe ser un número válido mayor a 0";
  }

  if (!project.fechaInicio) {
    errors.fechaInicio = "La fecha de inicio es obligatoria";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUser = (user) => {
  const errors = {};

  if (!validateRequired(user.nombre)) {
    errors.nombre = "El nombre es obligatorio";
  }

  if (!validateEmail(user.email)) {
    errors.email = "Debe ingresar un email válido";
  }

  if (!validatePassword(user.password)) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  if (!user.rol) {
    errors.rol = "Debe seleccionar un rol";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateBudget = (budget) => {
  const errors = {};

  if (!validateRequired(budget.nombre)) {
    errors.nombre = "El nombre del presupuesto es obligatorio";
  }

  if (!validateNumber(budget.monto)) {
    errors.monto = "El monto debe ser un número válido mayor a 0";
  }

  if (!budget.proyectoId) {
    errors.proyectoId = "Debe seleccionar un proyecto";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateReport = (report) => {
  const errors = {};

  if (!validateRequired(report.titulo)) {
    errors.titulo = "El título del reporte es obligatorio";
  }

  if (!validateRequired(report.tipo)) {
    errors.tipo = "El tipo de reporte es obligatorio";
  }

  if (!report.proyectoId) {
    errors.proyectoId = "Debe seleccionar un proyecto";
  }

  if (report.progreso < 0 || report.progreso > 100) {
    errors.progreso = "El progreso debe estar entre 0 y 100";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePurchase = (purchase) => {
  const errors = {};

  if (!validateRequired(purchase.descripcion)) {
    errors.descripcion = "La descripción es obligatoria";
  }

  if (!validateRequired(purchase.categoria)) {
    errors.categoria = "La categoría es obligatoria";
  }

  if (!validateNumber(purchase.monto)) {
    errors.monto = "El monto debe ser un número válido mayor a 0";
  }

  if (!purchase.proyectoId) {
    errors.proyectoId = "Debe seleccionar un proyecto";
  }

  if (!validateRequired(purchase.proveedor)) {
    errors.proveedor = "El proveedor es obligatorio";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateStrategy = (strategy) => {
  const errors = {};

  if (!validateRequired(strategy.nombre)) {
    errors.nombre = "El nombre de la estrategia es obligatorio";
  }

  if (!validateRequired(strategy.descripcion)) {
    errors.descripcion = "La descripción es obligatoria";
  }

  if (!validateRequired(strategy.tipo)) {
    errors.tipo = "El tipo de estrategia es obligatorio";
  }

  if (!validateRequired(strategy.prioridad)) {
    errors.prioridad = "La prioridad es obligatoria";
  }

  if (!strategy.proyectoId) {
    errors.proyectoId = "Debe seleccionar un proyecto";
  }

  if (!strategy.fechaInicio) {
    errors.fechaInicio = "La fecha de inicio es obligatoria";
  }

  if (!validateRequired(strategy.responsable)) {
    errors.responsable = "El responsable es obligatorio";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateQuotation = (quotation) => {
  const errors = {};

  if (!validateRequired(quotation.numero)) {
    errors.numero = "El número de cotización es obligatorio";
  }

  if (!validateRequired(quotation.cliente)) {
    errors.cliente = "El cliente es obligatorio";
  }

  if (!validateRequired(quotation.proyecto)) {
    errors.proyecto = "El proyecto es obligatorio";
  }

  if (!validateNumber(quotation.monto)) {
    errors.monto = "El monto debe ser un número válido mayor a 0";
  }

  if (!quotation.fechaCreacion) {
    errors.fechaCreacion = "La fecha de creación es obligatoria";
  }

  if (!quotation.vigencia) {
    errors.vigencia = "La fecha de vigencia es obligatoria";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
