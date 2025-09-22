import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, TrendingUp, Lightbulb } from 'lucide-react';
import { strategiesAPI } from '../services/api';

const Strategies = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      const response = await strategiesAPI.getStrategies();
      if (response.success) {
        setStrategies(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estrategias:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (prioridad) => {
    const colors = {
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baja': 'bg-green-100 text-green-800'
    };
    return colors[prioridad] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (tipo) => {
    const colors = {
      'proceso': 'bg-blue-100 text-blue-800',
      'capacitacion': 'bg-purple-100 text-purple-800',
      'tecnologia': 'bg-indigo-100 text-indigo-800',
      'calidad': 'bg-green-100 text-green-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (estado) => {
    const colors = {
      'activa': 'bg-green-100 text-green-800',
      'planificada': 'bg-yellow-100 text-yellow-800',
      'completada': 'bg-blue-100 text-blue-800',
      'pausada': 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const filteredStrategies = strategies.filter(strategy =>
    strategy.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Estrategias de Mejora</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona y supervisa las estrategias para optimizar procesos
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Estrategia
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{strategies.length}</div>
              <div className="text-sm text-gray-600">Total Estrategias</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {strategies.filter(s => s.estado === 'activa').length}
              </div>
              <div className="text-sm text-gray-600">Activas</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {strategies.filter(s => s.estado === 'planificada').length}
              </div>
              <div className="text-sm text-gray-600">Planificadas</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {strategies.filter(s => s.prioridad === 'alta').length}
              </div>
              <div className="text-sm text-gray-600">Alta Prioridad</div>
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
            placeholder="Buscar estrategias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de estrategias */}
      {filteredStrategies.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron estrategias' : 'No hay estrategias registradas'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Comienza creando tu primera estrategia de mejora'
            }
          </p>
          {!searchTerm && (
            <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Estrategia
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStrategies.map((strategy) => (
            <div key={strategy.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {strategy.titulo}
                </h3>
                <div className="flex flex-col space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(strategy.prioridad)}`}>
                    {strategy.prioridad.charAt(0).toUpperCase() + strategy.prioridad.slice(1)} Prioridad
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strategy.estado)}`}>
                    {strategy.estado.charAt(0).toUpperCase() + strategy.estado.slice(1)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {strategy.descripcion}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(strategy.tipo)}`}>
                  {strategy.tipo}
                </span>
                
                <div className="text-sm text-gray-500">
                  {new Date(strategy.fechaCreacion).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-4">
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
    </div>
  );
};

export default Strategies;