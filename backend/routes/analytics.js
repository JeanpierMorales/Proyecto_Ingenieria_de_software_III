import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock analytics data
const analyticsData = {
  overview: {
    totalProjects: 25,
    activeProjects: 18,
    completedProjects: 7,
    totalBudget: 2500000,
    spentBudget: 1250000,
    remainingBudget: 1250000,
    totalUsers: 15,
    activeUsers: 12,
  },
  trends: {
    projectsByMonth: [
      { month: "Ene", count: 3 },
      { month: "Feb", count: 5 },
      { month: "Mar", count: 4 },
      { month: "Abr", count: 6 },
      { month: "May", count: 7 },
    ],
    budgetByMonth: [
      { month: "Ene", amount: 450000 },
      { month: "Feb", amount: 520000 },
      { month: "Mar", amount: 480000 },
      { month: "Abr", amount: 610000 },
      { month: "May", amount: 690000 },
    ],
  },
  performance: {
    avgProjectDuration: 45, // días
    avgBudgetUtilization: 78, // porcentaje
    onTimeDeliveryRate: 85, // porcentaje
    customerSatisfaction: 4.2, // de 5
  },
};

// GET /api/analytics/overview - Resumen general
router.get("/overview", authenticateToken, (req, res) => {
  try {
    res.json(analyticsData.overview);
  } catch (error) {
    console.error("Error obteniendo resumen de analytics:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/analytics/trends - Tendencias
router.get("/trends", authenticateToken, (req, res) => {
  try {
    const { metric = "all" } = req.query;

    let data = analyticsData.trends;

    if (metric === "projects") {
      data = { projectsByMonth: analyticsData.trends.projectsByMonth };
    } else if (metric === "budget") {
      data = { budgetByMonth: analyticsData.trends.budgetByMonth };
    }

    res.json(data);
  } catch (error) {
    console.error("Error obteniendo tendencias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/analytics/performance - Métricas de rendimiento
router.get("/performance", authenticateToken, (req, res) => {
  try {
    res.json(analyticsData.performance);
  } catch (error) {
    console.error("Error obteniendo métricas de rendimiento:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/analytics/projects - Analytics por proyectos
router.get("/projects", authenticateToken, (req, res) => {
  try {
    const projectAnalytics = [
      {
        id: 1,
        name: "Proyecto Alpha",
        budget: 150000,
        spent: 75000,
        progress: 85,
        status: "active",
        teamSize: 5,
        startDate: "2024-01-15",
        estimatedEndDate: "2024-04-15",
      },
      {
        id: 2,
        name: "Proyecto Beta",
        budget: 200000,
        spent: 200000,
        progress: 100,
        status: "completed",
        teamSize: 8,
        startDate: "2023-11-01",
        estimatedEndDate: "2024-02-28",
      },
    ];

    res.json(projectAnalytics);
  } catch (error) {
    console.error("Error obteniendo analytics de proyectos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/analytics/users - Analytics por usuarios
router.get("/users", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver analytics de usuarios" });
    }

    const userAnalytics = [
      {
        id: 1,
        name: "Admin User",
        role: "admin",
        projectsAssigned: 5,
        tasksCompleted: 45,
        avgTaskCompletionTime: 2.5, // días
        lastActivity: new Date(),
      },
      {
        id: 2,
        name: "Manager User",
        role: "manager",
        projectsAssigned: 8,
        tasksCompleted: 67,
        avgTaskCompletionTime: 3.2,
        lastActivity: new Date(),
      },
    ];

    res.json(userAnalytics);
  } catch (error) {
    console.error("Error obteniendo analytics de usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/analytics/financial - Analytics financieros
router.get("/financial", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver analytics financieros" });
    }

    const financialAnalytics = {
      totalRevenue: 2500000,
      totalExpenses: 1250000,
      netProfit: 1250000,
      budgetUtilization: 78,
      expensesByCategory: {
        Desarrollo: 450000,
        Diseño: 250000,
        Infraestructura: 300000,
        Marketing: 150000,
        Administrativo: 100000,
      },
      monthlyRevenue: [
        { month: "Ene", amount: 450000 },
        { month: "Feb", amount: 520000 },
        { month: "Mar", amount: 480000 },
        { month: "Abr", amount: 610000 },
        { month: "May", amount: 690000 },
      ],
    };

    res.json(financialAnalytics);
  } catch (error) {
    console.error("Error obteniendo analytics financieros:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/analytics/dashboard - Dashboard completo
router.get("/dashboard", authenticateToken, (req, res) => {
  try {
    const dashboardData = {
      overview: analyticsData.overview,
      trends: analyticsData.trends,
      performance: analyticsData.performance,
      alerts: [
        {
          type: "warning",
          message: "Proyecto Alpha está 10% sobre presupuesto",
          projectId: 1,
        },
        {
          type: "info",
          message: "5 proyectos serán completados este mes",
          count: 5,
        },
      ],
      topProjects: [
        { id: 1, name: "Proyecto Alpha", progress: 85, status: "active" },
        { id: 2, name: "Proyecto Beta", progress: 100, status: "completed" },
      ],
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error obteniendo dashboard de analytics:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/analytics/export - Exportar datos de analytics
router.post("/export", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden exportar analytics" });
    }

    const { type, format = "json", dateRange } = req.body;

    // Simular exportación
    const exportData = {
      type,
      format,
      dateRange,
      exportedAt: new Date(),
      status: "processing",
    };

    // Simular procesamiento
    setTimeout(() => {
      console.log(
        `Exportación de analytics ${type} en formato ${format} completada`
      );
    }, 3000);

    res.json({
      message: "Exportación iniciada exitosamente",
      export: exportData,
    });
  } catch (error) {
    console.error("Error exportando analytics:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
