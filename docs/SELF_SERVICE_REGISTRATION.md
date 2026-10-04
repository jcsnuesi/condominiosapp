# Registro autónomo y onboarding

Solo existen dos altas públicas: ADMIN y OWNER personal. El propietario de una organización sigue siendo creado por su administración, con condominio, unidad y credenciales enviadas por correo.

## Recorridos

- `/#/auth/register`: elección guiada y registro ADMIN en dos pasos.
- `/#/auth/iot-register`: registro OWNER personal, compatible con el enlace anterior.
- `/#/auth/verify/admin/:token` y `/#/auth/verify/owner/:token`: confirmación de correo.
- `/#/onboarding`: guía del ADMIN principal con progreso obtenido de los registros de su organización. Puede retomarse desde el menú y permite configurar más adelante.

El alta ADMIN conserva una solicitud temporal con contraseña y token almacenados como hash. Al verificarla, una transacción crea organización, administrador principal, políticas y auditoría. El enlace vence en 24 horas y se consume una sola vez. Reenviar invalida el enlace anterior. Las respuestas de registro/reenvío no revelan si un correo ya tiene cuenta.

## Configuración

Se requiere MongoDB con transacciones (replica set), como en el aprovisionamiento anterior, y SMTP operativo:

- `SMTP_USER`, `SMTP_PASS` (se mantiene `EMAIL_PASSWORD` como alternativa heredada).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` o `SMTP_SERVICE`, según el proveedor.
- `SMTP_FROM`, si el remitente difiere del usuario SMTP.
- `FRONTEND_BASE_URL`: URL pública del frontend, sin `/#/`; los correos nuevos abren la pantalla de confirmación.
- `PUBLIC_API_BASE_URL`: se mantiene para los correos existentes de propietarios de organización y personal.
- `TRUST_PROXY_HOPS`: configurar únicamente si el backend está detrás de ese número de proxies confiables. Permite que el límite de registro se aplique a la IP del cliente.

La protección de registro/reenvío/verificación permite 20 intentos por IP en 15 minutos y es local a cada proceso. Una instalación con múltiples réplicas puede complementarla con el límite de su proxy.

## Retirada del supervisor

SUPERUSER (el SUPERADMIN anterior) ya no tiene modelo, login, rutas, panel ni permisos reconocidos. Sus tokens previos son rechazados. También se retiran los endpoints globales de creación, listado, edición y suspensión de administradores. La edición del perfil propio continúa en `/auth/me`. ADMIN solo administra su propia organización.

Las organizaciones existentes siguen funcionando. Sus identificadores históricos de aprovisionamiento y las auditorías permanecen como datos; no requieren consultar un Superuser. El nuevo aprovisionamiento registra al ADMIN principal. Esta implementación no borra colecciones históricas ni modifica datos de producción.

Los scripts de inicialización crean organizaciones directamente con ADMIN, sin supervisor.

## Suscripciones IoT

Se retiró el endpoint público de aprovisionamiento dependiente de SUPERUSER. La operación permanece disponible en el servidor:

```powershell
node scripts/provisionIotSubscription.js input.json
```

Ejecutar desde `backend`, con `MONGODB_URI` configurado. El archivo contiene `provisionedBy` (identificador del administrador responsable), `scopeType`, `plan`, `deviceLimit` y los identificadores del contexto. Para `PERSONAL_RESIDENCE`, incluye `ownerId` y `residenceId`; para `CONDOMINIUM_UNIT`, `condominiumId` y `unitId`; para `COMMON_AREA`, `condominiumId`. La organización se obtiene del condominio almacenado. Los clientes no pueden asignarse planes ni límites.

## Validación

```powershell
# Desde backend
node --test test/*.test.js
# Desde frontend; evitar el outputPath de desarrollo que escribe en nginx/html
npx.cmd ng build --configuration development --output-path dist/onboarding-review
```

Las pruebas verifican la creación y validación de documentos, correo pendiente, expiración, reenvío, rechazo de tokens del rol retirado, rutas protegidas y aislamiento del onboarding. Las pruebas sin MongoDB usan sustitutos de los modelos; no equivalen a una validación del envío SMTP y de las transacciones sobre una instalación real.
