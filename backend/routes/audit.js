import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock audit logs data
let auditLogs = [
  {
    id: 1,
    userId: 1,
    action: "login",
    resource: "auth",
    resourceId: null,
    details: "Usuario inició sesión",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: new Date(),
    success: true,
  },
  {
    id: 2,
    userId: 1,
    action: "create",
    resource: "project",
    resourceId: 1,
    details: 'Proyecto "Proyecto Alpha" creado',
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: new Date(),
    success: true,
  },
  {
    id: 3,
    userId: 2,
    action: "approve",
    resource: "budget",
    resourceId: 1,
    details: "Presupuesto aprobado para proyecto ID: 1",
    ipAddress: "192.168.1.101",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    timestamp: new Date(),
    success: true,
  },
];

// GET /api/audit - Obtener logs de auditoría (solo admin)
router.get("/", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden ver logs de auditoría" });
    }

    const {
      userId,
      action,
      resource,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50,
    } = req.query;

    let filteredLogs = [...auditLogs];

    // Filtrar por usuario
    if (userId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.userId === Number.parseInt(userId)
      );
    }

    // Filtrar por acción
    if (action) {
      filteredLogs = filteredLogs.filter((log) => log.action === action);
    }

    // Filtrar por recurso
    if (resource) {
      filteredLogs = filteredLogs.filter((log) => log.resource === resource);
    }

    // Filtrar por fecha
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) <= toDate
      );
    }

    // Ordenar por timestamp descendente
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number.parseInt(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    res.json({
      logs: paginatedLogs,
      total: filteredLogs.length,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(filteredLogs.length / limit),
    });
  } catch (error) {
    console.error("Error obteniendo logs de auditoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/audit/:id - Obtener log específico
router.get("/:id", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden ver logs de auditoría" });
    }

    const log = auditLogs.find((l) => l.id === Number.parseInt(req.params.id));
    if (!log) {
      return res
        .status(404)
        .json({ message: "Log de auditoría no encontrado" });
    }

    res.json(log);
  } catch (error) {
    console.error("Error obteniendo log de auditoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/audit/log - Registrar nueva actividad (interno)
router.post("/log", authenticateToken, (req, res) => {
  try {
    const { action, resource, resourceId, details, success = true } = req.body;

    if (!action || !resource) {
      return res
        .status(400)
        .json({ message: "Acción y recurso son requeridos" });
    }

    const newLog = {
      id: auditLogs.length + 1,
      userId: req.user.id,
      action,
      resource,
      resourceId: resourceId || null,
      details: details || `${action} en ${resource}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent") || "Unknown",
      timestamp: new Date(),
      success,
    };

    auditLogs.push(newLog);

    res.status(201).json({
      message: "Actividad registrada en auditoría",
      log: newLog,
    });
  } catch (error) {
    console.error("Error registrando actividad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/audit/user/:userId - Obtener actividad de un usuario
router.get("/user/:userId", authenticateToken, (req, res) => {
  try {
    if (
      req.user.role !== "admin" &&
      req.user.id !== Number.parseInt(req.params.userId)
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver esta actividad" });
    }

    const userLogs = auditLogs.filter(
      (log) => log.userId === Number.parseInt(req.params.userId)
    );

    // Ordenar por timestamp descendente
    userLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(userLogs);
  } catch (error) {
    console.error("Error obteniendo actividad del usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/audit/stats - Estadísticas de auditoría
router.get("/stats/summary", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden ver estadísticas de auditoría",
      });
    }

    const stats = {
      totalLogs: auditLogs.length,
      successfulActions: auditLogs.filter((log) => log.success).length,
      failedActions: auditLogs.filter((log) => !log.success).length,
      actionsByType: auditLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {}),
      resourcesByType: auditLogs.reduce((acc, log) => {
        acc[log.resource] = (acc[log.resource] || 0) + 1;
        return acc;
      }, {}),
      recentActivity: auditLogs.slice(0, 10), // Últimas 10 actividades
    };

    res.json(stats);
  } catch (error) {
    console.error("Error obteniendo estadísticas de auditoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/audit/:id - Eliminar log (solo admin, con precaución)
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden eliminar logs de auditoría",
      });
    }

    const logIndex = auditLogs.findIndex(
      (l) => l.id === parseInt(req.params.id)
    );
    if (logIndex === -1) {
      return res
        .status(404)
        .json({ message: "Log de auditoría no encontrado" });
    }

    auditLogs.splice(logIndex, 1);

    res.json({ message: "Log de auditoría eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando log de auditoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
