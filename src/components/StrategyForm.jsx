import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { validateStrategy } from "../utils/validations";
import { projectsAPI } from "../services/api";

const StrategyForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "operacional",
    prioridad: "media",
    proyectoId: "",
    fechaInicio: "",
    fechaFin: "",
    responsable: "",
  });

  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();

    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        tipo: initialData.tipo || "operacional",
        prioridad: initialData.prioridad || "media",
        proyectoId: initialData.proyectoId || "",
        fechaInicio: initialData.fechaInicio || "",
        fechaFin: initialData.fechaFin || "",
        responsable: initialData.responsable || "",
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

    const validation = validateStrategy(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const strategyData = {
        ...formData,
        proyectoId: parseInt(formData.proyectoId),
      };

      await onSubmit(strategyData);
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
          {initialData ? "Editar Estrategia" : "Nueva Estrategia"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre de la Estrategia *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Estrategia de Marketing Digital"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Estrategia *
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
              <option value="operacional">Operacional</option>
              <option value="tactica">Táctica</option>
              <option value="estrategica">Estratégica</option>
              <option value="marketing">Marketing</option>
              <option value="financiera">Financiera</option>
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="prioridad"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Prioridad *
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.prioridad ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
            {errors.prioridad && (
              <p className="mt-1 text-sm text-red-600">{errors.prioridad}</p>
            )}
          </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="fechaInicio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fecha de Inicio *
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fechaInicio ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fechaInicio && (
              <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="fechaFin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fecha de Fin
            </label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="responsable"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Responsable *
          </label>
          <input
            type="text"
            id="responsable"
            name="responsable"
            value={formData.responsable}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.responsable ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Juan Pérez"
          />
          {errors.responsable && (
            <p className="mt-1 text-sm text-red-600">{errors.responsable}</p>
          )}
        </div>

        <div className="mb-6">
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
            rows="4"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.descripcion ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe la estrategia en detalle..."
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
          )}
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
              : "Crear Estrategia"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StrategyForm;
