import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { validateQuotation } from "../utils/validations";
import { projectsAPI } from "../services/api";

const QuotationForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    numero: "",
    cliente: "",
    proyecto: "",
    descripcion: "",
    monto: "",
    fechaCreacion: "",
    vigencia: "",
    estado: "borrador",
    items: [],
  });

  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();

    if (initialData) {
      setFormData({
        numero: initialData.numero || "",
        cliente: initialData.cliente || "",
        proyecto: initialData.proyecto || "",
        descripcion: initialData.descripcion || "",
        monto: initialData.monto || "",
        fechaCreacion: initialData.fechaCreacion || "",
        vigencia: initialData.vigencia || "",
        estado: initialData.estado || "borrador",
        items: initialData.items || [],
      });
    } else {
      // Set default dates for new quotations
      const today = new Date().toISOString().split("T")[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const vigenciaDate = nextMonth.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        fechaCreacion: today,
        vigencia: vigenciaDate,
      }));
    }
  }, [initialData]);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { concepto: "", cantidad: "", precioUnitario: "", total: 0 },
      ],
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Calcular total automáticamente
    if (field === "cantidad" || field === "precioUnitario") {
      const cantidad = parseFloat(updatedItems[index].cantidad) || 0;
      const precio = parseFloat(updatedItems[index].precioUnitario) || 0;
      updatedItems[index].total = cantidad * precio;
    }

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));

    // Recalcular monto total
    const totalMonto = updatedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      monto: totalMonto.toString(),
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));

    // Recalcular monto total
    const totalMonto = updatedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      monto: totalMonto.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateQuotation(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error al guardar cotización:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {initialData ? "Editar Cotización" : "Nueva Cotización"}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="numero"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Número de Cotización *
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.numero ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="COT-2024-001"
                />
                {errors.numero && (
                  <p className="mt-1 text-sm text-red-600">{errors.numero}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cliente"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Cliente *
                </label>
                <input
                  type="text"
                  id="cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cliente ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nombre del cliente"
                />
                {errors.cliente && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="proyecto"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Proyecto *
                </label>
                <input
                  type="text"
                  id="proyecto"
                  name="proyecto"
                  value={formData.proyecto}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.proyecto ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nombre del proyecto"
                />
                {errors.proyecto && (
                  <p className="mt-1 text-sm text-red-600">{errors.proyecto}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="borrador">Borrador</option>
                  <option value="enviada">Enviada</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="vencida">Vencida</option>
                </select>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fechaCreacion"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fecha de Creación *
                </label>
                <input
                  type="date"
                  id="fechaCreacion"
                  name="fechaCreacion"
                  value={formData.fechaCreacion}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fechaCreacion ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fechaCreacion && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fechaCreacion}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vigencia"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fecha de Vigencia *
                </label>
                <input
                  type="date"
                  id="vigencia"
                  name="vigencia"
                  value={formData.vigencia}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vigencia ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.vigencia && (
                  <p className="mt-1 text-sm text-red-600">{errors.vigencia}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción detallada de la cotización"
              />
            </div>

            {/* Items de la cotización */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Items de la Cotización
                </h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Item
                </button>
              </div>

              {formData.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-md">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Concepto
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantidad
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Precio Unit.
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-200 px-3 py-2">
                            <input
                              type="text"
                              value={item.concepto}
                              onChange={(e) =>
                                updateItem(index, "concepto", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Concepto"
                            />
                          </td>
                          <td className="border border-gray-200 px-3 py-2">
                            <input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) =>
                                updateItem(index, "cantidad", e.target.value)
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="border border-gray-200 px-3 py-2">
                            <input
                              type="number"
                              value={item.precioUnitario}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "precioUnitario",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right">
                            ${item.total?.toLocaleString() || "0"}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Monto Total */}
            <div>
              <label
                htmlFor="monto"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Monto Total *
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.monto ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
                readOnly={formData.items.length > 0}
              />
              {errors.monto && (
                <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? "Guardando..."
                  : initialData
                  ? "Actualizar"
                  : "Crear Cotización"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
