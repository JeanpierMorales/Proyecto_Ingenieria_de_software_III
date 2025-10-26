import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};

// Hook para verificar permisos
export const usePermissions = () => {
  const { user, hasRole } = useAuth();

  const canManageUsers = () => hasRole("administrador");
  const canManageProjects = () =>
    hasRole("administrador") || hasRole("analista");
  const canViewReports = () => hasRole("administrador") || hasRole("analista");
  const canManageBudgets = () =>
    hasRole("administrador") || hasRole("analista");
  const canViewOwnData = () => !!user;

  return {
    canManageUsers,
    canManageProjects,
    canViewReports,
    canManageBudgets,
    canViewOwnData,
  };
};
