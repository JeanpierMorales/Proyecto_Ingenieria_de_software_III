import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { validateBudget } from '../utils/validations';
import { projectsAPI } from '../services/api';

const BudgetForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    monto: '',
    proyectoId: '',
    items: []
  });
  
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
    
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        monto: initialData.monto || '',
        proyectoId: initialData.proyectoId || '',
        items: initialData.items || []
      });
    }
  }, [initialData]);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { concepto: '', cantidad: '', precioUnitario: '', total: 0 }]
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    // Calcular total automáticamente
    if (field === 'cantidad' || field === 'precioUnitario') {
      const cantidad = parseFloat(updatedItems[index].cantidad) || 0;
      const precio = parseFloat(updatedItems[index].precioUnitario) || 0;
      updatedItems[index].total = cantidad * precio;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    // Recalcular monto total
    const totalMonto = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    setFormData(prev => ({
      ...prev,
      monto: totalMonto.toString()
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    // Recalcular monto total
    const totalMonto = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    setFormData(prev => ({
      ...prev,
      monto: totalMonto.toString()
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
        monto: parseFloat(formData.monto),
        proyectoId: parseInt(formData.proyectoId)
      };
      
      await onSubmit(budgetData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {initialData ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Presupuesto *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Presupuesto Fase 1"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="proyectoId" className="block text-sm font-medium text-gray-700 mb-2">
              Proyecto *
            </label>
            <select
              id="proyectoId"
              name="proyectoId"
              value={formData.proyectoId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.proyectoId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar proyecto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.nombre}
                </option>
              ))}
            </select>
            {errors.proyectoId && (
              <p className="mt-1 text-sm text-red-600">{errors.proyectoId}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción del presupuesto..."
          />
        </div>

        {/* Items del presupuesto */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">Items del Presupuesto</h4>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Item
            </button>
          </div>
          
          {formData.items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Concepto
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Cantidad
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Precio Unitario
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Total
                    </th>
                    <th className="border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 px-3 py-2">
                        <input
                          type="text"
                          value={item.concepto}
                          onChange={(e) => updateItem(index, 'concepto', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Concepto del item"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-2">
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => updateItem(index, 'cantidad', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="0"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-2">
                        <input
                          type="number"
                          value={item.precioUnitario}
                          onChange={(e) => updateItem(index, 'precioUnitario', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-right">
                        ${item.total?.toLocaleString() || '0'}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
            Monto Total *
          </label>
          <input
            type="number"
            id="monto"
            name="monto"
            value={formData.monto}
            onChange={handleInputChange}
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.monto ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            readOnly={formData.items.length > 0}
          />
          {errors.monto && (
            <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Presupuesto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;