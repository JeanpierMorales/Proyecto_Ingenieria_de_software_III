import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock quotations data
let quotations = [
  {
    id: 1,
    projectId: 1,
    supplier: "Tech Solutions Inc.",
    description: "Desarrollo de software personalizado",
    amount: 75000,
    status: "approved",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    projectId: 1,
    supplier: "Design Studio Pro",
    description: "Diseño de interfaz de usuario",
    amount: 25000,
    status: "pending",
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// GET /api/quotations - Obtener todas las cotizaciones
router.get("/", (req, res) => {
  try {
    const { status, projectId, page = 1, limit = 10 } = req.query;

    let filteredQuotations = [...quotations];

    // Filtrar por estado
    if (status) {
      filteredQuotations = filteredQuotations.filter(
        (q) => q.status === status
      );
    }

    // Filtrar por proyecto
    if (projectId) {
      filteredQuotations = filteredQuotations.filter(
        (q) => q.projectId === Number.parseInt(projectId)
      );
    }

    // Paginación
    const startIndex = (page - 1) * Number.parseInt(limit);
    const endIndex = startIndex + Number.parseInt(limit);
    const paginatedQuotations = filteredQuotations.slice(startIndex, endIndex);

    res.json({
      quotations: paginatedQuotations,
      total: filteredQuotations.length,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(filteredQuotations.length / Number.parseInt(limit)),
    });
  } catch (error) {
    console.error("Error obteniendo cotizaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/quotations/:id - Obtener cotización por ID
router.get("/:id", (req, res) => {
  try {
    const quotation = quotations.find(
      (q) => q.id === Number.parseInt(req.params.id)
    );
    if (!quotation) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }
    res.json(quotation);
  } catch (error) {
    console.error("Error obteniendo cotización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/quotations - Crear nueva cotización
router.post("/", authenticateToken, (req, res) => {
  try {
    const { projectId, supplier, description, amount, validUntil } = req.body;

    if (!projectId || !supplier || !description || amount === undefined) {
      return res.status(400).json({
        message: "Proyecto, proveedor, descripción y monto son requeridos",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "El monto debe ser positivo" });
    }

    const newQuotation = {
      id: quotations.length + 1,
      projectId: Number.parseInt(projectId),
      supplier,
      description,
      amount: Number.parseFloat(amount),
      status: "pending",
      validUntil: validUntil
        ? new Date(validUntil)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    quotations.push(newQuotation);

    res.status(201).json({
      message: "Cotización creada exitosamente",
      quotation: newQuotation,
    });
  } catch (error) {
    console.error("Error creando cotización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/quotations/:id - Actualizar cotización
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const quotation = quotations.find(
      (q) => q.id === Number.parseInt(req.params.id)
    );
    if (!quotation) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    const { supplier, description, amount, status, validUntil } = req.body;

    if (supplier) quotation.supplier = supplier;
    if (description) quotation.description = description;
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: "El monto debe ser positivo" });
      }
      quotation.amount = Number.parseFloat(amount);
    }
    if (status) quotation.status = status;
    if (validUntil) quotation.validUntil = new Date(validUntil);
    quotation.updatedAt = new Date();

    res.json({
      message: "Cotización actualizada exitosamente",
      quotation,
    });
  } catch (error) {
    console.error("Error actualizando cotización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/quotations/:id - Eliminar cotización
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const quotationIndex = quotations.findIndex(
      (q) => q.id === Number.parseInt(req.params.id)
    );
    if (quotationIndex === -1) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    quotations.splice(quotationIndex, 1);

    res.json({ message: "Cotización eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando cotización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/quotations/:id/approve - Aprobar cotización
router.post("/:id/approve", authenticateToken, (req, res) => {
  try {
    const quotation = quotations.find(
      (q) => q.id === Number.parseInt(req.params.id)
    );
    if (!quotation) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    // Solo manager o admin pueden aprobar
    if (!["manager", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para aprobar cotizaciones" });
    }

    quotation.status = "approved";
    quotation.updatedAt = new Date();

    res.json({
      message: "Cotización aprobada exitosamente",
      quotation,
    });
  } catch (error) {
    console.error("Error aprobando cotización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/quotations/:id/reject - Rechazar cotización
router.post("/:id/reject", authenticateToken, (req, res) => {
  try {
    const quotation = quotations.find(
      (q) => q.id === Number.parseInt(req.params.id)
    );
    if (!quotation) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    // Solo manager o admin pueden rechazar
    if (!["manager", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para rechazar cotizaciones" });
    }

    quotation.status = "rejected";
    quotation.updatedAt = new Date();

    res.json({
      message: "Cotización rechazada exitosamente",
      quotation,
    });
  } catch (error) {
    console.error("Error rechazando cotización:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/quotations/project/:projectId - Obtener cotizaciones de un proyecto
router.get("/project/:projectId", (req, res) => {
  try {
    const projectQuotations = quotations.filter(
      (q) => q.projectId === Number.parseInt(req.params.projectId)
    );
    res.json(projectQuotations);
  } catch (error) {
    console.error("Error obteniendo cotizaciones del proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
