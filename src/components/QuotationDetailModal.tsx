import React from "react";
import { X, Calendar, DollarSign, User, FileText, Clock } from "lucide-react";

const QuotationDetailModal = ({ quotation, onClose, onEdit }) => {
  if (!quotation) return null;

  const getStatusColor = (estado) => {
    const colors = {
      borrador: "bg-gray-100 text-gray-800",
      enviada: "bg-blue-100 text-blue-800",
      aprobada: "bg-green-100 text-green-800",
      rechazada: "bg-red-100 text-red-800",
      vencida: "bg-yellow-100 text-yellow-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (estado) => {
    const texts = {
      borrador: "Borrador",
      enviada: "Enviada",
      aprobada: "Aprobada",
      rechazada: "Rechazada",
      vencida: "Vencida",
    };
    return texts[estado] || estado;
  };

  const isExpired = new Date(quotation.vigencia) < new Date();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Detalles de Cotización
              </h3>
              <p className="text-sm text-gray-600 mt-1">{quotation.numero}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onEdit(quotation)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FileText className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">
                  Información General
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Número:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {quotation.numero}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cliente:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {quotation.cliente}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Proyecto:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {quotation.proyecto}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      quotation.estado
                    )}`}
                  >
                    {getStatusText(quotation.estado)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Fechas</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Creación:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(quotation.fechaCreacion).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vigencia:</span>
                  <span
                    className={`text-sm font-medium ${
                      isExpired ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {new Date(quotation.vigencia).toLocaleDateString()}
                    {isExpired && " (Vencida)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Monto total */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">
                  Monto Total
                </span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                ${quotation.monto?.toLocaleString() || "0"}
              </span>
            </div>
          </div>

          {/* Descripción */}
          {quotation.descripcion && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Descripción
              </h4>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                {quotation.descripcion}
              </p>
            </div>
          )}

          {/* Items de la cotización */}
          {quotation.items && quotation.items.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Items de la Cotización
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Concepto
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Cantidad
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Precio Unit.
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quotation.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.concepto}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.cantidad}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ${item.precioUnitario?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${item.total?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        ${quotation.monto?.toLocaleString() || "0"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => onEdit(quotation)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Editar Cotización
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetailModal;
