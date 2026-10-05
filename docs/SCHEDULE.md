# Schedule y mantenimiento

El módulo conserva Angular, PrimeNG, FullCalendar, Express, Mongoose, MongoDB y Docker. No necesita PostgreSQL, Redis, Airflow ni servicios de mensajería externos. Las órdenes de servicio `Task` existentes conservan su modelo y sus rutas.

## Puesta en marcha

1. Configurar `MONGODB_URI` en el backend apuntando a un replica set. La configuración de MongoDB de `builder.yml` ya inicia `rs0`.
2. Desde `backend`, ejecutar `npm run schedule:migrate:dry-run` y revisar el resultado.
3. Ejecutar `npm run schedule:migrate:apply` antes de activar el worker. Crea validadores de ownership e índices, y amplía únicamente las políticas estándar operativas y de lectura. Conserva políticas personalizadas y denegaciones. Es idempotente.
4. Desplegar backend, frontend y `schedule-worker`. Compilar el frontend con el CLI directamente cuando se quiera evitar el `postbuild` que recrea contenedores.
5. Actualizar la sesión de los usuarios para refrescar el catálogo de permisos. Abrir Mantenimientos en el menú (`/#/schedule`).

En Compose, la migración puede ejecutarse con `docker compose -f builder.yml run --rm --no-deps backend npm run schedule:migrate:apply` después de iniciar MongoDB. El worker tiene una imagen independiente construida con `backend/Dockerfile.schedule-worker`: copia únicamente su entrada, los servicios de dominio y los modelos necesarios, e instala `dotenv`, `mongoose` y `mongoose-paginate-v2` con su propio lockfile. No incluye el servidor HTTP, rutas, controladores ni dependencias de correo, PDF o IoT. La limpieza de evidencias está separada del adaptador de subida para evitar instalar Multer en el worker. En otros despliegues, construir con `docker build -f backend/Dockerfile.schedule-worker -t condominiosapp-schedule-worker backend` y ejecutar esa imagen con acceso al mismo MongoDB y volumen de uploads. Al cambiar dependencias compartidas, actualizar también el manifiesto y lockfile de `backend/modules/schedule/worker-runtime`.

Variables:

| Variable | Predeterminado | Uso |
| --- | --- | --- |
| `SCHEDULE_MODULE_ENABLED` | `true` | `false` desactiva rutas, procesamiento y avisos de Schedule en la bandeja |
| `SCHEDULE_WORKER_INTERVAL_MS` | `1800000` | Intervalo del worker, de 1 segundo a 24 horas |
| `DISABLE_SCHEDULED_JOBS` | sin definir | `true` impide ejecución; conserva heartbeat y conectividad |
| `SCHEDULE_WORKER_HEARTBEAT` | `/tmp/schedule-worker-heartbeat` | Ruta alternativa para pruebas locales |

El worker comprueba la migración y los índices únicos al iniciar. Su healthcheck verifica el heartbeat; el proceso solo lo actualiza después de comprobar MongoDB. Logs estructurados: `schedule.tick` incluye volumen, errores y duración; `schedule.tick.failed` indica un ciclo fallido. No se registran tokens, contenido de evidencia ni respuestas de proveedores.

Las ejecuciones técnicas conservan resultado, intentos y errores sanitizados por ocurrencia. Una materialización fallida vuelve a ser elegible después de un minuto (se procesa en el siguiente ciclo disponible), sin bloquear indefinidamente otros schedules del lote.

El directorio privado `uploads/schedule-evidence` comparte el volumen de uploads. Si la API corre como root, asigna ese directorio al UID 1000 del usuario `node` del worker para permitir la limpieza de archivos huérfanos. Ajustar UID/permisos del volumen si se personalizan usuarios del contenedor.

## Contextos y permisos

Cada recurso tiene `organizationId` o `ownerId`, exclusivamente. Los IDs de ownership enviados por el cliente no conceden acceso. La organización requiere un condominio de su scope; el propietario requiere una residencia personal o una unidad activa. Se validan unidades mediante su ID, sin usar una etiqueta como autoridad.

Los gestores usan `STAFF_ADMIN` o `STAFF` con permisos delegados; no se introduce un rol `PROPERTY_MANAGER`. Los permisos son `schedules.read/create/update`, `maintenance.read/update` y `vendors.read/create/update`. FAMILY no recibe acceso. OWNER administra mantenimientos privados, incluido un OWNER asociado a una organización; ADMIN no puede leer esos recursos privados.

El catálogo de proveedores pertenece a la organización o al propietario, y es reutilizable entre sus ubicaciones. El historial conserva una copia del nombre/contacto del proveedor aunque se edite o archive. Las referencias de ubicación se comprueban contra acceso vigente: al perder ownership se conservan los datos, pero se deja de procesar o mostrar el recurso a ese usuario.

## Comportamiento

- Recurrencias: `ONCE`, `DAY`, `WEEK`, `MONTH`, `YEAR`; intervalo entero de 1 a 10000. El intervalo sigue siendo obligatorio para ONCE.
- Fechas por API: ISO 8601 con offset o `Z`. Persistencia UTC, zona IANA por schedule, predeterminada `America/Santo_Domingo`. Los formularios de fecha usan la zona del navegador y lo indican; la recurrencia y la presentación del vencimiento usan la zona guardada.
- Los meses/años ajustan días inexistentes al último día del mes. Las recurrencias diarias/semanales preservan la hora local, incluso con DST; una hora inexistente se desplaza hacia adelante y una ambigua usa el primer instante.
- Una ocurrencia abierta por schedule. Se materializa cuando entra en su ventana de recordatorio. Antes del vencimiento está `SCHEDULED`, al vencimiento `PENDING` y después `OVERDUE`; el desfase de detección depende del intervalo del worker.
- Avisos privados: anticipación, vencimiento y atraso, una vez por versión de tarea y tipo. Si el worker vuelve después de una caída y ya pasó el vencimiento, emite el aviso de atraso, sin acumular avisos históricos de anticipación/vencimiento.
- Los recordatorios van al responsable, por defecto el creador. Se valida que su cuenta permanezca activa y tenga acceso y `maintenance.update`. Si pierde acceso, el comando queda bloqueado y la programación muestra `RECIPIENT_ACCESS_LOST`. Editar y confirmar/reasignar el responsable recupera la entrega.
- La siguiente ocurrencia se calcula desde `performedAt`. Una fecha manual debe ser posterior a la fecha realizada. ONCE no admite una sucesora.
- Omitir/cancelar avanza la recurrencia desde la fecha de la acción. Los cierres son definitivos. `COMPLETED` solo se obtiene mediante el cierre con historial.
- Pausar impide tareas nuevas y avisos, pero permite completar una tarea abierta. Reanudar respeta la ventana de recordatorio y no genera períodos históricos adicionales.
- Reprogramar mantiene el ID de tarea, conserva la fecha original y audita el cambio. Cambiar frecuencia aplica a la siguiente ocurrencia; no modifica el vencimiento abierto.
- La bandeja combina avisos existentes y privados de Schedule, conserva el aislamiento y se actualiza cada 60 segundos mientras hay sesión.

## API

Todas las rutas llevan `/api`, autenticación y permisos. Envelope: `{ success, data, error, code }`. Listados: `{ docs, total, page, limit }`, 20 elementos por defecto y máximo 100 por página. No hay borrado físico de schedules, proveedores ni historial.

| Método y ruta | Función |
| --- | --- |
| `GET /schedules/contexts` | Ubicaciones autorizadas |
| `GET /schedules/responsibles` | Responsables con acceso a la ubicación solicitada |
| `GET /schedules/documents` | Documentos de la ubicación, requiere también `documents.read` |
| `POST /schedules` | Crear programación |
| `GET /schedules`, `GET /schedules/:id` | Listar/detalle |
| `PATCH /schedules/:id` | Nombre, descripción, equipo, recurrencia, zona, anticipación y responsable |
| `POST /schedules/:id/pause`, `/resume` | Pausar/reanudar |
| `GET /tasks?source=schedule`, `GET /tasks/:id` | Tareas separadas de órdenes existentes |
| `PATCH /tasks/:id/status` | `IN_PROGRESS`, `CANCELLED`, `SKIPPED` |
| `POST /tasks/:id/reschedule` | `{ dueDate }` |
| `POST /tasks/:id/complete` | Cierre JSON o multipart y evidencia |
| `GET /maintenance/history`, `/maintenance/history/:id` | Historial permanente |
| `GET /maintenance/history/:id/evidence/:fileId` | Descarga autenticada, como attachment |
| `GET/POST /maintenance/vendors` | Catálogo/alta |
| `PATCH /maintenance/vendors/:id` | Editar o archivar (`isActive: false`) |
| `POST /schedules/notices/:id/read` | Marcar aviso privado como leído |

Crear: `name`, `frequencyType`, `frequencyValue`, `startDate`, ubicación (`condominiumId` y `unitId` opcional para organización; `condominiumId`+`unitId` o `residenceId` para OWNER). Opcionales: `description`, `equipmentName`, `timezone`, `remindBeforeDays` (0–365, predeterminado 7), `assignedUserId` y `assignedRole`.

En edición, omitir el responsable conserva el existente; enviar `assignedUserId: null` lo reasigna al usuario autenticado. Los gestores que solo tengan `maintenance.read` pueden consultar sus avisos privados en la bandeja sin recibir acceso adicional a comunicaciones comunitarias.

Cierre: `performedAt` requerido y no futuro; `providerId`, `cost` (predeterminado 0, decimal no negativo con hasta dos posiciones), `currency` (DOP), `description`, `notes`, `nextRecommendedDate`, `documentIds` (hasta cinco). En multipart, `documentIds` es un array JSON y los archivos llevan el campo `evidence`. Hasta cinco archivos de 10 MB cada uno; PDF/JPEG/PNG/WebP con firma y MIME coincidentes. El proxy permite 51 MB únicamente en esta ruta. Repetir el cierre devuelve el registro existente y descarta los archivos nuevos de ese reintento.

Filtros: ubicación, `assignedUserId`, `scheduleId`, `providerId`, `status` para tareas y `from/to` ISO. Las fechas filtran `nextRunAt`, `dueDate` o `performedAt` según la colección.

## Pruebas y rollback

`npm test` incluye reglas de Schedule y la suite existente. `npm run test:schedule` ejecuta solo el módulo. Las pruebas de integración requieren `SCHEDULE_TEST_MONGODB_URI=mongodb://127.0.0.1:27028/?replicaSet=schedule-test`, una instancia exclusiva de pruebas: los fixtures rechazan otros hosts/puertos, crean una base aleatoria `schedule_test_*` y solo borran esa base.

Para E2E, compilar a `tmp/schedule-build`, instalar Playwright únicamente en `tmp/schedule-tools` y ejecutar `node modules/schedule/tests/browser.cjs` desde backend con la misma URI de pruebas y `PLAYWRIGHT_EXECUTABLE_PATH` si se usa un navegador instalado. Las capturas quedan en `tmp/schedule-browser`. El reloj se avanza mediante el executor inyectado en el proceso de pruebas; no se añade una API pública para modificar el tiempo.

Rollback: detener el worker y definir `SCHEDULE_MODULE_ENABLED=false` en backend y worker. Para restaurar permisos añadidos a políticas estándar, revisar `node scripts/migrateSchedule.js --rollback` y aplicar con `--rollback --apply`. Se conservan colecciones, índices, validadores e historial; no se hace una migración destructiva. Redeplegar la versión anterior de la interfaz si se quiere retirar el acceso del menú.

Esta entrega deja preparados los contratos del ejecutor, pero no incluye Airflow, IoT, correo, WhatsApp, reportes avanzados ni asientos financieros.
