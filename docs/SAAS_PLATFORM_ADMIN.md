# Administración SaaS y KPIs

## Alcance

El módulo `/platform` permite supervisar organizaciones y OWNER independientes
desde la misma aplicación. `PLATFORM_ADMIN` administra todas las cuentas.
`PLATFORM_SUPERVISOR` recibe políticas y un alcance explícito de organizaciones
y OWNER, o todas las cuentas cuando su delegador dispone de ese alcance.
Los roles antiguos SUPERUSER y SUPERADMIN siguen retirados.

Las rutas operativas conservan su aislamiento por organización. Los usuarios de
plataforma solo acceden a `/platform/*` y a su perfil `/auth/me`. El editor
existente de políticas se reutiliza mediante rutas que validan la organización
destino antes de ejecutar las operaciones. Los permisos de plataforma tienen
un catálogo separado de los permisos operativos.

## Activación inicial

En el entorno del backend configura `MONGODB_URI`, `PLATFORM_ADMIN_EMAIL` y
`PLATFORM_ADMIN_PASSWORD` (12 a 128 caracteres). Opcionalmente configura
`PLATFORM_ADMIN_NAME`, `PLATFORM_ADMIN_LASTNAME` y `PLATFORM_ADMIN_PHONE`.
No guardes las credenciales en Git.

Ejecuta desde `backend`:

```sh
npm run platform:bootstrap
```

`builder.yml` ejecuta automáticamente `npm run platform:bootstrap` antes de
`npm start` en cada arranque del backend. Configura las variables anteriores en
el entorno de despliegue (Coolify o el `.env` de Compose) para la primera creación.
Si ya existe un administrador, el script termina correctamente sin modificarlo,
incluso si se han retirado las credenciales iniciales del entorno. El índice
único evita duplicarlo cuando varios contenedores arrancan simultáneamente.
Los errores de conexión o de configuración inicial impiden arrancar el backend.

El script crea el primer administrador sin imprimir su contraseña y rechaza
correos ocupados por otras cuentas. Luego inicia sesión en el formulario habitual;
se abrirá el módulo de KPIs.

Desde Planes crea los límites deseados para organizaciones y OWNER personales.
Desde Cuentas asigna una membresía y un motivo de cambio a cada cuenta. Desde
Políticas crea los perfiles de supervisión y desde Supervisores asigna perfiles
y cuentas. `platform.supervisors.manage` permite delegar; un supervisor no puede
conceder permisos o cuentas que excedan los suyos, modificar al administrador
principal o modificar su propia asignación.

## Membresías y límites

### Excluir módulos en políticas operativas

En el editor de políticas de una organización, crea una política «Sin IoT» y
selecciona **IoT / Smart Home** en **Módulos excluidos**. Puedes dejar vacíos los
permisos de esta política. En **Asignaciones**, agrega esta política al usuario
junto con sus políticas actuales y guarda la asignación.

La exclusión tiene prioridad sobre todas las políticas y permisos adicionales:
retira todos los permisos del módulo, oculta su opción del menú y bloquea sus
APIs. Excluir Cámaras también excluye sus grabaciones; excluir solo Grabaciones
conserva los demás permisos de cámaras. Las políticas existentes conservan su
comportamiento. El editor operativo asigna políticas a STAFF_ADMIN y STAFF;
los permisos del administrador principal y de residentes OWNER/FAMILY siguen
su esquema actual. El menú recoge el cambio al actualizar el contexto de acceso
(por ejemplo, al volver a iniciar sesión); el backend lo aplica en cada solicitud.

Con `SAAS_FREE_REGISTRATION_ENABLED=false`, las cuentas nuevas y existentes
conservan el comportamiento previo hasta asignarles una membresía. Al activarlo,
el registro verificado asigna el plan FREE predeterminado de su tipo en la misma
transacción. Deben existir ambos predeterminados y admitir los recursos iniciales.
La capa gratis es permanente, sin prueba ni vencimiento.

Planes distingue LEGACY, FREE y PAID, importe en centavos USD, periodicidad
mensual, módulos y cupos. El operador define precios y prestaciones; el código
no crea planes comerciales ni inventa precios. Los planes publicados en PayPal
conservan sus condiciones; para cambiarlas se crea otro plan. Archivar un plan
impide nuevas contrataciones, sin alterar las ya contratadas.

Migraciones permite seleccionar hasta 50 cuentas del mismo tipo, previsualizar
excesos y módulos retirados, indicar un motivo y confirmar. La revisión dura
diez minutos, está firmada y se rechaza si cambian plan, consumo o membresía.
Una suscripción PayPal abierta impide la asignación manual o migración.

Los límites efectivos son una copia del plan en la membresía. Cambiar un plan
no cambia retroactivamente las cuentas; reasigna o edita cada membresía para
aplicar los nuevos límites. Un límite vacío es ilimitado; cero bloquea capacidad
nueva. Se controlan condominios por organización, unidades totales, unidades
por condominio y residencias por OWNER independiente. Se cuentan unidades
activas disponibles y asignadas, incluyendo etiquetas históricas. Los límites
de dispositivos continúan en IoTSubscription.

La vigencia elegida por fecha termina al finalizar ese día en Santo Domingo.
Una membresía vencida, suspendida, cancelada o con pago pendiente permite
lectura y administración del perfil, pero bloquea mutaciones operativas.
Suspender la cuenta completa bloquea su acceso, conforme al contexto actual.
Reducir límites conserva los recursos: se marca el exceso y se impiden aumentos
de capacidad; se permiten reducciones con una membresía vigente.

Las escrituras con cupos necesitan un replica set MongoDB con transacciones.
La creación individual, importación y actualización de condominios toman un
bloqueo de membresía y comprueban el consumo en la misma transacción. Los hooks
de modelos impiden eludir los cupos desde otras escrituras estructurales sin
transacción. Los nuevos escritores deben usar `withMembershipWrite` y pasar la
sesión a todas las operaciones. No hay fallback sin transacciones para cuentas
con cupos.

## KPIs

`/platform/kpis` muestra organizaciones, OWNER independientes, cuentas activas,
condominios, unidades y residencias; membresías dentro del plan, excedidas,
vencidas, suspendidas, con pago pendiente, próximas a vencer en 30 días y sin
aprovisionar; y distribución de cuentas por plan. Se calcula al consultar o
actualizar, siempre limitado al alcance del usuario. Los problemas de
cumplimiento pueden coincidir en una cuenta. Quienes tengan
`platform.billing.read` también ven MRR de suscripciones activas no canceladas,
cancelaciones y cobros y devoluciones del mes UTC, separados de las finanzas de
los condominios. Las cuentas gratis/de pago y en gracia tienen indicadores propios.

Las acciones de plataforma se auditan con actor, destino, estado anterior y
posterior. Las acciones del editor operativo siguen en AuthorizationAudit y
aparecen también en el listado de auditoría del SaaS según el alcance del usuario.
No se guardan contraseñas en las auditorías.

## Verificación

```sh
cd backend
npm test
npm run test:platform:mongo
```

La segunda prueba inicia y elimina su propio contenedor MongoDB `mongo:7`,
publicado solo en loopback; no lee ni acepta la URI de la aplicación. Comprueba
concurrencia, rollback de importaciones, límites de unidades y residencias,
delegación, revocación, alcance de KPIs y auditoría.

Para la prueba del navegador, compila desde `frontend` sin ejecutar el postbuild:

```sh
node node_modules/@angular/cli/bin/ng.js build --configuration development --output-path ../tmp/platform-build
```

Luego ejecuta `npm run test:platform:browser` desde `backend`, con Playwright
disponible mediante `PLAYWRIGHT_MODULE` o la instalación de herramientas local.
Usa Edge headless y simula todas las APIs: no modifica datos reales. Comprueba
KPIs de escritorio/móvil, formularios y supervisión de solo lectura; guarda
capturas en `tmp/platform-browser`.

## Activación gradual del módulo comercial

Todas las variables de activación se entregan en `false`. Usa el archivo
`infra/saas-backup/saas.env.example` como referencia de nombres, sin secretos.
Se conserva Angular, Express, Mongoose y el replica set actual.

1. En Planes, configurar un FREE predeterminado para ORGANIZATION y otro para
   PERSONAL_OWNER, con cupos y módulos aprobados. Mantener LEGACY donde corresponda.
2. En Seguridad, configurar TOTP y guardar los diez códigos de recuperación.
   Establecer `PLATFORM_MFA_KEY` (32 bytes, 64 caracteres hexadecimales) en el
   almacén de secretos antes de `PLATFORM_MFA_ENABLED=true`. Conservar esa clave
   junto a la recuperación del despliegue; perderla impide descifrar TOTP.
3. Revisar lotes de cuentas existentes en Migraciones. Después activar
   `SAAS_FREE_REGISTRATION_ENABLED` y `SAAS_MODULES_ENABLED`. Las prestaciones
   comerciales restringen también al ADMIN y residentes, además de su RBAC.
   Cámaras y grabaciones siguen respetando sus permisos y cuotas originales.
   La generación de facturas, recordatorios de pago y sincronización iCal también
   omiten cuentas suspendidas, no vigentes o sin los módulos correspondientes.
4. Configurar PayPal sandbox, publicar un plan PAID y validar alta, renovación,
   firma de webhook, cancelación, devolución y regreso a gratis. Configurar
   `SAAS_PAYPAL_CLIENT_ID`, `SAAS_PAYPAL_SECRET`, `SAAS_PAYPAL_WEBHOOK_ID`,
   `SAAS_PAYPAL_ENV=sandbox`, `FRONTEND_BASE_URL` y `SAAS_PAYPAL_ENABLED=true`.
5. Activar `PLATFORM_OPERATIONS_ENABLED` para soporte, avisos, configuración,
   exportaciones y bajas. Conceder explícitamente los permisos nuevos a supervisores;
   sus políticas existentes no reciben privilegios adicionales automáticamente.
6. Configurar y comprobar el respaldo externo descrito abajo. Live usa otra app,
   webhook y planes PayPal; los planes publicados son específicos de su entorno.
   `SAAS_PAYPAL_ENV=live` requiere una restauración reciente y copia externa
   verificada antes de publicar planes o abrir contrataciones.

No alternar sandbox/live con suscripciones abiertas del otro entorno. Usar
despliegues y bases separados. No desactivar el worker de PayPal con renovaciones
reales abiertas: primero cancelar o resolverlas. Los flags congelan nuevas
acciones, pero no sustituyen la conciliación financiera ni restauran snapshots
anteriores. Revertir cambios de prestaciones mediante reasignaciones revisadas.

## MFA y sesiones

Las sesiones de plataforma duran ocho horas aun con «recordarme». La sesión
inicial de enrolamiento dura quince minutos y solo permite Seguridad y GET
`/auth/me`. TOTP usa códigos de seis dígitos, 30 segundos, ventana de un paso,
protección contra reutilización y bloqueo de cinco minutos tras cinco fallos.
Las acciones sensibles exigen una verificación de los últimos diez minutos.

Los secretos TOTP se cifran con AES-256-GCM; los códigos de recuperación se
guardan como hashes y se consumen una sola vez. Recuperación, cambio/restablecimiento
de contraseña y revocación invalidan sesiones mediante una versión consultada
en cada solicitud. Seguridad permite cerrar todas las sesiones propias;
Supervisores permite revocar las de cuentas dentro del alcance delegable.

## Suscripciones y facturación SaaS

Solo el ADMIN titular y OWNER independiente contratan desde `/subscription`.
El servidor determina precio, moneda, plan y cuenta. La aprobación del navegador
no concede prestaciones: se requiere cobro confirmado. Contratar usa una clave
idempotente y un índice único por cuenta con suscripción abierta.

Configurar el webhook público HTTPS en `/api/saas/paypal/webhook` para los eventos
`PAYMENT.SALE.COMPLETED`, `PAYMENT.SALE.REFUNDED`, `PAYMENT.SALE.REVERSED` y
`BILLING.SUBSCRIPTION.CREATED`, `ACTIVATED`, `CANCELLED`, `EXPIRED`, `SUSPENDED`,
`PAYMENT.FAILED`. Se verifica la firma con la API de PayPal; los identificadores
de evento y movimiento son únicos. La firma del webhook y `custom_id` deben
corresponder a la contratación local. No se almacenan datos de tarjetas.

El período se deriva del cobro mensual confirmado. Al terminar, el worker
consulta las transacciones de PayPal de los últimos 90 días antes de degradar.
Una respuesta incompleta o indisponible impide la degradación y genera un fallo
visible en Operación. Los cobros repetidos no duplican movimientos ni períodos.
El fallo de renovación concede siete días desde el fin del período pagado;
después se cancela la renovación y se copia el FREE predeterminado conservando
recursos. Los excesos bloquean capacidad nueva, sin borrar datos.

Cancelar conserva el período pagado y elimina la gracia posterior. Facturación
permite al operador cancelar cuentas suspendidas con motivo y alcance validado.
Una creación sin respuesta puede reintentarse con la misma clave durante 24
horas; después requiere conciliación de soporte para evitar suscripciones
duplicadas. `POST /platform/subscriptions/:id/reconcile`, con motivo y el ID
PayPal si falta, comprueba `custom_id` y el plan antes de vincularlo. Un cobro
posterior al cierre queda auditado como `saas.payment.review` para resolverlo
en PayPal. Reembolsos se realizan en PayPal y sus eventos actualizan el historial.

Los comprobantes descargables son comerciales en JSON, expresamente no fiscales.
El libro SaaS usa colecciones propias; no cambia PaymentTransaction ni las
facturas/cobros operativos. Facturación pagina 50 movimientos y muestra hasta
100 suscripciones abiertas; KPIs agregan en MongoDB sin cargar todas en memoria.

Documentación del proveedor: [Subscriptions API](https://developer.paypal.com/api/subscriptions/v1/),
[transacciones](https://developer.paypal.com/api/subscriptions/v1/subscriptions-transactions),
[firma de webhooks](https://developer.paypal.com/api/rest/webhooks/rest/).

## Soporte, comunicación y auditoría

Soporte registra incidencia, descripción, estado y responsable con acceso a la
cuenta. El diagnóstico muestra membresía, uso y cantidades de integraciones,
sin suplantar usuarios ni mostrar feeds, credenciales o documentos privados.
Los avisos se previsualizan por cuenta o todas las cuentas autorizadas. Una
cola entrega por lotes idempotentes al buzón de la aplicación, con vigencia;
vuelve a comprobar los permisos del emisor antes de entregar.

Auditoría permite filtros por actor, acción y fecha, y detalle anterior/posterior
redactado según alcance. PlatformAudit impide modificar/eliminar registros por
sus APIs y hooks Mongoose. Los roles de MongoDB también deben impedir alteración
directa del historial. Operación muestra conexión DB, workers, flags y respaldo;
no sustituye monitoreo de OCR, WhatsApp, video o procesos externos. Las solicitudes
HTTP registran ID, ruta sin parámetros privados, estado y duración.

## Exportación, baja y purga

Exportar genera NDJSON en almacenamiento temporal privado por organización,
con registros y metadatos de adjuntos; excluye credenciales y archivos binarios.
La descarga exige el mismo solicitante y alcance actual, se audita y caduca a
las 24 horas. Una pérdida del archivo al reiniciar se resuelve generándolo otra
vez. Es una exportación en vivo, no un snapshot transaccional para restauración.

La baja requiere motivo y revisión por otro operador, rechaza PayPal abierto,
suspende la organización y conserva los datos durante la retención configurable
(90 días por defecto). Reactivar cancela el proceso; la vigencia de la membresía
se administra aparte. Activar desde Cuentas no elude una baja en curso.

Tras la retención, solicitar borrado y revisarlo con otro operador. La revisión
enumera colecciones y bloqueos, caduca y exige escribir el slug exacto. La purga
requiere `PLATFORM_DATA_PURGE_ENABLED=true`, respaldo externo verificado después
de la retención y en las últimas 24 horas, ninguna suscripción abierta y ausencia
de archivos/integraciones/referencias heredadas pendientes. El endpoint no deduce
rutas de archivos ni elimina recursos de AWS/video. Esos recursos se retiran por
sus flujos existentes antes de purgar. Más de 50.000 registros requiere procedimiento
por lotes fuera de la interfaz. Finanzas y auditoría conservan su retención
separada; esta operación no equivale a eliminar todo historial financiero.

## Respaldo y recuperación

El perfil Compose `saas-backup` agrega una tarea aislada cada doce horas. Requiere
`SAAS_BACKUP_MONGODB_URI` con privilegios de backup para el replica set completo,
`SAAS_BACKUP_PASSWORD`, `SAAS_BACKUP_S3_URI=s3://bucket/prefix` y credenciales
AWS exclusivas para ese prefijo. Guarda MongoDB con oplog y el volumen uploads;
cifra en streaming con AES-256-GCM y PBKDF2, descifra y restaura en un mongod
temporal de loopback, valida colecciones y comprueba integridad del tar de archivos.
Después sube el artefacto cifrado, lo descarga y compara sus bytes antes de
marcar la copia externa verificada. El backend monta solo lectura el estado.

Configurar retención/versionado del bucket, capacidad del volumen local y custodia
de la contraseña y clave MFA fuera del servidor. El job no borra respaldos viejos
automáticamente. Objetivos operativos iniciales: RPO 24 horas y RTO 4 horas;
requieren medir una restauración con volumen real antes de afirmar que se cumplen.
uploads se copia en vivo: para una recuperación consistente de archivos, detener
escrituras durante una ventana de respaldo/restauración o usar snapshots del volumen.

Restaurar primero en infraestructura aislada: descargar artefacto, descifrar con
`python3 /usr/local/bin/comunard-backup-crypto decrypt origen.enc destino.tar.gz`,
extraer archivo MongoDB y uploads, ejecutar mongorestore con oplog y validar DB
y archivos. Restaurar también los secretos de despliegue, verificar permisos y
salud y conciliar PayPal antes de cambiar tráfico. No ejecutar una restauración
sobre producción como prueba.

Los workers locales y archivos temporales suponen una sola instancia del backend.
Escalar a varias requiere leases distribuidos y almacenamiento compartido para
exportaciones; queda fuera de esta entrega incremental. No se agregó suplantación,
facturación fiscal, trial, descuentos, ni cuotas nuevas de API/storage/video.

## Pruebas adicionales reproducibles

```sh
cd backend
node --test test/saas-commercial.test.js
node --test test/saas.integration.cjs
node test/saas.browser.cjs
```

La integración usa un replica set desechable y nunca la URI de producción. Los
tests de PayPal simulan el proveedor; falta verificar con credenciales reales de
sandbox. Las pruebas de navegador interceptan todas las APIs y generan capturas
en `tmp/saas-browser`; requieren build en `tmp/saas-platform-build` y Playwright.

```sh
docker build -t comunard-saas-backup-validation:local infra/saas-backup
cd backend
node --test test/saas-backup.integration.cjs
```

La última prueba verifica cifrado, restauración aislada y rechazo de alteraciones.
La copia S3 requiere validación con el bucket del operador; las pruebas locales
no configuran infraestructura externa ni despliegan esta implementación.

Validación de compilación: el build Angular de desarrollo pasó. El build de
producción compila los bundles, pero falla por el presupuesto existente de
10 kB por estilo de componente en booking-area, create-property, home, inquiry,
owner-profile, see-property y staff. Esos estilos y angular.json no se modificaron
en esta entrega. Resolver esos presupuestos antes de desplegar; no se aumentaron
los límites para ocultar el bloqueo.
