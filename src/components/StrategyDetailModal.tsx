import React from "react";
import {
  X,
  Calendar,
  User,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const StrategyDetailModal = ({ strategy, onClose }) => {
  if (!strategy) return null;

  const getStatusColor = (estado) => {
    const colors = {
      activa: "bg-green-100 text-green-800",
      en_revision: "bg-yellow-100 text-yellow-800",
      completada: "bg-blue-100 text-blue-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (estado) => {
    const texts = {
      activa: "Activa",
      en_revision: "En Revisión",
      completada: "Completada",
      cancelada: "Cancelada",
    };
    return texts[estado] || estado;
  };

  const getStatusIcon = (estado) => {
    const icons = {
      activa: CheckCircle,
      en_revision: Clock,
      completada: CheckCircle,
      cancelada: AlertCircle,
    };
    const IconComponent = icons[estado] || AlertCircle;
    return <IconComponent className="w-5 h-5" />;
  };

  const getPriorityColor = (prioridad) => {
    const colors = {
      baja: "bg-gray-100 text-gray-800",
      media: "bg-yellow-100 text-yellow-800",
      alta: "bg-orange-100 text-orange-800",
      critica: "bg-red-100 text-red-800",
    };
    return colors[prioridad] || "bg-gray-100 text-gray-800";
  };

  const getPriorityText = (prioridad) => {
    const texts = {
      baja: "Baja",
      media: "Media",
      alta: "Alta",
      critica: "Crítica",
    };
    return texts[prioridad] || prioridad;
  };

  const getTypeColor = (tipo) => {
    const colors = {
      operacional: "bg-blue-100 text-blue-800",
      tactica: "bg-green-100 text-green-800",
      estrategica: "bg-purple-100 text-purple-800",
      marketing: "bg-pink-100 text-pink-800",
      financiera: "bg-indigo-100 text-indigo-800",
    };
    return colors[tipo] || "bg-gray-100 text-gray-800";
  };

  const getTypeText = (tipo) => {
    const texts = {
      operacional: "Operacional",
      tactica: "Táctica",
      estrategica: "Estratégica",
      marketing: "Marketing",
      financiera: "Financiera",
    };
    return texts[tipo] || tipo;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {strategy.nombre}
            </h2>
            <p className="text-gray-600 mt-1">Detalles de la estrategia</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      strategy.estado
                    )}`}
                  >
                    <span className="mr-2">
                      {getStatusIcon(strategy.estado)}
                    </span>
                    {getStatusText(strategy.estado)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Estrategia
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                    strategy.tipo
                  )}`}
                >
                  <Target className="w-4 h-4 mr-2" />
                  {getTypeText(strategy.tipo)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    strategy.prioridad
                  )}`}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {getPriorityText(strategy.prioridad)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  {new Date(strategy.fechaInicio).toLocaleDateString()}
                </div>
              </div>

              {strategy.fechaFin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin
                  </label>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    {new Date(strategy.fechaFin).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable
                </label>
                <div className="flex items-center text-gray-900">
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  {strategy.responsable}
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">
                {strategy.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Proyecto ID:</span>
                <span className="ml-2 font-medium">{strategy.proyectoId}</span>
              </div>
              <div>
                <span className="text-gray-600">ID de Estrategia:</span>
                <span className="ml-2 font-medium">{strategy.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    strategy.estado
                  )}`}
                >
                  {getStatusText(strategy.estado)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyDetailModal;
