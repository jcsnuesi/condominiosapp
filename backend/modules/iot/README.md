# Inicio de E0/E1 — 7 de octubre de 2026

Esta entrega inicia el primer cambio recomendado de `COMUNARD_IOT_INTEGRATION_PLAN.md`.
No completa los criterios de E0/E1 ni habilita cámaras, control de portones o provisioning de gateways.

## Implementado

- Schemas aditivos `IoTGateway`, `IoTDeviceProfile`, `IoTIntegrationMapping` e `IoTCommand`,
  con índices de identidad/idempotencia y validación del contexto. Los comandos no tienen TTL de borrado.
- Campos opcionales en IoTDevice para gateway, protocolo, perfil, binding y reported freshness.
  Se conserva awsThingName requerido, tipos de dispositivo, ownership y cuota legacy.
- Envelope v1 con tamaño limitado, timestamp UTC, identidad autenticada, binding persistido,
  contexto y versión de perfil. El consumidor debe resolver gateway/device desde su identidad de servicio.
- Validador de payload contra campos/rangos de perfil; transiciones de comando con filtro
  compare-and-set, expiración y evidencia obligatoria para EXECUTED. ACKNOWLEDGED no confirma ejecución.
- Permisos de cámaras, grabaciones, vehículos y portón separados del IoT legacy. No se agregan
  automáticamente a OPERATIONS_ADMIN ni READ_ONLY. El administrador propietario conserva el catálogo
  global actual; las futuras APIs deben aplicar autorización de recurso y negar cámaras privadas ajenas.
- Las lecturas/control privados vuelven a verificar que la unidad persistida está activa.
- La presencia se calcula con metadata de campos reported admitidos, nunca con el timestamp global
  del Shadow. El dashboard recalcula antigüedad, incluidas las tarjetas de dispositivos.
- Simulador offline determinista AWS_SHADOW/ZIGBEE y pruebas locales.
- APIs de inventario autorizadas con paginación acotada, registro idempotente y auditoría
  transaccional; cliente Angular tipado. La bandera `IOT_INVENTORY_ENABLED` permanece desactivada
  por defecto y solo afecta las rutas nuevas.
- Ingesta interna de estados con identidad del adapter, mapping AWS activo, contexto vigente,
  perfil validado, recibos durables y protección de orden/replay. Worker de presencia cada minuto
  con alerta de desconexión. No depende de consultas del dashboard para dispositivos de gateway.
- Solicitud durable de comandos persistentes, auditoría/outbox transaccionales y dispatcher con leases,
  revalidación de permisos, expiración y retries con commandId estable. Transporte inyectado, sin AWS por defecto.
- Consumer interno de ACK/feedback con evidencia inmutable y validación del estado reportado.
  Handler edge con intención/resultado durables y deduplicación tras reinicio; sin driver físico ni MQTT todavía.

## Validación

Desde backend:

```powershell
npm run test:iot
npm run iot:simulate
```

Regresión usada desde la raíz:

```powershell
node --test backend/test/iot-*.test.js backend/test/authorization.test.js backend/modules/schedule/tests/rules.test.js backend/modules/iot/tests/*.test.js
```

Baseline: 61 pruebas; primera entrega: 72; segunda: 87; tercera: 98 pruebas focalizadas aprobadas,
sin omisiones, más 4 pruebas de integración con MongoDB 8.0 y replica set temporal.
La suite rápida usa validación de documentos y dobles en memoria. La suite separada de Mongo
comprueba índices/transacciones/concurrencia reales. No se probó MQTT real, AWS staging o hardware.
Cuarta entrega: 101 pruebas focalizadas aprobadas; 5 casos Mongo reales, con transporte simulado para
comandos. Cliente Angular validado con TypeScript noEmit. Esta entrega realizó cero llamadas AWS.
Quinta entrega: 106 pruebas focalizadas locales (103 backend + 3 edge), tipos Angular y un caso nuevo
Mongo cloud-edge. La suite Mongo dispone ahora de 6 casos. Cero llamadas AWS en esta entrega.
Regresión completa del backend: 283 pruebas, 279 aprobadas, 0 fallos y 4 omitidas por sus condiciones
existentes (integración Schedule y tres suites de finanzas). La suite Mongo IoT separada aprobó sus 4
pruebas sin omisiones. Se comprobó el cierre del mongod temporal y la limpieza de su directorio.
Las nuevas pruebas viven en modules/iot/tests para que no las ignore la regla backend/test/*.

## Compatibilidad y despliegue

No se ejecutó migración, creación de índices en la base de la aplicación, despliegue ni modificación de recursos AWS.
Los nuevos modelos se cargan desde las rutas de inventario. Antes de desplegar, verificar en staging
los índices nuevos y la configuración de autoIndex de Mongoose; la bandera controla el acceso HTTP,
no la creación automática de índices al conectar. Los defaults de IoTDevice se aplican al hidratar documentos; lecturas lean de documentos
legacy pueden carecer de esos campos. No usar gateway/profile como requisito de APIs legacy.
lastSeen legado no es prueba de reporte: sin lastReportedAt o metadata válida se muestra UNKNOWN.
El esquema de comandos solo limita la forma del payload; su futuro servicio debe llamar
validateProfilePayload antes de persistir y ejecutar el compare-and-set de commandTransition.

## Siguiente alcance

1. E0: verificar migración/entitlements y replica set en staging con datos sintéticos.
2. E1: modelos de cámaras/vehículos y sus APIs autorizadas,
   migración dry-run/backfill idempotente y conexión del consumer real a la ingesta interna.
3. Conectar el transporte del dispatcher/consumer y el uploader durable edge. ACK/feedback y
   deduplicación edge ya tienen implementación local; falta certificar sus drivers y operación física.
4. E2/E3: provisioning y reconciliación AWS/ThingsBoard/edge. La ventana de frescura de esta validación
   corresponde a mensajes online; eventos históricos recuperados del spool requieren contrato distinto
   y nunca deben autorizar una apertura por antigüedad.
5. Inventario del piloto: modelo/firmware de cámara, RTSP/ONVIF/export de clips, gateway,
   controlador con feedback, cuenta/región de staging y retención. Estos datos siguen pendientes.

Las alertas al consultar Shadow se conservan solo para dispositivos directos legacy. Los dispositivos
asociados a un gateway leen estado persistido por ingesta; no consultan Shadow ni crean alertas al leer.
Hay dispatcher interno con transporte inyectado y una ruta de solicitud durable de comandos persistentes,
desactivada por defecto. ACK/feedback tiene consumer interno; todavía no hay transporte AWS conectado ni executor físico.

## APIs de inventario — segunda entrega

Habilitar en el backend de staging con `IOT_INVENTORY_ENABLED=true`, después de validar replica set,
índices y permisos. No se modificó ninguna variable de despliegue en esta entrega.

| Ruta | Permiso | Alcance |
| --- | --- | --- |
| POST /api/iot/gateways | iot.create | Registro Mongo + mapping AWS PENDING + auditoría en una transacción |
| GET /api/iot/gateways | iot.read | Contexto obligatorio; limit 1-50 y cursor after |
| GET /api/iot/gateways/:id | iot.read | Revalidación del recurso privado/común |
| PATCH /api/iot/gateways/:id | iot.update | Solo displayName/hardwareModel, con auditoría |
| GET /api/iot/profiles | iot.read | Catálogo global de compatibilidad, sin escritura pública |
| PATCH /api/iot/devices/:id/binding | iot.update | Primera asociación, gateway activo, mismo contexto y perfil compatible |
| GET /api/iot/commands/:commandId | iot.history | Consulta por commandId, acceso actual al dispositivo y contexto coincidente |
| POST /api/iot/commands | iot.control | Solicitud durable de estado persistente; responde 202 sin confirmar ejecución |

Ejemplo de registro (usar IDs reales del contexto autorizado):

```json
{
  "scope": { "scopeType": "PERSONAL_RESIDENCE", "residenceId": "012345678901234567890123" },
  "displayName": "Gateway piloto",
  "hardwareModel": "Modelo del piloto",
  "idempotencyKey": "registro-piloto-1"
}
```

Reintentar con la misma clave y el mismo input devuelve el mismo gateway; reutilizarla para otro
contexto o nombre devuelve 409. Organization/Owner y awsThingName se derivan en servidor.
El gateway queda PROVISIONING: el endpoint no crea Things ni certificados en AWS, no lo activa
y no consume una cuota de dispositivo legacy. Definir límites específicos de gateways antes del piloto.

El binding conserva awsThingName, no cambia ownership/cuota ni permite reasignación. El índice
`iot_gateway_binding_unique` evita asignar una misma dirección a dos dispositivos. El catálogo debe
declarar deviceTypes y el gateway adapters antes de enlazarlos. El endpoint solo guarda asociaciones;
la sincronización AWS/edge y su autorización se implementarán en E2/E3. El control de dispositivos directos
legacy conserva su comportamiento de Shadow y no se interpreta como ejecución física confirmada.
En dispositivos asociados a un gateway se responde `IOT_GATEWAY_COMMANDS_UNAVAILABLE` hasta disponer
del dispatcher, expiración y feedback.

DTOs públicos excluyen certificados, identidad de Thing, idempotencyKey, actores de comandos,
payload de comandos y referencias internas de evidencia. confirmed solo es true para EXECUTED
con evidencia. Los nuevos campos de dispositivo son aditivos en las respuestas legacy.

Cliente Angular: `frontend/src/app/demo/service/iot-inventory.service.ts`. Tipos comprobados con
TypeScript local y noEmit; no se ejecutó postbuild ni se recrearon contenedores. No se añadió UI todavía.

## Ingesta y presencia — tercera entrega

`IoTIngestionService.ingestState({ authenticatedThingName }, envelope)` es una entrada interna,
sin webhook ni ruta pública. Un futuro adapter AWS debe obtener authenticatedThingName de la identidad
autenticada y comprobar las policies/topics antes de invocarla. Pasar un Thing declarado por el emisor
no constituye autenticación. La integración de transporte sigue pendiente.

`IOT_INGESTION_ENABLED=true` habilita el servicio; permanece desactivado por defecto. La misma bandera
activa el worker de presencia cuando DISABLE_SCHEDULED_JOBS no es true. La ventana de frescura es
5 minutos. El sweep procesa hasta 100 equipos por minuto y debe dimensionarse antes de un piloto mayor.

- Identidad→gateway activo→mapping AWS SYNCED→dispositivo asociado→contexto vigente→perfil/protocolo.
- Payload allowlisted por perfil y capabilities de negocio actuales; vacío/rangos inválidos rechazados.
- Gateway, estado, alertas y recibo se actualizan en transacción. La escritura del gateway participa
  en conflictos con su revocación; un resultado 409 de conflicto debe reintentarse con el mismo mensaje.
- Recibo único por gateway/messageId. Mismo contenido devuelve duplicate; contenido diferente da 409.
  Un retry ya recibido puede reconocerse fuera de la ventana de frescura, sin reaplicar estado.
- Sequence debe aumentar de forma durable por dispositivo y no reiniciarse al reiniciar el edge.
  Un mensaje con sequence anterior/igual o timestamp anterior queda IGNORED_OUT_OF_ORDER.
  Se preservan los campos de reportes parciales. Los mensajes desconocidos antiguos/futuros se rechazan.
- Inbox solo guarda contexto, hash y resultado del estado de negocio. Telemetría cruda/históricos técnicos
  deben continuar por el spool/ThingsBoard del adapter; definir retención de recibos antes de escalar.
- La expiración de presencia compara lastReportedAt y connectivity en la escritura, de modo que un
  reporte nuevo impide marcar OFFLINE desde un candidato antiguo. La alerta y el cambio son atómicos.

Pruebas con Mongo real (requiere mongod local o IOT_TEST_MONGOD con su ruta):

```powershell
cd backend
npm run test:iot:mongo
```

La suite crea un directorio propio bajo tmp, elige un puerto libre, arranca mongod con windowsHide y
bind_ip=127.0.0.1, inicia un replica set y usa datos sintéticos. No acepta URI externa. Al terminar cierra
su proceso y elimina únicamente su directorio, tras validar que está dentro del tmp del workspace.
Incluye entrega concurrente duplicada, rollback por fallo de alertas, dos organizaciones, dos unidades
del mismo condominio, residencia personal, revocación y presencia idempotente.

Pendiente: AWS consumer/certificados/policies/topics, gateway heartbeat dedicado, transporte de comandos,
drivers/spool durable, migración y pruebas de staging. No se habilitó ninguna bandera de despliegue.

## Comandos durables — cuarta entrega

`IOT_COMMANDS_ENABLED=true` habilita solicitudes y el dispatcher interno. El endpoint también requiere
`IOT_INVENTORY_ENABLED=true`. Ambas siguen desactivadas en el despliegue. Se conserva el endpoint
legacy de Shadow; los dispositivos asociados a gateways usan la nueva solicitud cuando se habilite.

```json
{
  "deviceId": "012345678901234567890123",
  "payload": { "power": "ON" },
  "idempotencyKey": "encender-luz-1",
  "ttlSeconds": 30
}
```

TTL permitido: 5-60 segundos, default 30. Reintentar la misma clave devuelve el mismo comando sin
extender la caducidad; cambiar dispositivo, contexto, payload o TTL devuelve 409. Comando, auditoría
de intención y outbox se persisten juntos. No hay publicación dentro de la transacción.

El dispatcher no se programa automáticamente ni tiene un transporte de red por defecto: debe recibir
un transport.publish explícito. Reclama un lease de 30 segundos, revalida el actor desde persistencia,
gateway/mapping activo y versión/binding del dispositivo; publica sin retained y con QoS 1. Estado
DISPATCHED representa el intento de envío durable; outbox SENT representa aceptación del transporte.
Ninguno equivale a ACKNOWLEDGED ni EXECUTED. Los fallos de publicación se reintentan con backoff y
máximo 5 intentos, siempre con el mismo commandId y expiresAt. La expiración o revocación cierra la cola.

Solo LIGHT, AIR_CONDITIONER y WATER_PUMP, con comandos persistentes validados por capabilities y perfil.
SMART_LOCK/portones/OPEN no se habilitan: requieren acciones transitorias, interlocks y evidencia física.
No se envía ningún comando desde un job hasta conectar y validar el transporte en staging.

La publicación es al menos una vez: una caída después de publicar y antes de guardar SENT puede
provocar retransmisión. El edge debe deduplicar commandId de forma durable, comprobar caducidad y
aplicar permisos/interlocks locales. Un lease no garantiza ejecución física única ni revocación instantánea
de mensajes ya entregados. Ese criterio se probará en E3/E4C antes de habilitar actuadores.

Pruebas de esta entrega: mocks y MongoDB temporal local, sin endpoints AWS, certificados ni recursos
cloud. Las futuras pruebas AWS se limitarán al mínimo necesario para aceptar el transporte/configuración,
conforme a la preferencia del usuario de evitar consumo de pruebas cobradas.

## Confirmación y deduplicación edge — quinta entrega

Entrada interna: `IoTCommandFeedbackService.ingestAck({ authenticatedThingName }, envelope)`,
habilitada por IOT_INGESTION_ENABLED y sin ruta HTTP pública. Valida identidad, mapping activo,
contexto vigente, recurso/gateway/versión del comando y recibo único. Los eventos usan /event con
payload.eventType=command.ack, commandId y status ACKNOWLEDGED/EXECUTED/FAILED. El transporte real
y su autenticación todavía deben conectarse; una identidad declarada en el payload no es suficiente.

ACKNOWLEDGED solo confirma recepción. EXECUTED requiere `DeviceProfile.commandFeedback=DEVICE_REPORT`
(default NONE), un sourceEventId, timestamp UTC y estado observado coincidente con el comando. Se crea
IoTCommandFeedback inmutable, ligado al binding y perfil, antes de actualizar el comando en la misma
transacción que el recibo. El campo público confirmed sigue dependiendo de EXECUTED con evidencia interna.
Si se perdió el ACK separado, la evidencia de ejecución válida registra ambas etapas atómicamente.
Un ACK tardío o mensaje con secuencia anterior no revierte un resultado terminal. El timestamp de
evidencia debe pertenecer a la ventana del comando; recibos nuevos mantienen la ventana de frescura
de ingesta. Un comando ya FAILED/EXPIRED no se reactiva mediante feedback tardío.

El handler `edge/gateway-agent/command-handler.js` no publica ni conecta a AWS. Su executor inyectado
debe devolver un reporte observado del dispositivo, no el éxito de una API. Con almacenamiento
persistente, guarda intención/ACK antes de la acción y resultado después. La misma entrega devuelve
eventos idénticos sin ejecutar nuevamente. Si el proceso cae dejando intención sin resultado legible,
devuelve REQUIRES_RECONCILIATION y bloquea reejecución automática. Sin feedback válido conserva resultado
no confirmado. Los eventos quedan almacenados para que el futuro uploader durable los retransmita.

La capacidad DEVICE_REPORT declara un camino de feedback que debe certificarse por hardware;
validar JSON no prueba el estado físico. El almacenamiento Linux debe mantenerse entre reinicios y
contenedores. Las pruebas Windows no certifican pérdida de energía ni fsync Linux. No hay portones,
cerraduras, drivers reales, Docker edge ni MQTT mTLS activos en esta entrega.

Pendiente adicional: transporte autenticado del uploader, cuota del volumen/retención del spool,
heartbeat/configuración/revocación edge y pruebas físicas de cada perfil. El transporte real y su
worker de publicación siguen pendientes antes del piloto.

Validación focalizada: replay tras reiniciar el handler, resultado incierto tras caída, expiración,
ACK sin evidencia, feedback ausente o distinto, perfil sin soporte, ACK perdido y evidencia inmutable.
El caso Mongo usa un actuator simulado; ninguna de estas verificaciones consume AWS.

### 6. Cierre local de comandos sin feedback

`IoTCommandExpiryService` cierra REQUESTED al alcanzar expiresAt y DISPATCHED/ACKNOWLEDGED
cinco minutos después. La gracia permite recibir evidencia retrasada de una ejecución dentro del plazo;
no amplía expiresAt ni permite nuevas acciones o publicaciones vencidas. La cola de un reintento vencido
se cierra sin convertir prematuramente un envío incierto en un resultado terminal.

El barrido usa lotes de 100 (máximo 500), el índice status/expiresAt y transacciones con escritura
condicionada al estado seleccionado. Un resultado EXECUTED/FAILED concurrente no se sobrescribe.
EXPIRED conserva el historial y failureCode: IOT_COMMAND_EXPIRED para solicitudes sin envío o
IOT_COMMAND_FEEDBACK_TIMEOUT para ausencia de feedback. Las colas PENDING/LEASED pasan a DEAD
y pierden su lease en la misma transacción; SENT conserva la evidencia de aceptación del transporte.

`startIoTCommandExpiryJob` ejecuta el cierre cada 60 segundos, sin solapamientos, únicamente con
IOT_COMMANDS_ENABLED=true y DISABLE_SCHEDULED_JOBS distinto de true. No utiliza transportes externos.
Las flags permanecen desactivadas por defecto.

Validación local de esta entrega: 109 pruebas focalizadas y siete casos con MongoDB efímero en
loopback, todos aprobados. Incluyen límites de gracia, no publicación vencida, rollback de cierre y
un resultado de ejecución recibido entre selección y actualización. Cero llamadas a AWS.

### 7. Uploader durable de eventos del gateway

`edge/gateway-agent/event-uploader.js` lee los eventos persistidos por el handler y conserva recibos
atómicos por etapa. Reintenta ACK/EXECUTED con el mismo messageId y contenido después de fallos o
reinicios, con backoff persistido, sin ejecutar otra vez el dispositivo. También recupera el ACK
de una intención sin resultado. Las entradas corruptas o de otro gateway se conservan y aíslan.

El contrato `transport.publishEvent` necesita aceptación durable del backend y messageId coincidente;
PUBACK de MQTT no constituye recibo de aplicación. Todavía no hay cliente MQTT, suscripción a recibos
autenticados ni daemon de envío. La cuota del volumen, retención y el manejo de eventos rechazados
por antigüedad siguen pendientes; no se descartan ni se cambian timestamps automáticamente.

Validación de esta entrega: siete pruebas edge aprobadas y un caso focalizado MongoDB local aprobado,
incluyendo pérdida de recibo después del commit, reinicio del uploader y una sola evidencia por comando.
No se repite el actuator ni se llama a AWS. Ver `edge/gateway-agent/README.md` para el contrato y límites.

### 8. Admisión de comandos según capacidad del spool

El handler aplica límites locales antes de aceptar comandos nuevos: presupuesto lógico de bytes,
cantidad de comandos y espacio libre mínimo. Reserva 64 KiB por comando para su resultado/recibos
posteriores y contabiliza también los directorios legacy. Un lock exclusivo serializa admisiones
entre procesos; un lock dejado por una caída exige recuperación manual con todos los agentes detenidos.

La cuota llena bloquea nuevas acciones antes del ACK, pero permite replay de comandos conocidos
y la entrega de sus eventos. No se elimina historial ni se libera una acción incierta para admitir
otra. Los valores por defecto de desarrollo son 64 MiB de presupuesto y 16 MiB de espacio libre;
no sustituyen la cuota de filesystem, monitoreo ni una política productiva de retención.

Validación: 12 pruebas edge locales aprobadas (cinco nuevas de capacidad/concurrencia), sin AWS.
Quedan pendientes retención/archivo con ventana explícita de deduplicación, alarmas de almacenamiento
y certificación de filesystem Linux. Detalles de límites y recuperación en el README del gateway.

### 9. Ingesta interna de heartbeat y salud del gateway

`IoTHeartbeatService.ingestHeartbeat` acepta identidad autenticada del adapter, no identidad declarada
por el cliente. Requiere gateway ACTIVE, mapping AWS SYNCED y contexto vigente. Comparte el envelope v1
con resourceId=gatewayId y profileVersion=1 (versión del contrato de salud, independiente del perfil
de dispositivos). Payload estricto: eventType=gateway.heartbeat, agentVersion, configurationVersion,
uptimeSeconds, spoolCommandCount, spoolAccountedBytes, spoolCapacityBytes y storageBlocked.

Un heartbeat admitido guarda únicamente salud resumida y lastHeartbeatAt, con heartbeatSequence
monotónica e inbox GATEWAY_HEARTBEAT en una transacción. El incremento de ingestionRevision participa
en la detección de revocación concurrente. El recibo conserva hash, no payload crudo. Duplicados exactos
pueden reconocerse después de cinco minutos; mensajes nuevos vencidos o futuros se rechazan y un
mensaje anterior no renueva presencia ni reemplaza salud. El contexto/mapping se comprueba incluso
para duplicados. La configurationVersion reportada no modifica la configuración autoritativa.

El inventario autorizado expone health allowlisted y connectivity calculada a partir del heartbeat
(ONLINE dentro de cinco minutos, OFFLINE después, UNKNOWN sin datos o si el gateway no está ACTIVE).
El heartbeat no actualiza conectividad, estado ni eventos de dispositivos: estos necesitan sus propios
reportes. La interface Angular IoTGateway incorpora los nuevos campos sin activar una pantalla nueva.

Validación: 122 pruebas focalizadas aprobadas, un caso nuevo con MongoDB aislado aprobado y TypeScript
del servicio de inventario sin errores. Incluye rollback si falla el recibo, contexto ajeno, revocación,
orden/frescura y estado de dispositivos intacto. Cero llamadas a AWS.

Productor edge implementado en `edge/gateway-agent/heartbeat-producer.js`, con secuencia/pending
atómicos, backoff persistente, lock entre procesos y transporte inyectable. Incluye loop optativo,
sin activarlo en producción. Los reintentos conservan contenido; una muestra vencida necesita
rechazo de aplicación explícito antes de producir otra con secuencia nueva. Ver README edge.

Pendiente: publicación/recibos autenticados, conexión al loop/daemon desplegado,
alarmas de salud y configuración/revocación del agente. No hay endpoint HTTP público de heartbeat
ni transporte conectado; IOT_INGESTION_ENABLED permanece desactivado por defecto.
