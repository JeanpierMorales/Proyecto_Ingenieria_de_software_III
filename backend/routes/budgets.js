import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock budgets data
let budgets = [
  {
    id: 1,
    projectId: 1,
    amount: 150000,
    spent: 75000,
    remaining: 75000,
    status: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    projectId: 2,
    amount: 200000,
    spent: 200000,
    remaining: 0,
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// GET /api/budgets - Obtener todos los presupuestos
router.get("/", (req, res) => {
  try {
    res.json(budgets);
  } catch (error) {
    console.error("Error obteniendo presupuestos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/budgets/:id - Obtener presupuesto por ID
router.get("/:id", (req, res) => {
  try {
    const budget = budgets.find((b) => b.id === parseInt(req.params.id));
    if (!budget) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    res.json(budget);
  } catch (error) {
    console.error("Error obteniendo presupuesto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/budgets - Crear nuevo presupuesto
router.post("/", authenticateToken, (req, res) => {
  try {
    const { projectId, amount } = req.body;

    if (!projectId || amount === undefined) {
      return res
        .status(400)
        .json({ message: "ID del proyecto y monto son requeridos" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "El monto debe ser positivo" });
    }

    // Verificar que el proyecto existe
    const projects = require("./projects"); // Importar para verificar
    // En producción, esto sería una consulta a la base de datos

    const newBudget = {
      id: budgets.length + 1,
      projectId: parseInt(projectId),
      amount: parseFloat(amount),
      spent: 0,
      remaining: parseFloat(amount),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    budgets.push(newBudget);

    res.status(201).json({
      message: "Presupuesto creado exitosamente",
      budget: newBudget,
    });
  } catch (error) {
    console.error("Error creando presupuesto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/budgets/:id - Actualizar presupuesto
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const budget = budgets.find((b) => b.id === parseInt(req.params.id));
    if (!budget) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }

    const { amount, status } = req.body;

    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: "El monto debe ser positivo" });
      }
      budget.amount = parseFloat(amount);
      budget.remaining = budget.amount - budget.spent;
    }

    if (status) {
      budget.status = status;
    }

    budget.updatedAt = new Date();

    res.json({
      message: "Presupuesto actualizado exitosamente",
      budget,
    });
  } catch (error) {
    console.error("Error actualizando presupuesto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/budgets/:id - Eliminar presupuesto
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const budgetIndex = budgets.findIndex(
      (b) => b.id === parseInt(req.params.id)
    );
    if (budgetIndex === -1) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }

    // Solo admin puede eliminar presupuestos
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden eliminar presupuestos" });
    }

    budgets.splice(budgetIndex, 1);

    res.json({ message: "Presupuesto eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando presupuesto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/budgets/project/:projectId - Obtener presupuesto de un proyecto
router.get("/project/:projectId", (req, res) => {
  try {
    const budget = budgets.find(
      (b) => b.projectId === parseInt(req.params.projectId)
    );
    if (!budget) {
      return res
        .status(404)
        .json({ message: "Presupuesto no encontrado para este proyecto" });
    }
    res.json(budget);
  } catch (error) {
    console.error("Error obteniendo presupuesto del proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/budgets/:id/approve - Aprobar presupuesto
router.post("/:id/approve", authenticateToken, (req, res) => {
  try {
    const budget = budgets.find((b) => b.id === parseInt(req.params.id));
    if (!budget) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }

    // Solo manager o admin pueden aprobar
    if (!["manager", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para aprobar presupuestos" });
    }

    budget.status = "approved";
    budget.updatedAt = new Date();

    res.json({
      message: "Presupuesto aprobado exitosamente",
      budget,
    });
  } catch (error) {
    console.error("Error aprobando presupuesto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/budgets/:id/reject - Rechazar presupuesto
router.post("/:id/reject", authenticateToken, (req, res) => {
  try {
    const budget = budgets.find((b) => b.id === parseInt(req.params.id));
    if (!budget) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }

    // Solo manager o admin pueden rechazar
    if (!["manager", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para rechazar presupuestos" });
    }

    budget.status = "rejected";
    budget.updatedAt = new Date();

    res.json({
      message: "Presupuesto rechazado exitosamente",
      budget,
    });
  } catch (error) {
    console.error("Error rechazando presupuesto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
