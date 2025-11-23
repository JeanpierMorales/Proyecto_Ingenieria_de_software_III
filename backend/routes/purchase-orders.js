import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock purchase orders data
let purchaseOrders = [
  {
    id: 1,
    number: "PO-2024-001",
    supplier: "Tech Solutions Inc.",
    projectId: 1,
    items: [
      {
        description: "Desarrollo de software",
        quantity: 1,
        unitPrice: 75000,
        total: 75000,
      },
    ],
    totalAmount: 75000,
    status: "approved",
    requestedBy: 2,
    approvedBy: 1,
    createdAt: new Date(),
    approvedAt: new Date(),
    expectedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    number: "PO-2024-002",
    supplier: "Design Studio Pro",
    projectId: 1,
    items: [
      {
        description: "Diseño de interfaz",
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
    ],
    totalAmount: 25000,
    status: "pending",
    requestedBy: 2,
    approvedBy: null,
    createdAt: new Date(),
    approvedAt: null,
    expectedDelivery: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
];

// GET /api/purchase-orders - Obtener todas las órdenes de compra
router.get("/", authenticateToken, (req, res) => {
  try {
    const { status, projectId, supplier, page = 1, limit = 10 } = req.query;

    let filteredOrders = [...purchaseOrders];

    // Filtrar por estado
    if (status) {
      filteredOrders = filteredOrders.filter((po) => po.status === status);
    }

    // Filtrar por proyecto
    if (projectId) {
      filteredOrders = filteredOrders.filter(
        (po) => po.projectId === Number.parseInt(projectId)
      );
    }

    // Filtrar por proveedor
    if (supplier) {
      filteredOrders = filteredOrders.filter((po) =>
        po.supplier.toLowerCase().includes(supplier.toLowerCase())
      );
    }

    // Ordenar por fecha descendente
    filteredOrders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Paginación
    const startIndex = (page - 1) * Number.parseInt(limit);
    const endIndex = startIndex + Number.parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    res.json({
      purchaseOrders: paginatedOrders,
      total: filteredOrders.length,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(filteredOrders.length / Number.parseInt(limit)),
    });
  } catch (error) {
    console.error("Error obteniendo órdenes de compra:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/purchase-orders/:id - Obtener orden de compra por ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const order = purchaseOrders.find(
      (po) => po.id === Number.parseInt(req.params.id)
    );
    if (!order) {
      return res.status(404).json({ message: "Orden de compra no encontrada" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error obteniendo orden de compra:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/purchase-orders - Crear nueva orden de compra
router.post("/", authenticateToken, (req, res) => {
  try {
    const { supplier, projectId, items, expectedDelivery } = req.body;

    if (!supplier || !projectId || !items || items.length === 0) {
      return res.status(400).json({
        message: "Proveedor, proyecto e items son requeridos",
      });
    }

    // Calcular total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    // Generar número de orden
    const orderNumber = `PO-${new Date().getFullYear()}-${String(
      purchaseOrders.length + 1
    ).padStart(3, "0")}`;

    const newOrder = {
      id: purchaseOrders.length + 1,
      number: orderNumber,
      supplier,
      projectId: Number.parseInt(projectId),
      items,
      totalAmount,
      status: "pending",
      requestedBy: req.user.id,
      approvedBy: null,
      createdAt: new Date(),
      approvedAt: null,
      expectedDelivery: expectedDelivery
        ? new Date(expectedDelivery)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    purchaseOrders.push(newOrder);

    res.status(201).json({
      message: "Orden de compra creada exitosamente",
      purchaseOrder: newOrder,
    });
  } catch (error) {
    console.error("Error creando orden de compra:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/purchase-orders/:id - Actualizar orden de compra
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const order = purchaseOrders.find(
      (po) => po.id === Number.parseInt(req.params.id)
    );
    if (!order) {
      return res.status(404).json({ message: "Orden de compra no encontrada" });
    }

    // Solo el creador puede actualizar si está pendiente
    if (
      order.status === "pending" &&
      order.requestedBy !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para actualizar esta orden" });
    }

    const { supplier, items, expectedDelivery } = req.body;

    if (supplier) order.supplier = supplier;
    if (items) {
      order.items = items;
      order.totalAmount = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
    }
    if (expectedDelivery) order.expectedDelivery = new Date(expectedDelivery);

    res.json({
      message: "Orden de compra actualizada exitosamente",
      purchaseOrder: order,
    });
  } catch (error) {
    console.error("Error actualizando orden de compra:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/purchase-orders/:id/approve - Aprobar orden de compra
router.post("/:id/approve", authenticateToken, (req, res) => {
  try {
    const order = purchaseOrders.find(
      (po) => po.id === Number.parseInt(req.params.id)
    );
    if (!order) {
      return res.status(404).json({ message: "Orden de compra no encontrada" });
    }

    // Solo manager o admin pueden aprobar
    if (!["manager", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para aprobar órdenes de compra" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "La orden ya ha sido procesada" });
    }

    order.status = "approved";
    order.approvedBy = req.user.id;
    order.approvedAt = new Date();

    res.json({
      message: "Orden de compra aprobada exitosamente",
      purchaseOrder: order,
    });
  } catch (error) {
    console.error("Error aprobando orden de compra:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/purchase-orders/:id/reject - Rechazar orden de compra
router.post("/:id/reject", authenticateToken, (req, res) => {
  try {
    const order = purchaseOrders.find(
      (po) => po.id === Number.parseInt(req.params.id)
    );
    if (!order) {
      return res.status(404).json({ message: "Orden de compra no encontrada" });
    }

    // Solo manager o admin pueden rechazar
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "No tienes permisos para rechazar órdenes de compra",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "La orden ya ha sido procesada" });
    }

    order.status = "rejected";
    order.approvedBy = req.user.id;
    order.approvedAt = new Date();

    res.json({
      message: "Orden de compra rechazada exitosamente",
      purchaseOrder: order,
    });
  } catch (error) {
    console.error("Error rechazando orden de compra:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/purchase-orders/:id - Eliminar orden de compra
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const orderIndex = purchaseOrders.findIndex(
      (po) => po.id === Number.parseInt(req.params.id)
    );
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Orden de compra no encontrada" });
    }

    const order = purchaseOrders[orderIndex];

    // Solo admin puede eliminar órdenes
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden eliminar órdenes de compra",
      });
    }

    // No permitir eliminar órdenes aprobadas
    if (order.status === "approved") {
      return res
        .status(400)
        .json({ message: "No se pueden eliminar órdenes aprobadas" });
    }

    purchaseOrders.splice(orderIndex, 1);

    res.json({ message: "Orden de compra eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando orden de compra:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/purchase-orders/project/:projectId - Obtener órdenes por proyecto
router.get("/project/:projectId", authenticateToken, (req, res) => {
  try {
    const projectOrders = purchaseOrders.filter(
      (po) => po.projectId === Number.parseInt(req.params.projectId)
    );
    res.json(projectOrders);
  } catch (error) {
    console.error("Error obteniendo órdenes del proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
