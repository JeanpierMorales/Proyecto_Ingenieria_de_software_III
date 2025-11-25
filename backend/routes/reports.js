import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock reports data
let reports = [
  {
    id: 1,
    title: "Reporte Mensual - Enero 2024",
    type: "monthly",
    year: 2024,
    month: 1,
    data: {
      totalProjects: 25,
      completedProjects: 7,
      totalBudget: 2500000,
      spentBudget: 1250000,
      activeUsers: 15,
    },
    createdAt: new Date(),
    createdBy: 1,
  },
  {
    id: 2,
    title: "Reporte Anual - 2023",
    type: "annual",
    year: 2023,
    data: {
      totalProjects: 120,
      completedProjects: 95,
      totalBudget: 15000000,
      spentBudget: 12000000,
      activeUsers: 25,
    },
    createdAt: new Date(),
    createdBy: 1,
  },
];

// GET /api/reports - Obtener todos los reportes
router.get("/", (req, res) => {
  try {
    const { type, year, month, page = 1, limit = 10 } = req.query;

    let filteredReports = [...reports];

    // Filtrar por tipo
    if (type) {
      filteredReports = filteredReports.filter((r) => r.type === type);
    }

    // Filtrar por año
    if (year) {
      filteredReports = filteredReports.filter(
        (r) => r.year === Number.parseInt(year)
      );
    }

    // Filtrar por mes
    if (month) {
      filteredReports = filteredReports.filter(
        (r) => r.month === Number.parseInt(month)
      );
    }

    // Paginación
    const startIndex = (page - 1) * Number.parseInt(limit);
    const endIndex = startIndex + Number.parseInt(limit);
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    res.json({
      reports: paginatedReports,
      total: filteredReports.length,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(filteredReports.length / Number.parseInt(limit)),
    });
  } catch (error) {
    console.error("Error obteniendo reportes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/reports/:id - Obtener reporte por ID
router.get("/:id", (req, res) => {
  try {
    const report = reports.find((r) => r.id === Number.parseInt(req.params.id));
    if (!report) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }
    res.json(report);
  } catch (error) {
    console.error("Error obteniendo reporte:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/reports - Crear nuevo reporte
router.post("/", authenticateToken, (req, res) => {
  try {
    const { title, type, year, month, data } = req.body;

    if (!title || !type || !year || !data) {
      return res
        .status(400)
        .json({ message: "Título, tipo, año y datos son requeridos" });
    }

    if (!["monthly", "quarterly", "annual", "custom"].includes(type)) {
      return res.status(400).json({ message: "Tipo de reporte inválido" });
    }

    if (type === "monthly" && !month) {
      return res
        .status(400)
        .json({ message: "Mes es requerido para reportes mensuales" });
    }

    const newReport = {
      id: reports.length + 1,
      title,
      type,
      year: Number.parseInt(year),
      month: month ? Number.parseInt(month) : null,
      data,
      createdAt: new Date(),
      createdBy: req.user.id,
    };

    reports.push(newReport);

    res.status(201).json({
      message: "Reporte creado exitosamente",
      report: newReport,
    });
  } catch (error) {
    console.error("Error creando reporte:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/reports/:id - Actualizar reporte
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const report = reports.find((r) => r.id === Number.parseInt(req.params.id));
    if (!report) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    // Solo el creador o admin pueden actualizar
    if (report.createdBy !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para actualizar este reporte" });
    }

    const { title, data } = req.body;

    if (title) report.title = title;
    if (data) report.data = data;

    res.json({
      message: "Reporte actualizado exitosamente",
      report,
    });
  } catch (error) {
    console.error("Error actualizando reporte:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/reports/:id - Eliminar reporte
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const reportIndex = reports.findIndex(
      (r) => r.id === Number.parseInt(req.params.id)
    );
    if (reportIndex === -1) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    const report = reports[reportIndex];

    // Solo el creador o admin pueden eliminar
    if (report.createdBy !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar este reporte" });
    }

    reports.splice(reportIndex, 1);

    res.json({ message: "Reporte eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando reporte:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/reports/generate/:type - Generar reporte automático
router.get("/generate/:type", authenticateToken, (req, res) => {
  try {
    const { type } = req.params;
    const { year, month } = req.query;

    if (!["monthly", "annual"].includes(type)) {
      return res.status(400).json({ message: "Tipo de reporte no soportado" });
    }

    // Mock data generation
    const reportData = {
      totalProjects: Math.floor(Math.random() * 50) + 10,
      completedProjects: Math.floor(Math.random() * 30) + 5,
      totalBudget: Math.floor(Math.random() * 5000000) + 1000000,
      spentBudget: Math.floor(Math.random() * 3000000) + 500000,
      activeUsers: Math.floor(Math.random() * 20) + 5,
      generatedAt: new Date(),
    };

    res.json({
      type,
      year: year ? Number.parseInt(year) : new Date().getFullYear(),
      month: month ? Number.parseInt(month) : null,
      data: reportData,
    });
  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/reports/dashboard - Datos para dashboard
router.get("/dashboard/summary", (req, res) => {
  try {
    const summary = {
      totalReports: reports.length,
      monthlyReports: reports.filter((r) => r.type === "monthly").length,
      annualReports: reports.filter((r) => r.type === "annual").length,
      latestReport: reports.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0],
      reportsByYear: reports.reduce((acc, report) => {
        acc[report.year] = (acc[report.year] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json(summary);
  } catch (error) {
    console.error("Error obteniendo resumen de reportes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
