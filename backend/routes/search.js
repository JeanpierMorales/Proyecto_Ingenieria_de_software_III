import express from "express";
const router = express.Router();
import { authenticateToken } from "./auth.js";

// Mock data for search (combining data from different modules)
const searchData = {
  projects: [
    {
      id: 1,
      name: "Proyecto Alpha",
      description: "Proyecto de desarrollo de software",
      type: "project",
    },
    {
      id: 2,
      name: "Proyecto Beta",
      description: "Proyecto de marketing digital",
      type: "project",
    },
  ],
  users: [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      type: "user",
    },
    {
      id: 2,
      name: "Manager User",
      email: "manager@example.com",
      role: "manager",
      type: "user",
    },
  ],
  inventory: [
    {
      id: 1,
      name: "Laptop Dell XPS 13",
      category: "Hardware",
      type: "inventory",
    },
    { id: 2, name: 'Monitor 27" 4K', category: "Hardware", type: "inventory" },
  ],
  purchaseOrders: [
    {
      id: 1,
      number: "PO-2024-001",
      supplier: "Tech Solutions Inc.",
      type: "purchase_order",
    },
    {
      id: 2,
      number: "PO-2024-002",
      supplier: "Design Studio Pro",
      type: "purchase_order",
    },
  ],
};

// GET /api/search - Búsqueda global
router.get("/", authenticateToken, (req, res) => {
  try {
    const { q: query, type, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        message: "La consulta de búsqueda debe tener al menos 2 caracteres",
      });
    }

    const searchTerm = query.toLowerCase().trim();
    let results = [];

    // Función auxiliar para buscar en un array
    const searchInArray = (array, fields) => {
      return array.filter((item) => {
        return fields.some((field) => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchTerm);
        });
      });
    };

    // Buscar en proyectos
    if (!type || type === "projects") {
      const projectResults = searchInArray(searchData.projects, [
        "name",
        "description",
      ]);
      results.push(...projectResults);
    }

    // Buscar en usuarios (solo admin puede buscar usuarios)
    if ((!type || type === "users") && req.user.role === "admin") {
      const userResults = searchInArray(searchData.users, ["name", "email"]);
      results.push(...userResults);
    }

    // Buscar en inventario
    if (!type || type === "inventory") {
      const inventoryResults = searchInArray(searchData.inventory, [
        "name",
        "category",
      ]);
      results.push(...inventoryResults);
    }

    // Buscar en órdenes de compra
    if (!type || type === "purchase_orders") {
      const poResults = searchInArray(searchData.purchaseOrders, [
        "number",
        "supplier",
      ]);
      results.push(...poResults);
    }

    // Limitar resultados
    results = results.slice(0, parseInt(limit));

    // Agrupar por tipo
    const groupedResults = results.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    res.json({
      query: searchTerm,
      total: results.length,
      results: groupedResults,
      types: Object.keys(groupedResults),
    });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/search/suggestions - Sugerencias de búsqueda
router.get("/suggestions", authenticateToken, (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || query.trim().length < 1) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = query.toLowerCase().trim();
    const suggestions = new Set();

    // Recopilar sugerencias de diferentes fuentes
    const allData = [
      ...searchData.projects.map((p) => ({ text: p.name, type: "project" })),
      ...searchData.projects.map((p) => ({
        text: p.description,
        type: "project",
      })),
      ...searchData.inventory.map((i) => ({ text: i.name, type: "inventory" })),
      ...searchData.inventory.map((i) => ({
        text: i.category,
        type: "inventory",
      })),
      ...searchData.purchaseOrders.map((po) => ({
        text: po.supplier,
        type: "purchase_order",
      })),
    ];

    // Filtrar sugerencias que empiecen con el término de búsqueda
    allData.forEach((item) => {
      if (
        item.text.toLowerCase().startsWith(searchTerm) &&
        item.text.toLowerCase() !== searchTerm
      ) {
        suggestions.add(item.text);
      }
    });

    // Convertir a array y limitar
    const suggestionArray = Array.from(suggestions).slice(0, parseInt(limit));

    res.json({
      query: searchTerm,
      suggestions: suggestionArray,
    });
  } catch (error) {
    console.error("Error obteniendo sugerencias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/search/advanced - Búsqueda avanzada
router.get("/advanced", authenticateToken, (req, res) => {
  try {
    const {
      query,
      type,
      category,
      status,
      dateFrom,
      dateTo,
      sortBy = "relevance",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    let results = [];
    const searchTerm = query ? query.toLowerCase().trim() : "";

    // Aplicar filtros según tipo
    if (!type || type === "projects") {
      let projectResults = [...searchData.projects];

      if (searchTerm) {
        projectResults = projectResults.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
      }

      results.push(
        ...projectResults.map((p) => ({ ...p, relevance: searchTerm ? 1 : 0 }))
      );
    }

    if (!type || type === "inventory") {
      let inventoryResults = [...searchData.inventory];

      if (searchTerm) {
        inventoryResults = inventoryResults.filter(
          (i) =>
            i.name.toLowerCase().includes(searchTerm) ||
            i.category.toLowerCase().includes(searchTerm)
        );
      }

      if (category) {
        inventoryResults = inventoryResults.filter(
          (i) => i.category === category
        );
      }

      results.push(
        ...inventoryResults.map((i) => ({
          ...i,
          relevance: searchTerm ? 1 : 0,
        }))
      );
    }

    if (!type || type === "purchase_orders") {
      let poResults = [...searchData.purchaseOrders];

      if (searchTerm) {
        poResults = poResults.filter(
          (po) =>
            po.number.toLowerCase().includes(searchTerm) ||
            po.supplier.toLowerCase().includes(searchTerm)
        );
      }

      results.push(
        ...poResults.map((po) => ({ ...po, relevance: searchTerm ? 1 : 0 }))
      );
    }

    // Ordenar resultados
    if (sortBy === "relevance") {
      results.sort((a, b) => {
        if (sortOrder === "desc") {
          return b.relevance - a.relevance;
        }
        return a.relevance - b.relevance;
      });
    } else if (sortBy === "name") {
      results.sort((a, b) => {
        const aName = a.name || a.number || "";
        const bName = b.name || b.number || "";
        if (sortOrder === "desc") {
          return bName.localeCompare(aName);
        }
        return aName.localeCompare(bName);
      });
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = results.slice(startIndex, endIndex);

    res.json({
      query: searchTerm,
      filters: { type, category, status, dateFrom, dateTo },
      total: results.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(results.length / limit),
      results: paginatedResults,
    });
  } catch (error) {
    console.error("Error en búsqueda avanzada:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/search/filters - Obtener opciones de filtros
router.get("/filters", authenticateToken, (req, res) => {
  try {
    const filters = {
      types: ["projects", "users", "inventory", "purchase_orders"],
      categories: [...new Set(searchData.inventory.map((i) => i.category))],
      statuses: ["active", "completed", "pending", "cancelled"],
    };

    res.json(filters);
  } catch (error) {
    console.error("Error obteniendo filtros:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// GET /api/search/recent - Búsquedas recientes del usuario
router.get("/recent", authenticateToken, (req, res) => {
  try {
    // En una implementación real, esto vendría de la base de datos
    const recentSearches = [
      { query: "laptop", timestamp: new Date(), results: 3 },
      { query: "proyecto alpha", timestamp: new Date(), results: 1 },
      { query: "monitor", timestamp: new Date(), results: 2 },
    ];

    res.json({ recentSearches });
  } catch (error) {
    console.error("Error obteniendo búsquedas recientes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
