import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs/promises";

// Importar rutas
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import budgetRoutes from "./routes/budgets.js";
import quotationRoutes from "./routes/quotations.js";
import userRoutes from "./routes/users.js";
import reportRoutes from "./routes/reports.js";
import fileRoutes from "./routes/files.js";
import auditRoutes from "./routes/audit.js";
import backupRoutes from "./routes/backup.js";
import analyticsRoutes from "./routes/analytics.js";
import purchaseOrderRoutes from "./routes/purchase-orders.js";
import paymentRoutes from "./routes/payments.js";
import inventoryRoutes from "./routes/inventory.js";
import notificationRoutes from "./routes/notifications.js";
import searchRoutes from "./routes/search.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Demasiadas solicitudes desde esta IP, por favor intenta más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://tu-dominio.com"
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Static files
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);

// API root
app.get("/api", (req, res) => {
  res.json({
    message: "API de Gestión de Proyectos",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      projects: "/api/projects",
      budgets: "/api/budgets",
      quotations: "/api/quotations",
      users: "/api/users",
      reports: "/api/reports",
      files: "/api/files",
      audit: "/api/audit",
      backup: "/api/backup",
      analytics: "/api/analytics",
      "purchase-orders": "/api/purchase-orders",
      payments: "/api/payments",
      inventory: "/api/inventory",
      notifications: "/api/notifications",
      search: "/api/search",
    },
  });
});

// Dashboard endpoint
app.get("/api/dashboard/stats", (req, res) => {
  res.json({
    totalProjects: 25,
    activeProjects: 18,
    totalBudget: 2500000,
    completedProjects: 7,
    pendingTasks: 12,
    recentActivity: [
      {
        id: 1,
        type: "project_created",
        message: "Nuevo proyecto creado",
        timestamp: new Date(),
      },
      {
        id: 2,
        type: "budget_approved",
        message: "Presupuesto aprobado",
        timestamp: new Date(),
      },
    ],
  });
});

app.get("/api/dashboard/recent-activity", (req, res) => {
  res.json({
    activities: [
      {
        id: 1,
        type: "project",
        action: "created",
        description: "Proyecto Alpha creado",
        user: "Admin",
        timestamp: new Date(),
      },
      {
        id: 2,
        type: "budget",
        action: "approved",
        description: "Presupuesto aprobado para Proyecto Beta",
        user: "Manager",
        timestamp: new Date(),
      },
    ],
  });
});

// Admin routes (protegidas)
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/audit", auditRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Crear directorio de uploads si no existe
fs.mkdir(path.join(__dirname, "uploads"), { recursive: true })
  .then(() => {
    console.log("Directorio uploads creado/verificado");
  })
  .catch((err) => {
    console.error("Error creando directorio uploads:", err);
  });

// Inicializar base de datos
import db from "./db.js";
db.init()
  .then(() => {
    console.log("Base de datos inicializada");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("Error inicializando base de datos:", err);
    process.exit(1);
  });

export default app;
