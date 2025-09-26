import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { validateReport } from "../utils/validations";
import { projectsAPI } from "../services/api";

const ReportForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "mensual",
    proyectoId: "",
    progreso: 0,
    observaciones: "",
  });

  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();

    if (initialData) {
      setFormData({
        titulo: initialData.titulo || "",
        tipo: initialData.tipo || "mensual",
        proyectoId: initialData.proyectoId || "",
        progreso: initialData.progreso || 0,
        observaciones: initialData.observaciones || "",
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
    setLoading(true);

    const validation = validateReport(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const reportData = {
        ...formData,
        proyectoId: parseInt(formData.proyectoId),
        progreso: parseInt(formData.progreso),
      };

      await onSubmit(reportData);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {initialData ? "Editar Reporte" : "Nuevo Reporte"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título del Reporte *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.titulo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Informe Mensual - Enero 2024"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Reporte *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.tipo ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
              <option value="avance">Avance</option>
              <option value="final">Final</option>
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

          <div>
            <label
              htmlFor="progreso"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Progreso (%) *
            </label>
            <input
              type="number"
              id="progreso"
              name="progreso"
              min="0"
              max="100"
              value={formData.progreso}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.progreso ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.progreso && (
              <p className="mt-1 text-sm text-red-600">{errors.progreso}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="observaciones"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observaciones sobre el progreso del proyecto..."
          />
        </div>

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
              : "Crear Reporte"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
