# Auditoría RBAC con Playwright

La suite `tests/rbac-functional-audit.js` valida el comportamiento visible y el acceso directo por URL de las cuentas QA `ADMIN`, `STAFF_ADMIN` y `STAFF`. Antes de recorrer la interfaz obtiene la fuente de verdad desde `GET /auth/me`: permisos efectivos, organización y alcance de condominios.

## Ejecución segura

Defina las variables en la sesión, nunca en un archivo versionado:

```powershell
$env:RBAC_BASE_URL = "https://staging.example"
$env:RBAC_API_BASE_URL = "https://staging-api.example/api/"
$env:RBAC_ADMIN_EMAIL = "..."; $env:RBAC_ADMIN_PASSWORD = "..."
$env:RBAC_STAFF_ADMIN_EMAIL = "..."; $env:RBAC_STAFF_ADMIN_PASSWORD = "..."
$env:RBAC_STAFF_EMAIL = "..."; $env:RBAC_STAFF_PASSWORD = "..."
node tests/rbac-functional-audit.js
```

## Crear una organización QA desde cero

Para un entorno local con Docker, `backend/bootstrap_rbac_qa.js` crea una organización aislada, una propiedad QA y estas cuentas: `ADMIN` propietario, `STAFF_ADMIN` con todos los permisos y alcance organizacional, y `STAFF` con solo lectura limitada a esa propiedad. El script no sobrescribe una organización ya creada y no imprime contraseñas.

Use un `QA_RUN_ID` nuevo y contraseñas temporales en variables de la sesión. Esas mismas variables se reutilizan para la auditoría como `RBAC_*`.

La salida se guarda en `tests/artifacts/rbac-functional-<timestamp>/` e incluye `report.json`, `report.md`, capturas por rol/componente y trazas Playwright. Las contraseñas nunca se escriben en los artefactos.

## Qué valida

- Inicio/cierre de sesión, foco de teclado, menú y control de perfil.
- Dashboard, reservas, usuarios, personal, propiedades, propietarios, documentos, STR/iCal, pagos y comunicaciones.
- Visibilidad de menú, navegación directa a cada ruta, componente renderizado, controles de creación/edición/eliminación y errores de red o consola.
- Vista móvil para los recorridos operativos de mayor uso.
- Comparación de la interfaz y rutas frente a permisos reales. Un componente renderizado sin permiso se clasifica como `fuga de acceso`.

## CRUD y limpieza

La suite arranca en modo de solo lectura incluso en staging. Esto evita crear o borrar información ante una configuración accidental. Para ejecutar CRUD debe crearse primero un adaptador de fixture aislado por módulo: alta con prefijo QA, captura del identificador creado, actualización verificable y borrado del mismo identificador en `finally`. Solo después se habilita `RBAC_ENABLE_MUTATIONS=true`.

No se deben usar registros existentes ni habilitar mutaciones en producción.
