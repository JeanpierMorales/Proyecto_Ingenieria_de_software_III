import React from "react";
import {
  Calendar,
  Eye,
  Edit,
  BarChart3,
  CheckCircle,
  Clock,
} from "lucide-react";
import PropTypes from "prop-types";

const ReportTable = ({ reports, onEdit, onView }) => {
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
      pendiente: Clock,
    };
    const IconComponent = icons[estado] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const getProgressColor = (progreso) => {
    if (progreso >= 80) return "bg-green-500";
    if (progreso >= 50) return "bg-yellow-500";
    if (progreso >= 25) return "bg-blue-500";
    return "bg-red-500";
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay reportes
        </h3>
        <p className="text-gray-600">
          No se encontraron reportes para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Reportes de Proyecto
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {report.titulo}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {report.observaciones}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {report.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    {new Date(report.fechaCreacion).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      report.estado
                    )}`}
                  >
                    <span className="mr-1">{getStatusIcon(report.estado)}</span>
                    {getStatusText(report.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          report.progreso
                        )}`}
                        style={{ width: `${report.progreso}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {report.progreso}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(report)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                      title="Ver reporte"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(report)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded hover:bg-indigo-50"
                      title="Editar reporte"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ReportTable.propTypes = {
  reports: PropTypes.arrayOf(PropTypes.object),
  onEdit: PropTypes.func,
  onView: PropTypes.func,
};

export default ReportTable;
