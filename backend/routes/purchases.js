const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/purchases
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM purchases");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching purchases" });
  }
});

// GET /api/purchases/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM purchases WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching purchase:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching purchase" });
  }
});

// POST /api/purchases
router.post("/", async (req, res) => {
  try {
    const {
      descripcion,
      categoria,
      monto,
      proyectoId,
      proveedor,
      fechaCompra,
      estado,
    } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO purchases (descripcion, categoria, monto, proyectoId, proveedor, fechaCompra, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        descripcion,
        categoria,
        monto,
        proyectoId,
        proveedor,
        fechaCompra || new Date().toISOString().split("T")[0],
        estado || "pendiente",
      ]
    );
    const [newPurchase] = await pool.execute(
      "SELECT * FROM purchases WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newPurchase[0] });
  } catch (error) {
    console.error("Error creating purchase:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating purchase" });
  }
});

// PUT /api/purchases/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      descripcion,
      categoria,
      monto,
      proyectoId,
      proveedor,
      fechaCompra,
      estado,
    } = req.body;
    await pool.execute(
      "UPDATE purchases SET descripcion = ?, categoria = ?, monto = ?, proyectoId = ?, proveedor = ?, fechaCompra = ?, estado = ? WHERE id = ?",
      [
        descripcion,
        categoria,
        monto,
        proyectoId,
        proveedor,
        fechaCompra,
        estado,
        id,
      ]
    );
    const [updatedPurchase] = await pool.execute(
      "SELECT * FROM purchases WHERE id = ?",
      [id]
    );
    if (updatedPurchase.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }
    res.json({ success: true, data: updatedPurchase[0] });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating purchase" });
  }
});

module.exports = router;
