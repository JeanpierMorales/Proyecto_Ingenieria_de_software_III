import React from "react";
import {
  X,
  Calendar,
  Package,
  DollarSign,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const PurchaseDetailModal = ({ purchase, onClose }) => {
  if (!purchase) return null;

  const getStatusColor = (estado) => {
    const colors = {
      aprobado: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      rechazado: "bg-red-100 text-red-800",
      completado: "bg-blue-100 text-blue-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (estado) => {
    const texts = {
      aprobado: "Aprobado",
      pendiente: "Pendiente",
      rechazado: "Rechazado",
      completado: "Completado",
    };
    return texts[estado] || estado;
  };

  const getStatusIcon = (estado) => {
    const icons = {
      aprobado: CheckCircle,
      pendiente: Clock,
      rechazado: AlertCircle,
      completado: CheckCircle,
    };
    const IconComponent = icons[estado] || Clock;
    return <IconComponent className="w-5 h-5" />;
  };

  const getCategoryColor = (categoria) => {
    const colors = {
      software: "bg-blue-100 text-blue-800",
      hardware: "bg-purple-100 text-purple-800",
      servicios: "bg-indigo-100 text-indigo-800",
      materiales: "bg-orange-100 text-orange-800",
      capacitacion: "bg-green-100 text-green-800",
      otros: "bg-gray-100 text-gray-800",
    };
    return colors[categoria] || "bg-gray-100 text-gray-800";
  };

  const getCategoryText = (categoria) => {
    const texts = {
      software: "Software",
      hardware: "Hardware",
      servicios: "Servicios",
      materiales: "Materiales",
      capacitacion: "Capacitación",
      otros: "Otros",
    };
    return texts[categoria] || categoria;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Detalles de Compra
            </h2>
            <p className="text-gray-600 mt-1">ID de Compra: #{purchase.id}</p>
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
                      purchase.estado
                    )}`}
                  >
                    <span className="mr-2">
                      {getStatusIcon(purchase.estado)}
                    </span>
                    {getStatusText(purchase.estado)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                    purchase.categoria
                  )}`}
                >
                  <Package className="w-4 h-4 mr-2" />
                  {getCategoryText(purchase.categoria)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto
                </label>
                <div className="flex items-center text-gray-900">
                  <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-2xl font-bold">
                    ${purchase.monto?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Compra
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  {new Date(purchase.fechaCompra).toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <div className="flex items-center text-gray-900">
                  <Building className="w-5 h-5 mr-2 text-gray-400" />
                  {purchase.proveedor}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proyecto ID
                </label>
                <div className="flex items-center text-gray-900">
                  <span className="text-lg font-semibold">
                    #{purchase.proyectoId}
                  </span>
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
                {purchase.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID de Compra:</span>
                <span className="ml-2 font-medium">#{purchase.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Categoría:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    purchase.categoria
                  )}`}
                >
                  {getCategoryText(purchase.categoria)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    purchase.estado
                  )}`}
                >
                  {getStatusText(purchase.estado)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Monto:</span>
                <span className="ml-2 font-medium">
                  ${purchase.monto?.toLocaleString()}
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

export default PurchaseDetailModal;
