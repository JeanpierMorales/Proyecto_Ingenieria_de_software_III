import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido"));
    }
  },
});

// Mock files data
let files = [
  {
    id: 1,
    filename: "contrato-proyecto-alpha.pdf",
    originalName: "contrato.pdf",
    mimetype: "application/pdf",
    size: 245760,
    path: "/uploads/contrato-proyecto-alpha.pdf",
    projectId: 1,
    uploadedBy: 1,
    uploadedAt: new Date(),
  },
  {
    id: 2,
    filename: "presupuesto-beta.xlsx",
    originalName: "presupuesto.xlsx",
    mimetype:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 153600,
    path: "/uploads/presupuesto-beta.xlsx",
    projectId: 2,
    uploadedBy: 2,
    uploadedAt: new Date(),
  },
];

// GET /api/files - Obtener todos los archivos
router.get("/", authenticateToken, (req, res) => {
  try {
    const { projectId, uploadedBy, page = 1, limit = 10 } = req.query;

    let filteredFiles = [...files];

    // Filtrar por proyecto
    if (projectId) {
      filteredFiles = filteredFiles.filter(
        (f) => f.projectId === Number.parseInt(projectId)
      );
    }

    // Filtrar por usuario que subió
    if (uploadedBy) {
      filteredFiles = filteredFiles.filter(
        (f) => f.uploadedBy === Number.parseInt(uploadedBy)
      );
    }

    // Paginación
    const startIndex = (page - 1) * Number.parseInt(limit);
    const endIndex = startIndex + Number.parseInt(limit);
    const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

    res.json({
      files: paginatedFiles,
      total: filteredFiles.length,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(filteredFiles.length / Number.parseInt(limit)),
    });
  } catch (error) {
    console.error("Error obteniendo archivos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/files/:id - Obtener archivo por ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const file = files.find((f) => f.id === Number.parseInt(req.params.id, 10));
    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    res.json(file);
  } catch (error) {
    console.error("Error obteniendo archivo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/files/upload - Subir archivo
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se ha subido ningún archivo" });
      }

      const { projectId } = req.body;

      if (!projectId) {
        return res
          .status(400)
          .json({ message: "ID del proyecto es requerido" });
      }

      const newFile = {
        id: files.length + 1,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        projectId: Number.parseInt(projectId),
        uploadedBy: req.user.id,
        uploadedAt: new Date(),
      };

      files.push(newFile);

      res.status(201).json({
        message: "Archivo subido exitosamente",
        file: newFile,
      });
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

// GET /api/files/:id/download - Descargar archivo
router.get("/:id/download", authenticateToken, async (req, res) => {
  try {
    const file = files.find((f) => f.id === parseInt(req.params.id));
    if (!file) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    const filePath = path.join(__dirname, "../uploads", file.filename);

    // Verificar si el archivo existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Archivo no encontrado en el servidor" });
    }

    res.download(filePath, file.originalName);
  } catch (error) {
    console.error("Error descargando archivo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/files/:id - Eliminar archivo
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const fileIndex = files.findIndex(
      (f) => f.id === Number.parseInt(req.params.id)
    );
    if (fileIndex === -1) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    const file = files[fileIndex];

    // Solo el usuario que subió o admin pueden eliminar
    if (file.uploadedBy !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar este archivo" });
    }

    // Eliminar archivo del sistema de archivos
    const filePath = path.join(__dirname, "../uploads", file.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn("Error eliminando archivo físico:", error);
    }

    files.splice(fileIndex, 1);

    res.json({ message: "Archivo eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando archivo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/files/project/:projectId - Obtener archivos de un proyecto
router.get("/project/:projectId", authenticateToken, (req, res) => {
  try {
    projectFiles = files.filter(
      (f) => f.projectId === Number.parseInt(req.params.projectId)
    );
    res.json(projectFiles);
  } catch (error) {
    console.error("Error obteniendo archivos del proyecto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
