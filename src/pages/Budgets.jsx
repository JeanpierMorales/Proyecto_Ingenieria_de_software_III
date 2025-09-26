import React, { useState, useEffect } from "react";
import { Plus, Search, DollarSign, Calendar, FileText } from "lucide-react";
import BudgetForm from "../components/BudgetForm";
import BudgetDetailModal from "../components/BudgetDetailModal";
import { budgetsAPI } from "../services/api";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const response = await budgetsAPI.getBudgets();
      if (response.success) {
        setBudgets(response.data);
      }
    } catch (error) {
      console.error("Error al cargar presupuestos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (budgetData) => {
    try {
      const response = await budgetsAPI.createBudget(budgetData);
      if (response.success) {
        setBudgets((prev) => [...prev, response.data]);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error al crear presupuesto:", error);
    }
  };

  const getStatusColor = (estado) => {
    const colors = {
      borrador: "bg-gray-100 text-gray-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      aprobado: "bg-green-100 text-green-800",
      rechazado: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (estado) => {
    const texts = {
      borrador: "Borrador",
      pendiente: "Pendiente",
      aprobado: "Aprobado",
      rechazado: "Rechazado",
    };
    return texts[estado] || estado;
  };

  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Presupuestos
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Crea y administra presupuestos para tus proyectos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Presupuesto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar presupuestos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <BudgetForm
              onSubmit={handleCreateBudget}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Lista de presupuestos */}
      {filteredBudgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm
              ? "No se encontraron presupuestos"
              : "No hay presupuestos"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza creando tu primer presupuesto"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Presupuesto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {budget.nombre}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    budget.estado
                  )}`}
                >
                  {getStatusText(budget.estado)}
                </span>
              </div>

              {budget.descripcion && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {budget.descripcion}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Monto: ${budget.monto?.toLocaleString()}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    Creado:{" "}
                    {new Date(budget.fechaCreacion).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Items del presupuesto */}
              {budget.items && budget.items.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Items ({budget.items.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {budget.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-xs text-gray-600"
                      >
                        <span className="truncate">{item.concepto}</span>
                        <span>${item.total?.toLocaleString()}</span>
                      </div>
                    ))}
                    {budget.items.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{budget.items.length - 3} items más...
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Ver Detalles
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Presupuestos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {budgets.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {budgets.filter((b) => b.estado === "aprobado").length}
            </div>
            <div className="text-sm text-gray-600">Aprobados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {budgets.filter((b) => b.estado === "pendiente").length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              $
              {budgets
                .reduce((sum, b) => sum + (b.monto || 0), 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
