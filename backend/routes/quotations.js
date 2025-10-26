const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/quotations
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM quotations");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching quotations" });
  }
});

// GET /api/quotations/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM quotations WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching quotation:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching quotation" });
  }
});

// POST /api/quotations
router.post("/", async (req, res) => {
  try {
    const {
      numero,
      cliente,
      proyecto,
      monto,
      fechaCreacion,
      vigencia,
      estado,
    } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO quotations (numero, cliente, proyecto, monto, fechaCreacion, vigencia, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        numero,
        cliente,
        proyecto,
        monto,
        fechaCreacion || new Date().toISOString().split("T")[0],
        vigencia,
        estado || "borrador",
      ]
    );
    const [newQuotation] = await pool.execute(
      "SELECT * FROM quotations WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newQuotation[0] });
  } catch (error) {
    console.error("Error creating quotation:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating quotation" });
  }
});

// PUT /api/quotations/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numero,
      cliente,
      proyecto,
      monto,
      fechaCreacion,
      vigencia,
      estado,
    } = req.body;
    await pool.execute(
      "UPDATE quotations SET numero = ?, cliente = ?, proyecto = ?, monto = ?, fechaCreacion = ?, vigencia = ?, estado = ? WHERE id = ?",
      [numero, cliente, proyecto, monto, fechaCreacion, vigencia, estado, id]
    );
    const [updatedQuotation] = await pool.execute(
      "SELECT * FROM quotations WHERE id = ?",
      [id]
    );
    if (updatedQuotation.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }
    res.json({ success: true, data: updatedQuotation[0] });
  } catch (error) {
    console.error("Error updating quotation:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating quotation" });
  }
});

// POST /api/quotations/:id/send-email
router.post("/:id/send-email", async (req, res) => {
  try {
    const { id } = req.params;
    const { to, subject } = req.body;
    const [quotation] = await pool.execute(
      "SELECT * FROM quotations WHERE id = ?",
      [id]
    );
    if (quotation.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }
    // Simulate email sending
    res.json({
      success: true,
      message: `Quotation ${quotation[0].numero} sent successfully to ${to}`,
      data: {
        quotationId: id,
        sentAt: new Date().toISOString(),
        to,
        subject: subject || `Quotation ${quotation[0].numero}`,
      },
    });
  } catch (error) {
    console.error("Error sending quotation email:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending quotation email" });
  }
});

module.exports = router;
