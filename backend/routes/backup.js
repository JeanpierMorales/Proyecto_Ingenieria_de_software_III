import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";
import fs from "fs/promises";
import path from "path";

// Mock backup data
let backups = [
  {
    id: 1,
    name: "Backup Completo - Enero 2024",
    type: "full",
    status: "completed",
    size: "2.5GB",
    createdAt: new Date(),
    completedAt: new Date(),
    createdBy: 1,
    path: "/backups/backup-2024-01-full.zip",
  },
  {
    id: 2,
    name: "Backup Incremental - Semana 4",
    type: "incremental",
    status: "completed",
    size: "500MB",
    createdAt: new Date(),
    completedAt: new Date(),
    createdBy: 1,
    path: "/backups/backup-2024-01-inc.zip",
  },
];

// GET /api/backup - Obtener todos los backups
router.get("/", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden ver backups" });
    }

    const { type, status, page = 1, limit = 10 } = req.query;

    let filteredBackups = [...backups];

    // Filtrar por tipo
    if (type) {
      filteredBackups = filteredBackups.filter((b) => b.type === type);
    }

    // Filtrar por estado
    if (status) {
      filteredBackups = filteredBackups.filter((b) => b.status === status);
    }

    // Ordenar por fecha descendente
    filteredBackups.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBackups = filteredBackups.slice(startIndex, endIndex);

    res.json({
      backups: paginatedBackups,
      total: filteredBackups.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredBackups.length / limit),
    });
  } catch (error) {
    console.error("Error obteniendo backups:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/backup/:id - Obtener backup específico
router.get("/:id", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden ver backups" });
    }

    const backup = backups.find((b) => b.id === parseInt(req.params.id));
    if (!backup) {
      return res.status(404).json({ message: "Backup no encontrado" });
    }

    res.json(backup);
  } catch (error) {
    console.error("Error obteniendo backup:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/backup/create - Crear nuevo backup
router.post("/create", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden crear backups" });
    }

    const { name, type = "full" } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Nombre del backup es requerido" });
    }

    if (!["full", "incremental", "differential"].includes(type)) {
      return res.status(400).json({ message: "Tipo de backup inválido" });
    }

    const newBackup = {
      id: backups.length + 1,
      name,
      type,
      status: "in_progress",
      size: null,
      createdAt: new Date(),
      completedAt: null,
      createdBy: req.user.id,
      path: null,
    };

    backups.push(newBackup);

    // Simular proceso de backup (completar en 5 segundos)
    setTimeout(() => {
      const backup = backups.find((b) => b.id === newBackup.id);
      if (backup) {
        backup.status = "completed";
        backup.size = type === "full" ? "2.1GB" : "450MB";
        backup.completedAt = new Date();
        backup.path = `/backups/backup-${new Date().getTime()}-${type}.zip`;
      }
    }, 5000);

    res.status(201).json({
      message: "Backup iniciado exitosamente",
      backup: newBackup,
    });
  } catch (error) {
    console.error("Error creando backup:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/backup/:id/download - Descargar backup
router.get("/:id/download", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden descargar backups" });
    }

    const backup = backups.find((b) => b.id === parseInt(req.params.id));
    if (!backup) {
      return res.status(404).json({ message: "Backup no encontrado" });
    }

    if (backup.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Backup no está listo para descargar" });
    }

    // Simular descarga (en producción sería un archivo real)
    const fileName = `backup-${backup.id}-${backup.type}.zip`;
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Enviar contenido simulado
    res.send(Buffer.from("Simulated backup file content"));
  } catch (error) {
    console.error("Error descargando backup:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/backup/:id - Eliminar backup
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden eliminar backups" });
    }

    const backupIndex = backups.findIndex(
      (b) => b.id === parseInt(req.params.id)
    );
    if (backupIndex === -1) {
      return res.status(404).json({ message: "Backup no encontrado" });
    }

    const backup = backups[backupIndex];

    // Eliminar archivo físico si existe
    if (backup.path) {
      try {
        const filePath = path.join(
          __dirname,
          "../backups",
          path.basename(backup.path)
        );
        await fs.unlink(filePath);
      } catch (error) {
        console.warn("Error eliminando archivo de backup físico:", error);
      }
    }

    backups.splice(backupIndex, 1);

    res.json({ message: "Backup eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando backup:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/backup/:id/restore - Restaurar desde backup
router.post("/:id/restore", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden restaurar backups" });
    }

    const backup = backups.find((b) => b.id === parseInt(req.params.id));
    if (!backup) {
      return res.status(404).json({ message: "Backup no encontrado" });
    }

    if (backup.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Backup no está listo para restaurar" });
    }

    // Simular proceso de restauración
    const restoreOperation = {
      id: Date.now(),
      backupId: backup.id,
      status: "in_progress",
      startedAt: new Date(),
      estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
    };

    // Simular completación en 10 segundos
    setTimeout(() => {
      console.log(`Restauración desde backup ${backup.id} completada`);
    }, 10000);

    res.json({
      message: "Restauración iniciada exitosamente",
      operation: restoreOperation,
    });
  } catch (error) {
    console.error("Error restaurando backup:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/backup/stats - Estadísticas de backups
router.get("/stats/summary", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden ver estadísticas de backups",
      });
    }

    const stats = {
      totalBackups: backups.length,
      completedBackups: backups.filter((b) => b.status === "completed").length,
      failedBackups: backups.filter((b) => b.status === "failed").length,
      inProgressBackups: backups.filter((b) => b.status === "in_progress")
        .length,
      totalSize: "5.4GB", // Simulado
      lastBackup: backups
        .filter((b) => b.status === "completed")
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0],
      backupsByType: backups.reduce((acc, backup) => {
        acc[backup.type] = (acc[backup.type] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error obteniendo estadísticas de backups:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
