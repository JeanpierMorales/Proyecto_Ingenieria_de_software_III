import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Budgets from "../pages/Budgets";
import Reports from "../pages/Reports";
import Users from "../pages/Users";
import Purchases from "../pages/Purchases";
import Strategies from "../pages/Strategies";
import Quotations from "../pages/Quotations";

// Components
import PrivateRoute from "../components/PrivateRoute";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Ruta pública - Login */}
      <Route
        path="/login"
        element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Rutas privadas - Requieren autenticación */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Ruta por defecto */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard - Accesible para todos los usuarios autenticados */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Proyectos - Para administradores y analistas */}
        <Route
          path="projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />

        {/* Presupuestos - Para administradores y analistas */}
        <Route
          path="budgets"
          element={
            <PrivateRoute>
              <Budgets />
            </PrivateRoute>
          }
        />

        {/* Reportes - Para administradores y analistas */}
        <Route
          path="reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

        {/* Usuarios - Solo para administradores */}
        <Route
          path="users"
          element={
            <PrivateRoute requiredRole="administrador">
              <Users />
            </PrivateRoute>
          }
        />

        {/* Compras - Para administradores y analistas */}
        <Route
          path="purchases"
          element={
            <PrivateRoute>
              <Purchases />
            </PrivateRoute>
          }
        />

        {/* Estrategias - Para administradores y analistas */}
        <Route
          path="strategies"
          element={
            <PrivateRoute>
              <Strategies />
            </PrivateRoute>
          }
        />

        {/* Cotizaciones - Para administradores y analistas */}
        <Route
          path="quotations"
          element={
            <PrivateRoute>
              <Quotations />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Ruta 404 - Página no encontrada */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
              <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Página no encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                La página que buscas no existe o ha sido movida.
              </p>
              <button
                onClick={() => globalThis.history.back()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
