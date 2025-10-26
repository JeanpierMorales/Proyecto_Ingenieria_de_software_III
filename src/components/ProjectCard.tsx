import { Calendar, DollarSign, User, Clock } from "lucide-react";

interface Project {
  id: number;
  nombre: string;
  estado: "pendiente" | "en_progreso" | "completado" | "cancelado";
  descripcion: string;
  presupuesto?: number;
  responsable: string;
  fechaInicio: string;
  fechaFin?: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (project: Project) => void;
}

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onViewDetails,
}: ProjectCardProps) => {
  const getStatusColor = (estado: Project["estado"]) => {
    const colors: Record<Project["estado"], string> = {
      pendiente: "bg-yellow-100 text-yellow-800",
      en_progreso: "bg-blue-100 text-blue-800",
      completado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (estado: Project["estado"]) => {
    const texts: Record<Project["estado"], string> = {
      pendiente: "Pendiente",
      en_progreso: "En Progreso",
      completado: "Completado",
      cancelado: "Cancelado",
    };
    return texts[estado] || estado;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {project.nombre}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            project.estado
          )}`}
        >
          {getStatusText(project.estado)}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.descripcion}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Presupuesto: ${project.presupuesto?.toLocaleString()}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <User className="w-4 h-4 mr-2" />
          <span>Responsable: {project.responsable}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            Inicio: {new Date(project.fechaInicio).toLocaleDateString()}
          </span>
        </div>

        {project.fechaFin && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>Fin: {new Date(project.fechaFin).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails?.(project)}
          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Ver Detalles
        </button>
        <button
          onClick={() => onEdit?.(project)}
          className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete?.(project.id)}
          className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
