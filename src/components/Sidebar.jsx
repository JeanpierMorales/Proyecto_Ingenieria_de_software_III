import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Calculator,
  FileText,
  Users,
  ShoppingCart,
  Target,
  Receipt,
} from "lucide-react";
import { useAuth, usePermissions } from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const {
    canManageUsers,
    canManageProjects,
    canViewReports,
    canManageBudgets,
  } = usePermissions();

  const navigationItems = [
    {
      id: "dashboard",
      name: "Tablero",
      path: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      id: "projects",
      name: "Proyectos",
      path: "/projects",
      icon: FolderOpen,
      show: canManageProjects(),
    },
    {
      id: "budgets",
      name: "Presupuestos",
      path: "/budgets",
      icon: Calculator,
      show: canManageBudgets(),
    },
    {
      id: "reports",
      name: "Reportes",
      path: "/reports",
      icon: FileText,
      show: canViewReports(),
    },
    {
      id: "users",
      name: "Usuarios",
      path: "/users",
      icon: Users,
      show: canManageUsers(),
    },
    {
      id: "purchases",
      name: "Compras",
      path: "/purchases",
      icon: ShoppingCart,
      show: canManageProjects(),
    },
    {
      id: "strategies",
      name: "Estrategias",
      path: "/strategies",
      icon: Target,
      show: canManageProjects(),
    },
    {
      id: "quotations",
      name: "Cotizaciones",
      path: "/quotations",
      icon: Receipt,
      show: canManageProjects(),
    },
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">DiuxWeb</span>
        </div>

        <div className="text-sm text-gray-400">
          <p>Bienvenido,</p>
          <p className="font-medium text-white">{user?.nombre}</p>
        </div>
      </div>

      <nav>
        <ul className="space-y-2">
          {navigationItems
            .filter((item) => item.show)
            .map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>Sistema de Gestión v1.0</p>
          <p>&copy; 2024 Empresa</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
