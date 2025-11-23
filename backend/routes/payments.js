import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock payments data
let payments = [
  {
    id: 1,
    purchaseOrderId: 1,
    amount: 75000,
    method: "transfer",
    status: "completed",
    reference: "PAY-2024-001",
    paidAt: new Date(),
    dueDate: new Date(),
    notes: "Pago por desarrollo de software",
    processedBy: 1,
  },
  {
    id: 2,
    purchaseOrderId: 2,
    amount: 25000,
    method: "check",
    status: "pending",
    reference: "PAY-2024-002",
    paidAt: null,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: "Pago por diseño de interfaz",
    processedBy: null,
  },
];

// GET /api/payments - Obtener todos los pagos
router.get("/", authenticateToken, (req, res) => {
  try {
    const { status, method, purchaseOrderId, page = 1, limit = 10 } = req.query;

    let filteredPayments = [...payments];

    // Filtrar por estado
    if (status) {
      filteredPayments = filteredPayments.filter((p) => p.status === status);
    }

    // Filtrar por método
    if (method) {
      filteredPayments = filteredPayments.filter((p) => p.method === method);
    }

    // Filtrar por orden de compra
    if (purchaseOrderId) {
      filteredPayments = filteredPayments.filter(
        (p) => p.purchaseOrderId === Number.parseInt(purchaseOrderId)
      );
    }

    // Ordenar por fecha descendente
    filteredPayments.sort((a, b) => {
      const aDate = a.paidAt || a.dueDate;
      const bDate = b.paidAt || b.dueDate;
      return new Date(bDate) - new Date(aDate);
    });

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number.parseInt(limit);
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    res.json({
      payments: paginatedPayments,
      total: filteredPayments.length,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(filteredPayments.length / limit),
    });
  } catch (error) {
    console.error("Error obteniendo pagos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/payments/:id - Obtener pago por ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const payment = payments.find(
      (p) => p.id === Number.parseInt(req.params.id)
    );
    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error obteniendo pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/payments - Crear nuevo pago
router.post("/", authenticateToken, (req, res) => {
  try {
    const { purchaseOrderId, amount, method, dueDate, notes } = req.body;

    if (!purchaseOrderId || !amount || !method) {
      return res.status(400).json({
        message: "Orden de compra, monto y método son requeridos",
      });
    }

    if (!["cash", "check", "transfer", "credit_card"].includes(method)) {
      return res.status(400).json({ message: "Método de pago inválido" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "El monto debe ser positivo" });
    }

    // Generar referencia
    const reference = `PAY-${new Date().getFullYear()}-${String(
      payments.length + 1
    ).padStart(3, "0")}`;

    const newPayment = {
      id: payments.length + 1,
      purchaseOrderId: Number.parseInt(purchaseOrderId),
      amount: Number.parseFloat(amount),
      method,
      status: "pending",
      reference,
      paidAt: null,
      dueDate: dueDate
        ? new Date(dueDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: notes || "",
      processedBy: null,
    };

    payments.push(newPayment);

    res.status(201).json({
      message: "Pago creado exitosamente",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error creando pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/payments/:id - Actualizar pago
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const payment = payments.find(
      (p) => p.id === Number.parseInt(req.params.id)
    );
    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    // Solo pagos pendientes pueden ser actualizados
    if (payment.status === "completed") {
      return res
        .status(400)
        .json({ message: "No se pueden actualizar pagos completados" });
    }

    const { amount, method, dueDate, notes } = req.body;

    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: "El monto debe ser positivo" });
      }
      payment.amount = Number.parseFloat(amount);
    }

    if (method) {
      if (!["cash", "check", "transfer", "credit_card"].includes(method)) {
        return res.status(400).json({ message: "Método de pago inválido" });
      }
      payment.method = method;
    }

    if (dueDate) payment.dueDate = new Date(dueDate);
    if (notes !== undefined) payment.notes = notes;

    res.json({
      message: "Pago actualizado exitosamente",
      payment,
    });
  } catch (error) {
    console.error("Error actualizando pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/payments/:id/process - Procesar pago
router.post("/:id/process", authenticateToken, (req, res) => {
  try {
    const payment = payments.find(
      (p) => p.id === Number.parseInt(req.params.id)
    );
    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({ message: "El pago ya ha sido procesado" });
    }

    // Solo admin o manager pueden procesar pagos
    if (!["admin", "manager"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para procesar pagos" });
    }

    payment.status = "completed";
    payment.paidAt = new Date();
    payment.processedBy = req.user.id;

    res.json({
      message: "Pago procesado exitosamente",
      payment,
    });
  } catch (error) {
    console.error("Error procesando pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/payments/:id/cancel - Cancelar pago
router.post("/:id/cancel", authenticateToken, (req, res) => {
  try {
    const payment = payments.find(
      (p) => p.id === Number.parseInt(req.params.id)
    );
    if (!payment) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    if (payment.status === "completed") {
      return res
        .status(400)
        .json({ message: "No se pueden cancelar pagos completados" });
    }

    // Solo admin puede cancelar pagos
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden cancelar pagos" });
    }

    payment.status = "cancelled";

    res.json({
      message: "Pago cancelado exitosamente",
      payment,
    });
  } catch (error) {
    console.error("Error cancelando pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/payments/:id - Eliminar pago
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const paymentIndex = payments.findIndex(
      (p) => p.id === Number.parseInt(req.params.id)
    );
    if (paymentIndex === -1) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    const payment = payments[paymentIndex];

    // Solo admin puede eliminar pagos
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden eliminar pagos" });
    }

    // No permitir eliminar pagos completados
    if (payment.status === "completed") {
      return res
        .status(400)
        .json({ message: "No se pueden eliminar pagos completados" });
    }

    payments.splice(paymentIndex, 1);

    res.json({ message: "Pago eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/payments/purchase-order/:purchaseOrderId - Obtener pagos por orden de compra
router.get(
  "/purchase-order/:purchaseOrderId",
  authenticateToken,
  (req, res) => {
    try {
      const orderPayments = payments.filter(
        (p) => p.purchaseOrderId === Number.parseInt(req.params.purchaseOrderId)
      );
      res.json(orderPayments);
    } catch (error) {
      console.error("Error obteniendo pagos de la orden:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

// GET /api/payments/stats - Estadísticas de pagos
router.get("/stats/summary", authenticateToken, (req, res) => {
  try {
    const stats = {
      totalPayments: payments.length,
      completedPayments: payments.filter((p) => p.status === "completed")
        .length,
      pendingPayments: payments.filter((p) => p.status === "pending").length,
      cancelledPayments: payments.filter((p) => p.status === "cancelled")
        .length,
      totalAmount: payments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0),
      paymentsByMethod: payments.reduce((acc, payment) => {
        acc[payment.method] = (acc[payment.method] || 0) + 1;
        return acc;
      }, {}),
      upcomingPayments: payments
        .filter(
          (p) => p.status === "pending" && new Date(p.dueDate) > new Date()
        )
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error obteniendo estadísticas de pagos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
