import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Building2, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    // Validaciones básicas
    const newErrors = {};
    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.message || 'Error al iniciar sesión' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Sistema de Gestión
          </h2>
          <p className="mt-2 text-sm text-blue-200">
            Proyectos y Presupuestos
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="usuario@empresa.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 pr-10 px-3 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          {/* Cuentas de demostración */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Cuentas de demostración:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('admin@empresa.com', '123456')}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Administrador</span>
                <span className="text-xs text-gray-500 block">admin@empresa.com</span>
              </button>
              <button
                onClick={() => handleDemoLogin('analista@empresa.com', '123456')}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Analista</span>
                <span className="text-xs text-gray-500 block">analista@empresa.com</span>
              </button>
              <button
                onClick={() => handleDemoLogin('cliente@empresa.com', '123456')}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Cliente</span>
                <span className="text-xs text-gray-500 block">cliente@empresa.com</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-blue-200 text-sm">
          © 2024 Sistema de Gestión. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;