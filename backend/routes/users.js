import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock users data (complementario al de auth.js)
let users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    department: "IT",
    active: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 2,
    name: "Manager User",
    email: "manager@example.com",
    role: "manager",
    department: "Operations",
    active: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 3,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    department: "Development",
    active: true,
    createdAt: new Date(),
    lastLogin: null,
  },
];

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get("/", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden ver todos los usuarios",
      });
    }

    const { role, department, active, page = 1, limit = 10 } = req.query;

    let filteredUsers = [...users];

    // Filtrar por rol
    if (role) {
      filteredUsers = filteredUsers.filter((u) => u.role === role);
    }

    // Filtrar por departamento
    if (department) {
      filteredUsers = filteredUsers.filter((u) => u.department === department);
    }

    // Filtrar por estado activo
    if (active !== undefined) {
      filteredUsers = filteredUsers.filter(
        (u) => u.active === (active === "true")
      );
    }

    // Paginación
    const startIndex = (page - 1) * Number.parseInt(limit, 10);
    const endIndex = startIndex + Number.parseInt(limit, 10);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      users: paginatedUsers,
      total: filteredUsers.length,
      page: Number.parseInt(page, 10),
      limit: Number.parseInt(limit, 10),
      totalPages: Math.ceil(filteredUsers.length / Number.parseInt(limit, 10)),
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === Number.parseInt(req.params.id, 10));
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Solo el propio usuario o admin pueden ver detalles completos
    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver este usuario" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/users - Crear nuevo usuario (solo admin)
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden crear usuarios" });
    }

    const { name, email, password, role = "user", department } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nombre, email y contraseña son requeridos" });
    }

    // Verificar si usuario ya existe
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      role,
      department: department || "General",
      active: true,
      createdAt: new Date(),
      lastLogin: null,
    };

    users.push(newUser);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      },
    });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === Number.parseInt(req.params.id, 10));
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Solo el propio usuario o admin pueden actualizar
    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para actualizar este usuario" });
    }

    const { name, email, role, department, active } = req.body;

    // Solo admin puede cambiar rol y estado activo
    if (req.user.role === "admin") {
      if (role) user.role = role;
      if (active !== undefined) user.active = active;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (department) user.department = department;

    res.json({
      message: "Usuario actualizado exitosamente",
      user,
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/users/:id - Desactivar usuario (solo admin)
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo administradores pueden eliminar usuarios" });
    }

    const user = users.find((u) => u.id === Number.parseInt(req.params.id, 10));
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.active = false;

    res.json({ message: "Usuario desactivado exitosamente" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/users/profile/me - Obtener perfil propio
router.get("/profile/me", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/users/profile/me - Actualizar perfil propio
router.put("/profile/me", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { name, email, department } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (department) user.department = department;

    res.json({
      message: "Perfil actualizado exitosamente",
      user,
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
