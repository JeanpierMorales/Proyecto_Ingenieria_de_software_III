import React from "react";
import { X, DollarSign, Calendar, FileText, Package } from "lucide-react";

const BudgetDetailModal = ({ budget, onClose }) => {
  if (!budget) return null;

  const getStatusColor = (estado) => {
    const colors = {
      borrador: "bg-gray-100 text-gray-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      aprobado: "bg-green-100 text-green-800",
      rechazado: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (estado) => {
    const texts = {
      borrador: "Borrador",
      pendiente: "Pendiente",
      aprobado: "Aprobado",
      rechazado: "Rechazado",
    };
    return texts[estado] || estado;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {budget.nombre}
            </h2>
            <p className="text-gray-600 mt-1">Detalles del presupuesto</p>
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
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    budget.estado
                  )}`}
                >
                  {getStatusText(budget.estado)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Total
                </label>
                <div className="flex items-center text-2xl font-bold text-green-600">
                  <DollarSign className="w-6 h-6 mr-2" />$
                  {budget.monto?.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Creación
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  {new Date(budget.fechaCreacion).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                {budget.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>

          {/* Items del presupuesto */}
          {budget.items && budget.items.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Items del Presupuesto ({budget.items.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Concepto
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Cantidad
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Precio Unitario
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                          {item.concepto}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-900">
                          {item.cantidad}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-900">
                          ${item.precioUnitario?.toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-900">
                          ${item.total?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td
                        colSpan="3"
                        className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-700"
                      >
                        Total General:
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right text-lg font-bold text-green-600">
                        ${budget.monto?.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Resumen</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Proyecto ID:</span>
                <span className="ml-2 font-medium">{budget.proyectoId}</span>
              </div>
              <div>
                <span className="text-gray-600">ID del Presupuesto:</span>
                <span className="ml-2 font-medium">{budget.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    budget.estado
                  )}`}
                >
                  {getStatusText(budget.estado)}
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

export default BudgetDetailModal;
