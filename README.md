SPRINT 01
Durante este sprint se realizaron tareas de validación y ajuste sobre el módulo Solicitar Proyecto, con foco en asegurar la integridad de los datos ingresados por el usuario y la correcta ejecución del flujo principal.

Casos de prueba ejecutados:

1. Flujo principal de solicitud
2. Validación de campos obligatorios
3. Validación de presupuesto en formato numérico
4. Validación de rangos de fechas
5. Control de duplicidad de proyectos

Resultados: 4 de 5 casos superados satisfactoriamente

Cobertura de pruebas exitosa: 80%

1. Incidencias detectadas y corregidas:

   - Validación de duplicidad de proyectos:
     No se identificaban correctamente solicitudes duplicadas.
     Estado: Corregido

2. Formato numérico en campo "presupuesto":
   - No se aceptaban decimales con formato local (por ejemplo, coma decimal).
     Estado: Corregido
