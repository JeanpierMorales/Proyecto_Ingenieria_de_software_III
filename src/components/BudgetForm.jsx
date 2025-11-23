import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { validateBudget } from "../utils/validations";
import { projectsAPI } from "../services/api";

const BudgetForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    monto: "",
    proyectoId: "",
    items: [],
  });

  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();

    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        monto: initialData.monto ? String(initialData.monto) : "",
        proyectoId: initialData.proyectoId
          ? String(initialData.proyectoId)
          : "",
        items: initialData.items
          ? initialData.items.map((it) => ({
              concepto: it.concepto || "",
              cantidad: it.cantidad || "",
              precioUnitario: it.precioUnitario || "",
              total: it.total || 0,
            }))
          : [],
      });
    }
  }, [initialData]);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      if (response && response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { concepto: "", cantidad: "", precioUnitario: "", total: 0 },
      ],
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = formData.items.map((it, i) => {
      if (i !== index) return it;
      const updated = { ...it, [field]: value };
      const cantidad = Number.parseFloat(updated.cantidad) || 0;
      const precio = Number.parseFloat(updated.precioUnitario) || 0;
      updated.total = cantidad * precio;
      return updated;
    });

    const totalMonto = updatedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      monto: totalMonto.toString(),
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const totalMonto = updatedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      monto: totalMonto.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validation = validateBudget(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const budgetData = {
        ...formData,
        monto: Number.parseFloat(formData.monto) || 0,
        proyectoId: formData.proyectoId
          ? Number.parseInt(formData.proyectoId, 10)
          : null,
        items: formData.items.map((it) => ({
          ...it,
          cantidad: Number.parseFloat(it.cantidad) || 0,
          precioUnitario: Number.parseFloat(it.precioUnitario) || 0,
          total: Number.parseFloat(it.total) || 0,
        })),
      };

      await onSubmit(budgetData);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {initialData ? "Editar Presupuesto" : "Nuevo Presupuesto"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Nombre del presupuesto"
          />
          {errors.nombre && (
            <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Descripción (opcional)"
            rows={3}
          />
          {errors.descripcion && (
            <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proyecto
            </label>
            <select
              name="proyectoId"
              value={formData.proyectoId}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">-- Seleccione un proyecto --</option>
              {projects.map((p) => (
                <option
                  key={p.id ?? p._id ?? p.value}
                  value={String(p.id ?? p._id ?? p.value)}
                >
                  {p.nombre ?? p.name ?? `Proyecto ${p.id ?? p._id ?? ""}`}
                </option>
              ))}
            </select>
            {errors.proyectoId && (
              <p className="text-red-600 text-sm mt-1">{errors.proyectoId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto total
            </label>
            <input
              name="monto"
              value={formData.monto}
              readOnly
              className="mt-1 block w-full border rounded p-2 bg-gray-50"
            />
            {errors.monto && (
              <p className="text-red-600 text-sm mt-1">{errors.monto}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium">Items</h4>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center text-sm text-blue-600"
            >
              <Plus size={16} className="mr-1" /> Añadir item
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {formData.items.length === 0 && (
              <p className="text-sm text-gray-500">No hay items agregados.</p>
            )}

            {formData.items.map((item, idx) => (
              <div
                key={idx}
                className="border rounded p-3 grid grid-cols-6 gap-2 items-end"
              >
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Concepto</label>
                  <input
                    value={item.concepto}
                    onChange={(e) =>
                      updateItem(idx, "concepto", e.target.value)
                    }
                    className="mt-1 block w-full border rounded p-1"
                    placeholder="Concepto"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Cantidad</label>
                  <input
                    type="number"
                    step="any"
                    value={item.cantidad}
                    onChange={(e) =>
                      updateItem(idx, "cantidad", e.target.value)
                    }
                    className="mt-1 block w-full border rounded p-1"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Precio unitario
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={item.precioUnitario}
                    onChange={(e) =>
                      updateItem(idx, "precioUnitario", e.target.value)
                    }
                    className="mt-1 block w-full border rounded p-1"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Total</label>
                  <input
                    value={String(item.total ?? 0)}
                    readOnly
                    className="mt-1 block w-full border rounded p-1 bg-gray-50"
                  />
                </div>

                <div className="flex items-center justify-end col-span-1">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-red-600"
                  >
                    <X />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border bg-white text-gray-700"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};

BudgetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default BudgetForm;
