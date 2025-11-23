// Utilidades de validación para formularios
export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return false;
  }
  if (email.includes("..")) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password) {
    return false;
  }
  return password.length >= 6;
};

export const validateRequired = (value) => {
  if (value === null || value === undefined) {
    return false;
  }
  return value.toString().trim() !== "";
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
