import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { validatePurchase } from "../utils/validations";
import { projectsAPI } from "../services/api";

const PurchaseForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    categoria: "",
    monto: "",
    proyectoId: "",
    proveedor: "",
    fechaCompra: "",
    estado: "pendiente",
  });

  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();

    if (initialData) {
      setFormData({
        descripcion: initialData.descripcion || "",
        categoria: initialData.categoria || "",
        monto: initialData.monto || "",
        proyectoId: initialData.proyectoId || "",
        proveedor: initialData.proveedor || "",
        fechaCompra: initialData.fechaCompra || "",
        estado: initialData.estado || "pendiente",
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validatePurchase(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error al guardar compra:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryOptions = () => [
    { value: "software", label: "Software" },
    { value: "hardware", label: "Hardware" },
    { value: "servicios", label: "Servicios" },
    { value: "materiales", label: "Materiales" },
    { value: "capacitacion", label: "Capacitación" },
    { value: "otros", label: "Otros" },
  ];

  const getStatusOptions = () => [
    { value: "pendiente", label: "Pendiente" },
    { value: "aprobado", label: "Aprobado" },
    { value: "rechazado", label: "Rechazado" },
    { value: "completado", label: "Completado" },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Editar Compra" : "Nueva Compra"}
            </h2>
            <p className="text-gray-600 mt-1">
              {initialData
                ? "Modifica los datos de la compra"
                : "Registra una nueva compra"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descripción */}
            <div className="md:col-span-2">
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.descripcion ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe la compra..."
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.categoria ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {getCategoryOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label
                htmlFor="monto"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Monto *
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.monto ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.monto && (
                <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
              )}
            </div>

            {/* Proyecto */}
            <div>
              <label
                htmlFor="proyectoId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Proyecto *
              </label>
              <select
                id="proyectoId"
                name="proyectoId"
                value={formData.proyectoId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.proyectoId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar proyecto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.nombre}
                  </option>
                ))}
              </select>
              {errors.proyectoId && (
                <p className="mt-1 text-sm text-red-600">{errors.proyectoId}</p>
              )}
            </div>

            {/* Proveedor */}
            <div>
              <label
                htmlFor="proveedor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Proveedor *
              </label>
              <input
                type="text"
                id="proveedor"
                name="proveedor"
                value={formData.proveedor}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.proveedor ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nombre del proveedor"
              />
              {errors.proveedor && (
                <p className="mt-1 text-sm text-red-600">{errors.proveedor}</p>
              )}
            </div>

            {/* Fecha de Compra */}
            <div>
              <label
                htmlFor="fechaCompra"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha de Compra
              </label>
              <input
                type="date"
                id="fechaCompra"
                name="fechaCompra"
                value={formData.fechaCompra}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Estado */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {getStatusOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
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
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? "Guardando..."
                : initialData
                ? "Actualizar"
                : "Crear Compra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;
