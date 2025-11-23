import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock inventory data
let inventory = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    category: "Hardware",
    description: "Laptop para desarrollo",
    quantity: 5,
    minQuantity: 2,
    unitCost: 1200,
    totalValue: 6000,
    location: "Oficina Principal",
    supplier: "Dell Inc.",
    lastUpdated: new Date(),
    status: "available",
  },
  {
    id: 2,
    name: 'Monitor 27" 4K',
    category: "Hardware",
    description: "Monitor para diseño",
    quantity: 3,
    minQuantity: 1,
    unitCost: 400,
    totalValue: 1200,
    location: "Sala de Diseño",
    supplier: "LG Electronics",
    lastUpdated: new Date(),
    status: "available",
  },
  {
    id: 3,
    name: "Licencia Adobe Creative Suite",
    category: "Software",
    description: "Suite de diseño gráfico",
    quantity: 10,
    minQuantity: 5,
    unitCost: 50,
    totalValue: 500,
    location: "Digital",
    supplier: "Adobe Inc.",
    lastUpdated: new Date(),
    status: "available",
  },
];

// GET /api/inventory - Obtener todo el inventario
router.get("/", authenticateToken, (req, res) => {
  try {
    const {
      category,
      status,
      location,
      lowStock,
      page = 1,
      limit = 10,
    } = req.query;

    let filteredInventory = [...inventory];

    // Filtrar por categoría
    if (category) {
      filteredInventory = filteredInventory.filter(
        (item) => item.category === category
      );
    }

    // Filtrar por estado
    if (status) {
      filteredInventory = filteredInventory.filter(
        (item) => item.status === status
      );
    }

    // Filtrar por ubicación
    if (location) {
      filteredInventory = filteredInventory.filter((item) =>
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filtrar items con stock bajo
    if (lowStock === "true") {
      filteredInventory = filteredInventory.filter(
        (item) => item.quantity <= item.minQuantity
      );
    }

    // Ordenar por nombre
    filteredInventory.sort((a, b) => a.name.localeCompare(b.name));

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number.parseInt(limit);
    const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

    res.json({
      inventory: paginatedInventory,
      total: filteredInventory.length,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(filteredInventory.length / limit),
    });
  } catch (error) {
    console.error("Error obteniendo inventario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/inventory/:id - Obtener item por ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const item = inventory.find((i) => i.id === Number.parseInt(req.params.id));
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item no encontrado en inventario" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error obteniendo item:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/inventory - Agregar nuevo item
router.post("/", authenticateToken, (req, res) => {
  try {
    const {
      name,
      category,
      description,
      quantity,
      minQuantity,
      unitCost,
      location,
      supplier,
    } = req.body;

    if (
      !name ||
      !category ||
      quantity === undefined ||
      unitCost === undefined
    ) {
      return res.status(400).json({
        message: "Nombre, categoría, cantidad y costo unitario son requeridos",
      });
    }

    if (quantity < 0 || unitCost < 0) {
      return res
        .status(400)
        .json({ message: "Cantidad y costo deben ser positivos" });
    }

    const newItem = {
      id: inventory.length + 1,
      name,
      category,
      description: description || "",
      quantity: Number.parseInt(quantity),
      minQuantity: minQuantity ? Number.parseInt(minQuantity) : 1,
      unitCost: Number.parseFloat(unitCost),
      totalValue: Number.parseInt(quantity) * Number.parseFloat(unitCost),
      location: location || "General",
      supplier: supplier || "",
      lastUpdated: new Date(),
      status: Number.parseInt(quantity) > 0 ? "available" : "out_of_stock",
    };

    inventory.push(newItem);

    res.status(201).json({
      message: "Item agregado al inventario exitosamente",
      item: newItem,
    });
  } catch (error) {
    console.error("Error agregando item:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// PUT /api/inventory/:id - Actualizar item
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const item = inventory.find(
      (i) => i.id === Number.parseInt(req.params.id, 10)
    );
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item no encontrado en inventario" });
    }

    const {
      name,
      category,
      description,
      quantity,
      minQuantity,
      unitCost,
      location,
      supplier,
    } = req.body;

    function validateNonNegative(val, fieldName) {
      if (val < 0) {
        res
          .status(400)
          .json({ message: `El valor de ${fieldName} no puede ser negativo` });
        return false;
      }
      return true;
    }

    if (name) item.name = name;
    if (category) item.category = category;
    if (description !== undefined) item.description = description;

    if (quantity !== undefined) {
      if (!validateNonNegative(quantity, "cantidad")) return;
      const quantityValue = Number.parseInt(quantity, 10);
      item.quantity = quantityValue;
      item.status = quantityValue > 0 ? "available" : "out_of_stock";
    }

    if (minQuantity !== undefined) {
      if (!validateNonNegative(minQuantity, "cantidad mínima")) return;
      item.minQuantity = Number.parseInt(minQuantity, 10);
    }

    if (unitCost !== undefined) {
      if (!validateNonNegative(unitCost, "costo unitario")) return;
      item.unitCost = Number.parseFloat(unitCost);
    }

    if (location) item.location = location;
    if (supplier) item.supplier = supplier;

    item.totalValue = item.quantity * item.unitCost;
    item.lastUpdated = new Date();

    res.json({
      message: "Item actualizado exitosamente",
      item,
    });
  } catch (error) {
    console.error("Error actualizando item:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// DELETE /api/inventory/:id - Eliminar item
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const itemIndex = inventory.findIndex(
      (i) => i.id === Number.parseInt(req.params.id)
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Item no encontrado en inventario" });
    }

    // Solo admin puede eliminar items
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Solo administradores pueden eliminar items del inventario",
      });
    }

    inventory.splice(itemIndex, 1);

    res.json({ message: "Item eliminado del inventario exitosamente" });
  } catch (error) {
    console.error("Error eliminando item:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// POST /api/inventory/:id/adjust - Ajustar cantidad
router.post("/:id/adjust", authenticateToken, (req, res) => {
  try {
    const item = inventory.find((i) => i.id === Number.parseInt(req.params.id));
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item no encontrado en inventario" });
    }

    const { adjustment, reason } = req.body;

    if (adjustment === undefined || !reason) {
      return res.status(400).json({ message: "Ajuste y razón son requeridos" });
    }

    const newQuantity = item.quantity + Number.parseInt(adjustment);

    if (newQuantity < 0) {
      return res
        .status(400)
        .json({ message: "La cantidad resultante no puede ser negativa" });
    }

    item.quantity = newQuantity;
    item.totalValue = newQuantity * item.unitCost;
    item.status = newQuantity > 0 ? "available" : "out_of_stock";
    item.lastUpdated = new Date();

    res.json({
      message: "Cantidad ajustada exitosamente",
      item,
      adjustment: Number.parseInt(adjustment),
      reason,
    });
  } catch (error) {
    console.error("Error ajustando cantidad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/inventory/categories - Obtener categorías
router.get("/categories/list", authenticateToken, (req, res) => {
  try {
    const categories = [...new Set(inventory.map((item) => item.category))];
    res.json({ categories });
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/inventory/low-stock - Obtener items con stock bajo
router.get("/alerts/low-stock", authenticateToken, (req, res) => {
  try {
    const lowStockItems = inventory.filter(
      (item) => item.quantity <= item.minQuantity
    );
    res.json({
      lowStockItems,
      count: lowStockItems.length,
    });
  } catch (error) {
    console.error("Error obteniendo items con stock bajo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/inventory/stats - Estadísticas del inventario
router.get("/stats/summary", authenticateToken, (req, res) => {
  try {
    const stats = {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockItems: inventory.filter(
        (item) => item.quantity <= item.minQuantity
      ).length,
      outOfStockItems: inventory.filter((item) => item.quantity === 0).length,
      categoriesCount: new Set(inventory.map((item) => item.category)).size,
      itemsByCategory: inventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {}),
      topValueItems: inventory
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
