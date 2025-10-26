const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/strategies
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM strategies");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching strategies:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching strategies" });
  }
});

// GET /api/strategies/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM strategies WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Strategy not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching strategy:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching strategy" });
  }
});

// POST /api/strategies
router.post("/", async (req, res) => {
  try {
    const { titulo, descripcion, tipo, prioridad, fechaCreacion, estado } =
      req.body;
    const [result] = await pool.execute(
      "INSERT INTO strategies (titulo, descripcion, tipo, prioridad, fechaCreacion, estado) VALUES (?, ?, ?, ?, ?, ?)",
      [
        titulo,
        descripcion,
        tipo,
        prioridad,
        fechaCreacion || new Date().toISOString().split("T")[0],
        estado || "planificada",
      ]
    );
    const [newStrategy] = await pool.execute(
      "SELECT * FROM strategies WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newStrategy[0] });
  } catch (error) {
    console.error("Error creating strategy:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating strategy" });
  }
});

// PUT /api/strategies/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, tipo, prioridad, fechaCreacion, estado } =
      req.body;
    await pool.execute(
      "UPDATE strategies SET titulo = ?, descripcion = ?, tipo = ?, prioridad = ?, fechaCreacion = ?, estado = ? WHERE id = ?",
      [titulo, descripcion, tipo, prioridad, fechaCreacion, estado, id]
    );
    const [updatedStrategy] = await pool.execute(
      "SELECT * FROM strategies WHERE id = ?",
      [id]
    );
    if (updatedStrategy.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Strategy not found" });
    }
    res.json({ success: true, data: updatedStrategy[0] });
  } catch (error) {
    console.error("Error updating strategy:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating strategy" });
  }
});

module.exports = router;
