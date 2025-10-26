const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/reports
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM reports");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: "Error fetching reports" });
  }
});

// GET /api/reports/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM reports WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ success: false, message: "Error fetching report" });
  }
});

// POST /api/reports
router.post("/", async (req, res) => {
  try {
    const {
      titulo,
      tipo,
      proyectoId,
      fechaCreacion,
      estado,
      progreso,
      observaciones,
    } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO reports (titulo, tipo, proyectoId, fechaCreacion, estado, progreso, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        titulo,
        tipo,
        proyectoId,
        fechaCreacion || new Date().toISOString().split("T")[0],
        estado || "borrador",
        progreso || 0,
        observaciones,
      ]
    );
    const [newReport] = await pool.execute(
      "SELECT * FROM reports WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newReport[0] });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, message: "Error creating report" });
  }
});

// PUT /api/reports/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      tipo,
      proyectoId,
      fechaCreacion,
      estado,
      progreso,
      observaciones,
    } = req.body;
    await pool.execute(
      "UPDATE reports SET titulo = ?, tipo = ?, proyectoId = ?, fechaCreacion = ?, estado = ?, progreso = ?, observaciones = ? WHERE id = ?",
      [
        titulo,
        tipo,
        proyectoId,
        fechaCreacion,
        estado,
        progreso,
        observaciones,
        id,
      ]
    );
    const [updatedReport] = await pool.execute(
      "SELECT * FROM reports WHERE id = ?",
      [id]
    );
    if (updatedReport.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, data: updatedReport[0] });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, message: "Error updating report" });
  }
});

// POST /api/reports/export
router.post("/export", async (req, res) => {
  try {
    const { format = "pdf" } = req.body;
    const [rows] = await pool.execute("SELECT * FROM reports");
    res.json({
      success: true,
      message: `Reports exported in ${format.toUpperCase()} format`,
      data: rows,
    });
  } catch (error) {
    console.error("Error exporting reports:", error);
    res
      .status(500)
      .json({ success: false, message: "Error exporting reports" });
  }
});

module.exports = router;
