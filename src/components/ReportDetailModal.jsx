import React from "react";
import {
  X,
  Calendar,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const ReportDetailModal = ({ report, onClose }) => {
  if (!report) return null;

  const getStatusColor = (estado) => {
    const colors = {
      completado: "bg-green-100 text-green-800",
      en_revision: "bg-yellow-100 text-yellow-800",
      pendiente: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (estado) => {
    const texts = {
      completado: "Completado",
      en_revision: "En Revisión",
      pendiente: "Pendiente",
    };
    return texts[estado] || estado;
  };

  const getStatusIcon = (estado) => {
    const icons = {
      completado: CheckCircle,
      en_revision: Clock,
      pendiente: AlertCircle,
    };
    const IconComponent = icons[estado] || AlertCircle;
    return <IconComponent className="w-5 h-5" />;
  };

  const getProgressColor = (progreso) => {
    if (progreso >= 80) return "bg-green-500";
    if (progreso >= 50) return "bg-yellow-500";
    if (progreso >= 25) return "bg-blue-500";
    return "bg-red-500";
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {report.titulo}
            </h2>
            <p className="text-gray-600 mt-1">Detalles del reporte</p>
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
                      report.estado
                    )}`}
                  >
                    <span className="mr-2">{getStatusIcon(report.estado)}</span>
                    {getStatusText(report.estado)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Reporte
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                  {report.tipo}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Creación
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  {new Date(report.fechaCreacion).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progreso del Proyecto
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progreso</span>
                  <span className="text-sm font-medium text-gray-900">
                    {report.progreso}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getProgressColor(
                      report.progreso
                    )}`}
                    style={{ width: `${report.progreso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">
                {report.observaciones || "Sin observaciones"}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Proyecto ID:</span>
                <span className="ml-2 font-medium">{report.proyectoId}</span>
              </div>
              <div>
                <span className="text-gray-600">ID del Reporte:</span>
                <span className="ml-2 font-medium">{report.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    report.estado
                  )}`}
                >
                  {getStatusText(report.estado)}
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

export default ReportDetailModal;
