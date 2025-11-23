import React, { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { projectsAPI } from "../services/api";
import { validateProject } from "../utils/validations";
import { PROJECT_STATUS } from "../utils/constants";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    presupuesto: "",
    fechaInicio: "",
    fechaFin: "",
    responsable: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateProject(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // Construir projectData correctamente antes de usarlo
      const projectData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        presupuesto: Number.parseFloat(formData.presupuesto || "0"),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin || null,
        responsable: formData.responsable,
      };

      if (editingProject) {
        const response = await projectsAPI.updateProject(
          editingProject.id,
          projectData
        );
        if (response.success) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? response.data : p))
          );
        }
      } else {
        const response = await projectsAPI.createProject(projectData);
        if (response.success) {
          setProjects((prev) => [...prev, response.data]);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      nombre: project.nombre,
      descripcion: project.descripcion,
      presupuesto: (project.presupuesto ?? "").toString(),
      fechaInicio: project.fechaInicio,
      fechaFin: project.fechaFin || "",
      responsable: project.responsable,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este proyecto?")) {
      try {
        const response = await projectsAPI.deleteProject(id);
        if (response.success) {
          setProjects((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Error al eliminar proyecto:", error);
      }
    }
  };

  const handleViewDetails = (project) => {
    alert(
      `Detalles del proyecto: ${project.nombre}\n\nDescripción: ${
        project.descripcion
      }\nPresupuesto: $${(
        project.presupuesto ?? 0
      ).toLocaleString()}\nResponsable: ${project.responsable}`
    );
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      presupuesto: "",
      fechaInicio: "",
      fechaFin: "",
      responsable: "",
    });
    setErrors({});
    setEditingProject(null);
    setShowForm(false);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.nombre ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.descripcion ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" || project.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Proyectos
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra y supervisa todos los proyectos activos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value={PROJECT_STATUS.PENDING}>Pendiente</option>
              <option value={PROJECT_STATUS.IN_PROGRESS}>En Progreso</option>
              <option value={PROJECT_STATUS.COMPLETED}>Completado</option>
              <option value={PROJECT_STATUS.CANCELLED}>Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Formulario de proyecto */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ej: Sistema de Inventario"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.descripcion ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Descripción detallada del proyecto..."
                  />
                  {errors.descripcion && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.descripcion}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Presupuesto *
                  </label>
                  <input
                    type="number"
                    name="presupuesto"
                    value={formData.presupuesto}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.presupuesto ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.presupuesto && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.presupuesto}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsable
                  </label>
                  <input
                    type="text"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fechaInicio ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.fechaInicio && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fechaInicio}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin (Opcional)
                  </label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingProject ? "Actualizar" : "Crear Proyecto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de proyectos */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter
              ? "No se encontraron proyectos"
              : "No hay proyectos"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza creando tu primer proyecto"}
          </p>
          {!searchTerm && !statusFilter && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Proyecto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
