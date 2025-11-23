import React from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Calculator,
  FileText,
  Users,
  ShoppingCart,
  Target,
  Receipt,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAuth, usePermissions } from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    canManageUsers,
    canManageProjects,
    canViewReports,
    canManageBudgets,
  } = usePermissions();

  const dashboardCards = [
    {
      title: "Proyectos",
      description: "Gestionar proyectos activos",
      icon: FolderOpen,
      path: "/projects",
      color: "bg-blue-500",
      show: canManageProjects(),
    },
    {
      title: "Presupuestos",
      description: "Crear y revisar presupuestos",
      icon: Calculator,
      path: "/budgets",
      color: "bg-green-500",
      show: canManageBudgets(),
    },
    {
      title: "Reportes",
      description: "Informes y análisis",
      icon: FileText,
      path: "/reports",
      color: "bg-purple-500",
      show: canViewReports(),
    },
    {
      title: "Usuarios",
      description: "Administrar usuarios del sistema",
      icon: Users,
      path: "/users",
      color: "bg-indigo-500",
      show: canManageUsers(),
    },
    {
      title: "Compras",
      description: "Gestión de compras y suministros",
      icon: ShoppingCart,
      path: "/purchases",
      color: "bg-orange-500",
      show: canManageProjects(),
    },
    {
      title: "Estrategias",
      description: "Estrategias de mejora",
      icon: Target,
      path: "/strategies",
      color: "bg-red-500",
      show: canManageProjects(),
    },
    {
      title: "Cotizaciones",
      description: "Solicitar y revisar cotizaciones",
      icon: Receipt,
      path: "/quotations",
      color: "bg-teal-500",
      show: canManageProjects(),
    },
  ];

  const stats = [
    {
      title: "Proyectos Activos",
      value: "8",
      change: "+12%",
      changeType: "increase",
      icon: FolderOpen,
    },
    {
      title: "Presupuestos Pendientes",
      value: "3",
      change: "-5%",
      changeType: "decrease",
      icon: Clock,
    },
    {
      title: "Reportes Completados",
      value: "24",
      change: "+18%",
      changeType: "increase",
      icon: CheckCircle,
    },
    {
      title: "Alertas Activas",
      value: "2",
      change: "0%",
      changeType: "neutral",
      icon: AlertCircle,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Nuevo proyecto creado",
      description: "Sistema de Inventario iniciado",
      time: "Hace 2 horas",
      type: "project",
    },
    {
      id: 2,
      title: "Presupuesto aprobado",
      description: "Presupuesto App Mobile aprobado",
      time: "Hace 4 horas",
      type: "budget",
    },
    {
      id: 3,
      title: "Reporte generado",
      description: "Informe mensual de enero completado",
      time: "Hace 1 día",
      type: "report",
    },
    {
      id: 4,
      title: "Usuario registrado",
      description: "Nuevo analista agregado al sistema",
      time: "Hace 2 días",
      type: "user",
    },
  ];

  // Extracted text color class based on changeType to improve readability
  const getChangeTextColor = (changeType) => {
    if (changeType === "increase") return "text-green-600";
    if (changeType === "decrease") return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Resumen de tu sistema de gestión de proyectos y presupuestos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${getChangeTextColor(stat.changeType)}`}>
                  {stat.change} desde el mes pasado
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <stat.icon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards de navegación */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardCards
            .filter((card) => card.show)
            .map((card) => (
              <Link
                key={card.title}
                to={card.path}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                <div className="mt-4">
                  <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                    Acceder →
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              Ver todas las actividades →
            </button>
          </div>
        </div>

        {/* Gráfico o información adicional */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Progreso del Mes
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Proyectos Completados</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Presupuestos Aprobados</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Reportes Entregados</span>
                <span>90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Rendimiento general en aumento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
