import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock notifications data
let notifications = [
  {
    id: 1,
    userId: 1,
    title: "Proyecto Aprobado",
    message: 'El proyecto "Sistema de Gestión" ha sido aprobado',
    type: "project_approved",
    priority: "normal",
    read: false,
    createdAt: new Date(),
    relatedId: 1,
    relatedType: "project",
  },
  {
    id: 2,
    userId: 1,
    title: "Stock Bajo",
    message: 'El item "Laptop Dell XPS 13" tiene stock bajo (2 unidades)',
    type: "low_stock",
    priority: "high",
    read: false,
    createdAt: new Date(),
    relatedId: 1,
    relatedType: "inventory",
  },
  {
    id: 3,
    userId: 2,
    title: "Pago Pendiente",
    message: "El pago de la orden PO-2024-001 vence en 3 días",
    type: "payment_due",
    priority: "high",
    read: true,
    createdAt: new Date(),
    relatedId: 1,
    relatedType: "payment",
  },
];

// GET /api/notifications - Obtener notificaciones del usuario
router.get("/", authenticateToken, (req, res) => {
  try {
    const { read, type, priority, page = 1, limit = 20 } = req.query;

    let userNotifications = notifications.filter(
      (n) => n.userId === req.user.id
    );

    // Filtrar por estado de lectura
    if (read !== undefined) {
      userNotifications = userNotifications.filter(
        (n) => n.read === (read === "true")
      );
    }

    // Filtrar por tipo
    if (type) {
      userNotifications = userNotifications.filter((n) => n.type === type);
    }

    // Filtrar por prioridad
    if (priority) {
      userNotifications = userNotifications.filter(
        (n) => n.priority === priority
      );
    }

    // Ordenar por fecha descendente
    userNotifications.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = userNotifications.slice(
      startIndex,
      endIndex
    );

    res.json({
      notifications: paginatedNotifications,
      total: userNotifications.length,
      unread: userNotifications.filter((n) => !n.read).length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(userNotifications.length / limit),
    });
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/notifications/:id - Obtener notificación específica
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const notification = notifications.find(
      (n) => n.id === parseInt(req.params.id) && n.userId === req.user.id
    );

    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error obteniendo notificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/notifications/:id/read - Marcar como leída
router.put("/:id/read", authenticateToken, (req, res) => {
  try {
    const notification = notifications.find(
      (n) => n.id === parseInt(req.params.id) && n.userId === req.user.id
    );

    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    notification.read = true;

    res.json({
      message: "Notificación marcada como leída",
      notification,
    });
  } catch (error) {
    console.error("Error marcando notificación como leída:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/notifications/read-all - Marcar todas como leídas
router.put("/read-all", authenticateToken, (req, res) => {
  try {
    const userNotifications = notifications.filter(
      (n) => n.userId === req.user.id
    );

    userNotifications.forEach((notification) => {
      notification.read = true;
    });

    res.json({
      message: "Todas las notificaciones marcadas como leídas",
      updated: userNotifications.length,
    });
  } catch (error) {
    console.error(
      "Error marcando todas las notificaciones como leídas:",
      error
    );
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/notifications/:id - Eliminar notificación
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(
      (n) => n.id === parseInt(req.params.id) && n.userId === req.user.id
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    notifications.splice(notificationIndex, 1);

    res.json({ message: "Notificación eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando notificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/notifications - Crear notificación (interno/admin)
router.post("/", authenticateToken, (req, res) => {
  try {
    // Solo admin puede crear notificaciones
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden crear notificaciones" });
    }

    const {
      userId,
      title,
      message,
      type,
      priority = "normal",
      relatedId,
      relatedType,
    } = req.body;

    if (!userId || !title || !message || !type) {
      return res.status(400).json({
        message: "Usuario, título, mensaje y tipo son requeridos",
      });
    }

    if (
      ![
        "low_stock",
        "payment_due",
        "project_approved",
        "budget_exceeded",
        "deadline_approaching",
        "system_alert",
      ].includes(type)
    ) {
      return res.status(400).json({ message: "Tipo de notificación inválido" });
    }

    if (!["low", "normal", "high", "urgent"].includes(priority)) {
      return res.status(400).json({ message: "Prioridad inválida" });
    }

    const newNotification = {
      id: notifications.length + 1,
      userId: parseInt(userId),
      title,
      message,
      type,
      priority,
      read: false,
      createdAt: new Date(),
      relatedId: relatedId || null,
      relatedType: relatedType || null,
    };

    notifications.push(newNotification);

    res.status(201).json({
      message: "Notificación creada exitosamente",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creando notificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/notifications/broadcast - Enviar notificación a múltiples usuarios
router.post("/broadcast", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden enviar notificaciones masivas",
      });
    }

    const {
      userIds,
      title,
      message,
      type,
      priority = "normal",
      relatedId,
      relatedType,
    } = req.body;

    if (
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0 ||
      !title ||
      !message ||
      !type
    ) {
      return res.status(400).json({
        message: "IDs de usuarios, título, mensaje y tipo son requeridos",
      });
    }

    const createdNotifications = [];

    userIds.forEach((userId) => {
      const newNotification = {
        id: notifications.length + 1,
        userId: parseInt(userId),
        title,
        message,
        type,
        priority,
        read: false,
        createdAt: new Date(),
        relatedId: relatedId || null,
        relatedType: relatedType || null,
      };

      notifications.push(newNotification);
      createdNotifications.push(newNotification);
    });

    res.status(201).json({
      message: `Notificación enviada a ${createdNotifications.length} usuarios`,
      notifications: createdNotifications,
    });
  } catch (error) {
    console.error("Error enviando notificación masiva:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/notifications/stats - Estadísticas de notificaciones
router.get("/stats/summary", authenticateToken, (req, res) => {
  try {
    const userNotifications = notifications.filter(
      (n) => n.userId === req.user.id
    );

    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter((n) => !n.read).length,
      read: userNotifications.filter((n) => n.read).length,
      byType: userNotifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {}),
      byPriority: userNotifications.reduce((acc, n) => {
        acc[n.priority] = (acc[n.priority] || 0) + 1;
        return acc;
      }, {}),
      recent: userNotifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error obteniendo estadísticas de notificaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/notifications/cleanup - Limpiar notificaciones antiguas (admin)
router.delete("/cleanup", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden limpiar notificaciones",
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const initialCount = notifications.length;
    notifications = notifications.filter(
      (n) => new Date(n.createdAt) > thirtyDaysAgo || !n.read
    );

    const deletedCount = initialCount - notifications.length;

    res.json({
      message: `Limpieza completada. ${deletedCount} notificaciones antiguas eliminadas`,
      deleted: deletedCount,
      remaining: notifications.length,
    });
  } catch (error) {
    console.error("Error limpiando notificaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
