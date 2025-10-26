const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM users");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

// POST /api/users
router.post("/", async (req, res) => {
  try {
    const { nombre, email, rol, activo, fechaRegistro } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO users (nombre, email, rol, activo, fechaRegistro) VALUES (?, ?, ?, ?, ?)",
      [
        nombre,
        email,
        rol,
        activo !== undefined ? activo : true,
        fechaRegistro || new Date().toISOString().split("T")[0],
      ]
    );
    const [newUser] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json({ success: true, data: newUser[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
});

module.exports = router;
