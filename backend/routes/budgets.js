const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/budgets
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM budgets");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ success: false, message: "Error fetching budgets" });
  }
});

// GET /api/budgets/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM budgets WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Budget not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ success: false, message: "Error fetching budget" });
  }
});

// POST /api/budgets
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      monto,
      proyectoId,
      estado,
      fechaCreacion,
      items,
    } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO budgets (nombre, descripcion, monto, proyectoId, estado, fechaCreacion, items) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        descripcion,
        monto,
        proyectoId,
        estado || "borrador",
        fechaCreacion || new Date().toISOString().split("T")[0],
        JSON.stringify(items),
      ]
    );
    const [newBudget] = await pool.execute(
      "SELECT * FROM budgets WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newBudget[0] });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ success: false, message: "Error creating budget" });
  }
});

// PUT /api/budgets/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      monto,
      proyectoId,
      estado,
      fechaCreacion,
      items,
    } = req.body;
    await pool.execute(
      "UPDATE budgets SET nombre = ?, descripcion = ?, monto = ?, proyectoId = ?, estado = ?, fechaCreacion = ?, items = ? WHERE id = ?",
      [
        nombre,
        descripcion,
        monto,
        proyectoId,
        estado,
        fechaCreacion,
        JSON.stringify(items),
        id,
      ]
    );
    const [updatedBudget] = await pool.execute(
      "SELECT * FROM budgets WHERE id = ?",
      [id]
    );
    if (updatedBudget.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Budget not found" });
    }
    res.json({ success: true, data: updatedBudget[0] });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ success: false, message: "Error updating budget" });
  }
});

module.exports = router;
