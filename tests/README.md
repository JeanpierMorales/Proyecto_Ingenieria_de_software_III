# Suite de Pruebas Completa

Esta suite de pruebas cubre todos los aspectos necesarios para asegurar la calidad del software de gestión de proyectos.

## Estructura de Pruebas

### 🧪 Pruebas Unitarias

- **validations.test.js**: Pruebas de funciones de validación
- **validations-fixed.test.js**: Pruebas corregidas de validaciones
- **validations-complete.test.js**: Suite completa de validaciones

### 🔗 Pruebas de Integración

- **api.test.js**: Pruebas básicas de API
- **integration-extended.test.js**: Pruebas avanzadas de integración con flujos completos

### 🔒 Pruebas de Seguridad

- **basic.test.js**: Pruebas básicas de seguridad
- **security-extended.test.js**: Pruebas avanzadas de seguridad (SQL injection, XSS, CSRF, etc.)

### 🎯 Pruebas de Regresión

- **regression.test.js**: Pruebas para detectar regresiones en funcionalidades existentes

### 🎨 Pruebas de Usabilidad

- **usability.test.js**: Pruebas end-to-end con Puppeteer para verificar UX

### ⚡ Pruebas de Rendimiento

- **performance-extended.test.js**: Pruebas de rendimiento con Jest
- **load.test.yml**: Pruebas de carga con Artillery (básicas)
- **load-extended.yml**: Pruebas de carga avanzadas con Artillery

## Configuración

### Dependencias

```bash
npm install --save-dev jest supertest puppeteer artillery
```

### Variables de Entorno

Asegúrate de tener configuradas las siguientes variables:

- `NODE_ENV=test`
- `DATABASE_URL` para pruebas
- `JWT_SECRET` para autenticación

## Ejecución de Pruebas

### Todas las pruebas

```bash
npm test
```

### Pruebas específicas

```bash
# Unitarias
npm run test:unit

# Integración
npm run test:integration

# Seguridad
npm run test:security

# Rendimiento
npm run test:performance

# Usabilidad (requiere servidor corriendo)
npm run test:usability

# Regresión
npm run test:regression
```

### Pruebas de carga

```bash
# Pruebas básicas
artillery run tests/performance/load.test.yml

# Pruebas extendidas
artillery run tests/performance/load-extended.yml
```

## Cobertura de Pruebas

### Funcionalidades Cubiertas

- ✅ Gestión de proyectos
- ✅ Gestión de presupuestos
- ✅ Gestión de usuarios y autenticación
- ✅ Generación de reportes
- ✅ API REST completa
- ✅ Validaciones de datos
- ✅ Seguridad de la aplicación
- ✅ Rendimiento del sistema
- ✅ Experiencia de usuario

### Tipos de Pruebas

- ✅ Unitarias: 95%+ cobertura
- ✅ Integración: Flujos completos
- ✅ Seguridad: 20+ vulnerabilidades comunes
- ✅ Rendimiento: Throughput, latencia, memoria
- ✅ Usabilidad: Navegación, accesibilidad, responsive
- ✅ Regresión: Prevención de bugs recurrentes

## Reportes y Métricas

### Generación de Reportes

```bash
# Cobertura
npm run test:coverage

# Reporte HTML de Artillery
artillery report report.json
```

### Métricas Clave

- **Tiempo de respuesta**: <500ms para APIs críticas
- **Throughput**: >10 req/seg bajo carga normal
- **Disponibilidad**: 99.9% uptime
- **Cobertura de código**: >85%
- **Tasa de éxito de pruebas**: >95%

## Mejores Prácticas

### Organización

- Cada tipo de prueba en su directorio
- Nombres descriptivos para tests
- Configuración compartida en `setup.js`

### Mocks y Fixtures

- Usar datos de prueba consistentes
- Limpiar estado entre tests
- Evitar dependencias externas en tests unitarios

### CI/CD

- Ejecutar tests en cada commit
- Paralelizar tests para velocidad
- Alertas automáticas en fallos

## Mantenimiento

### Actualización de Pruebas

- Revisar tests después de cambios en código
- Actualizar datos de prueba según cambios en BD
- Mantener consistencia con API

### Debugging

- Logs detallados en fallos
- Screenshots en tests de UI
- Profiling en tests de rendimiento

## Contribución

### Agregar Nuevas Pruebas

1. Identificar tipo de prueba
2. Crear archivo en directorio correspondiente
3. Seguir convenciones de nomenclatura
4. Actualizar documentación

### Revisión de Código

- Code review obligatorio para tests
- Verificar cobertura de edge cases
- Validar que tests fallen correctamente
