import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock database - en producción usarías una base de datos real
let projects = [
  {
    id: 1,
    name: "Proyecto Alpha",
    description: "Desarrollo de aplicación web",
    budget: 150000,
    status: "active",
    createdBy: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Proyecto Beta",
    description: "Sistema de gestión",
    budget: 200000,
    status: "completed",
    createdBy: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// GET /api/projects - Obtener todos los proyectos
router.get("/", (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    let filteredProjects = [...projects];

    // Filtrar por estado
    if (status) {
      filteredProjects = filteredProjects.filter((p) => p.status === status);
    }

    // Ordenar
    filteredProjects.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number.parseInt(limit, 10);
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    res.json({
      projects: paginatedProjects,
      total: filteredProjects.length,
      page: Number.parseInt(page, 10),
      limit: Number.parseInt(limit, 10),
      totalPages: Math.ceil(
        filteredProjects.length / Number.parseInt(limit, 10)
      ),
    });
  } catch (error) {
    console.error("Error obteniendo proyectos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/projects/:id - Obtener proyecto por ID
router.get("/:id", (req, res) => {
  try {
    const project = projects.find(
      (p) => p.id === Number.parseInt(req.params.id, 10)
    );
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error obteniendo proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/projects - Crear nuevo proyecto
router.post("/", authenticateToken, (req, res) => {
  try {
    const { name, description, budget, status = "active" } = req.body;

    // Validar entrada
    if (!name || !description || budget === undefined) {
      return res
        .status(400)
        .json({ message: "Nombre, descripción y presupuesto son requeridos" });
    }

    if (budget < 0) {
      return res
        .status(400)
        .json({ message: "El presupuesto debe ser positivo" });
    }

    // Crear proyecto
    const newProject = {
      id: projects.length + 1,
      name,
      description,
      budget: Number.parseFloat(budget),
      status,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projects.push(newProject);

    res.status(201).json({
      message: "Proyecto creado exitosamente",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creando proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/projects/:id - Actualizar proyecto
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const project = projects.find(
      (p) => p.id === Number.parseInt(req.params.id)
    );
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Verificar permisos (solo el creador o admin puede editar)
    if (project.createdBy !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para editar este proyecto" });
    }

    const { name, description, budget, status } = req.body;

    // Actualizar campos
    if (name) project.name = name;
    if (description) project.description = description;
    if (budget !== undefined) {
      if (budget < 0) {
        return res
          .status(400)
          .json({ message: "El presupuesto debe ser positivo" });
      }
      project.budget = Number.parseFloat(budget);
    }
    if (status) project.status = status;
    project.updatedAt = new Date();

    res.json({
      message: "Proyecto actualizado exitosamente",
      project,
    });
  } catch (error) {
    console.error("Error actualizando proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/projects/:id - Eliminar proyecto
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const projectIndex = projects.findIndex(
      (p) => p.id === Number.parseInt(req.params.id, 10)
    );
    if (projectIndex === -1) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const project = projects[projectIndex];

    // Verificar permisos (solo admin puede eliminar)
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden eliminar proyectos" });
    }

    projects.splice(projectIndex, 1);

    res.json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/projects/:id/tasks - Obtener tareas de un proyecto
router.get("/:id/tasks", (req, res) => {
  try {
    const project = projects.find(
      (p) => p.id === Number.parseInt(req.params.id, 10)
    );
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Mock tasks - en producción vendrían de la base de datos
    const tasks = [
      {
        id: 1,
        projectId: project.id,
        title: "Análisis de requisitos",
        status: "completed",
      },
      {
        id: 2,
        projectId: project.id,
        title: "Diseño de arquitectura",
        status: "in_progress",
      },
      {
        id: 3,
        projectId: project.id,
        title: "Desarrollo frontend",
        status: "pending",
      },
    ];

    res.json(tasks);
  } catch (error) {
    console.error("Error obteniendo tareas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/projects/:id/tasks - Crear tarea para un proyecto
router.post("/:id/tasks", authenticateToken, (req, res) => {
  try {
    const project = projects.find(
      (p) => p.id === Number.parseInt(req.params.id, 10)
    );
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const { title, description, status = "pending" } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "El título de la tarea es requerido" });
    }

    // Mock task creation
    const newTask = {
      id: Date.now(), // Simple ID generation
      projectId: project.id,
      title,
      description,
      status,
      createdBy: req.user.id,
      createdAt: new Date(),
    };

    res.status(201).json({
      message: "Tarea creada exitosamente",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creando tarea:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
