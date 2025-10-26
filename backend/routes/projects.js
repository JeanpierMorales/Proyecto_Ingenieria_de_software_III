const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM projects");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching projects" });
  }
});

// POST /api/projects
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      presupuesto,
      fechaInicio,
      fechaFin,
      estado,
      clienteId,
      responsable,
    } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO projects (nombre, descripcion, presupuesto, fechaInicio, fechaFin, estado, clienteId, responsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        descripcion,
        presupuesto,
        fechaInicio,
        fechaFin,
        estado || "pendiente",
        clienteId,
        responsable,
      ]
    );
    const [newProject] = await pool.execute(
      "SELECT * FROM projects WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newProject[0] });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Error creating project" });
  }
});

// PUT /api/projects/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      presupuesto,
      fechaInicio,
      fechaFin,
      estado,
      clienteId,
      responsable,
    } = req.body;
    await pool.execute(
      "UPDATE projects SET nombre = ?, descripcion = ?, presupuesto = ?, fechaInicio = ?, fechaFin = ?, estado = ?, clienteId = ?, responsable = ? WHERE id = ?",
      [
        nombre,
        descripcion,
        presupuesto,
        fechaInicio,
        fechaFin,
        estado,
        clienteId,
        responsable,
        id,
      ]
    );
    const [updatedProject] = await pool.execute(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
    if (updatedProject.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, data: updatedProject[0] });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Error updating project" });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute("DELETE FROM projects WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Error deleting project" });
  }
});

module.exports = router;
