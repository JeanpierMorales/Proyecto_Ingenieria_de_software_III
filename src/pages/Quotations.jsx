import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Search, FileText, Calendar } from 'lucide-react';
import { quotationsAPI } from '../services/api';

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      const response = await quotationsAPI.getQuotations();
      if (response.success) {
        setQuotations(response.data);
      }
    } catch (error) {
      console.error('Error al cargar cotizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado) => {
    const colors = {
      'borrador': 'bg-gray-100 text-gray-800',
      'enviada': 'bg-blue-100 text-blue-800',
      'aprobada': 'bg-green-100 text-green-800',
      'rechazada': 'bg-red-100 text-red-800',
      'vencida': 'bg-yellow-100 text-yellow-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (estado) => {
    const texts = {
      'borrador': 'Borrador',
      'enviada': 'Enviada',
      'aprobada': 'Aprobada',
      'rechazada': 'Rechazada',
      'vencida': 'Vencida'
    };
    return texts[estado] || estado;
  };

  const filteredQuotations = quotations.filter(quotation =>
    quotation.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.proyecto.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra cotizaciones y propuestas para clientes
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cotización
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Receipt className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{quotations.length}</div>
              <div className="text-sm text-gray-600">Total Cotizaciones</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {quotations.filter(q => q.estado === 'aprobada').length}
              </div>
              <div className="text-sm text-gray-600">Aprobadas</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {quotations.filter(q => q.estado === 'enviada').length}
              </div>
              <div className="text-sm text-gray-600">Enviadas</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${quotations.reduce((sum, q) => sum + q.monto, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cotizaciones por número, cliente o proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de cotizaciones */}
      {filteredQuotations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Receipt className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron cotizaciones' : 'No hay cotizaciones registradas'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Comienza creando tu primera cotización'
            }
          </p>
          {!searchTerm && (
            <button className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Cotización
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vigencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quotation.numero}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quotation.cliente}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quotation.proyecto}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${quotation.monto.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(quotation.fechaCreacion).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(quotation.vigencia).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quotation.estado)}`}>
                        {getStatusText(quotation.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          Ver
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors">
                          Editar
                        </button>
                        <button className="text-green-600 hover:text-green-900 transition-colors">
                          Enviar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotations;