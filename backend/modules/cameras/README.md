# Piloto de cámaras Hikvision — estado e instalación

Actualizado: 2026-10-07. El alcance confirmado es una cámara a través del DVR/NVR,
visualización por usuarios autorizados desde internet, clips de los siguientes
30 segundos al detectar movimiento y retención predeterminada de 7 días.
Las pruebas de portón quedan fuera del piloto solicitado.

## Estado comprobado

Implementados: inventario con contextos inmutables, permisos propios de cámaras,
alta guiada y activación tras comprobar video H.264 en MediaMTX, player Angular WHEP/WebRTC,
sesiones temporales, cierre desde servidor, eventos, índice de grabaciones por
fecha, URLs S3 temporales, captura FFmpeg por movimiento y reintentos durables.

Validación local: regresión del backend aprobada; compilación Angular de desarrollo
y comprobación de templates estrictos aprobadas; 18 pruebas focalizadas de cámaras,
captura, uploader, configuración y firma S3 aprobadas; cuatro casos con MongoDB replica
set aislado aprobados; Compose validado sin iniciar servicios.
Las firmas S3 se verificaron localmente con credenciales ficticias. No se hicieron
llamadas a APIs AWS, ni se crearon buckets, políticas, certificados o contenedores.

No está probado el video real, su reproducción en móvil, el movimiento del DVR,
la conectividad remota, TURN ni el despliegue Linux. No existe descubrimiento ONVIF
automático ni detector Hikvision implementado: el protocolo ONVIF es metadata del
inventario. El asistente configura el stream por RTSP con datos introducidos por
el cliente; la sincronización entrega la conexión al gateway sin editar fuentes
manualmente por cada cámara. El gateway requiere instalación y vínculo inicial.

## Registro guiado desde la plataforma

1. **Ubicación:** nombre y gateway activo de la unidad o área común autorizada.
2. **Equipo:** cámara IP o DVR/NVR, marca, modelo, firmware opcional y canal.
   Se admite cualquier marca y “Desconocido”; son datos declarados, no una
   certificación de compatibilidad ni identificación automática del modelo.
3. **Conexión:** IPv4 privada RFC1918, puerto, ruta de video, usuario y contraseña.
   Solo el gateway contacta al equipo; el backend no conecta a la LAN del cliente.
   No se aceptan DNS, IP pública, loopback o metadata de infraestructura en este piloto.
4. **Revisión:** el cliente indica si ofrece eventos (sí/no/no sabe) y guarda.
   Puede repetir el alta para varios canales o cámaras del mismo gateway.
5. **Comprobar video:** después de sincronizar, MediaMTX debe reportar online y
   H.264. Otro codec o un codec sin identificar no activa la cámara; se pide
   configurar H.264 en el equipo. No sustituye una reproducción real.

Para Hikvision se sugieren rutas principal/secundaria según canal usando el
[formato publicado por el fabricante](https://supportusa.hikvision.com/support/solutions/articles/17000129024-do-you-have-an-example-showing-the-format-for-getting-a-rtsp-stream-from-a-nvr-dvr-).
Una sugerencia no demuestra que el modelo o firmware la acepte.

No recibir eventos no prueba que el dispositivo carezca de ellos: pueden faltar
activación o integración. La app muestra UNVERIFIED hasta admitir un evento real
de movimiento (CONFIRMED). Si el cliente declara que no ofrece eventos, se guarda
UNAVAILABLE y recordingMode NONE; puede usar live sin grabación y corregir la
declaración/conexión después. YES declarado tampoco se muestra como verificado.
El detector nativo sigue pendiente de integración con el DVR real.

Las credenciales se cifran en backend con AES-256-GCM e identidad de cámara como
AAD. `sealedConnection` y el HMAC de idempotencia tienen select:false; los DTOs,
el historial y la auditoría no los incluyen. La clave base64 de 32 bytes se
mantiene en el gestor de secretos separado de MongoDB y de su backup. Conservar
esa clave para recuperar conexiones; no rotarla eliminando la anterior sin
migración controlada. El navegador no recupera una contraseña guardada.

`POST /api/cameras/:id/setup` reemplaza la conexión autorizada y devuelve la cámara
a PROVISIONING para comprobarla de nuevo. No cambia su contexto ni gateway.
La sincronización usa `POST /api/internal/cameras/configuration`, clave de servicio
vinculada a la identidad del gateway, respuesta no-store y páginas de 50. No se
entregan fuentes de otro gateway/contexto ni credenciales de cámaras deshabilitadas.

Deshabilitar retira la fuente del gateway. Reconectar una cámara guiada deshabilitada
la devuelve a PROVISIONING usando la conexión protegida existente; no obliga a
mostrar/reintroducir la contraseña. Todavía exige volver a comprobar el video.

El agente con mediaControl configurado consulta cada 15 segundos y aplica paths
por la API loopback de MediaMTX con record:false. Recupera paths tras reinicios;
elimina los explícitamente deshabilitados/revocados del snapshot. Si falla la red
conserva su configuración; no interpreta una respuesta incompleta como permiso
para borrar fuentes. Live comprueba también gateway ACTIVE en cada autorización
y renovación. Sigue siendo un piloto de una identidad de servicio, no un servicio
multi-gateway desplegado.

Verificación visual: Playwright con APIs ficticias en 1280px y 390px, sin overflow
horizontal, ruta sugerida por canal, registro sin eventos, video pendiente y
contraseña vacía al editar. Capturas locales en tmp; sin video real.

## Fronteras de acceso

Alcance confirmado por el usuario: ADMIN controla áreas comunes de su condominio;
OWNER controla el área privada de la unidad que le pertenece. Una prueba Mongo
aislada verifica cada permiso de cámaras contra unidad propia, unidad ajena,
área común y ADMIN con scope ALL, además de denegar acceso al retirar la asociación
del propietario. Esta prueba obtiene los permisos reales mediante
`resolveAccessContext`, sin añadir permisos simulados al OWNER. La habilitación de
`cameras.read`, `cameras.manage`, `cameras.live` y `cameras.recordings.read` en
`SELF_SERVICE_PERMISSIONS.OWNER` fue autorizada explícitamente por el usuario y
aplicada al código. Se mantiene el scope de ADMIN, la denegación de sus accesos
a unidades privadas y el acceso de Family.

- `cameras.read`, `cameras.manage`, `cameras.live` y `cameras.recordings.read` son
  permisos independientes. `iot.read` no concede acceso a video.
- El contexto se deriva de registros vigentes. Administradores del condominio
  gestionan áreas comunes; no obtienen cámaras privadas de unidades ajenas.
- OWNER asociado a una organización recibe los cuatro permisos de cámaras,
  siempre sujetos a la propiedad vigente y al contexto privado del recurso.
  El contexto separado PERSONAL_OWNER conserva sus permisos anteriores.
  Family no recibe acceso por defecto.
- El navegador recibe un token exclusivo de video, no la URL RTSP, sus claves ni
  el token de sesión de la app. El endpoint WHEP debe usar HTTPS.
- Live: máximo cuatro slots por actor, token de 60 segundos, renovación mientras
  conserva acceso y límite total de sesión de diez minutos. Un cierre incierto
  mantiene ocupado el slot hasta confirmar el cierre en MediaMTX.
- El worker revisa lotes de 100 sesiones cada cinco segundos, con cursor rotativo.
  La latencia de revocación aumenta con el número de sesiones y fallos de red;
  no se garantiza cierre inmediato de una conexión WebRTC ya establecida.
- Playback comprueba permisos y expiración antes de emitir una URL de hasta 60
  segundos. Una URL ya emitida sigue vigente hasta su vencimiento; una copia
  descargada no puede revocarse.

## Datos necesarios para conectar el primer canal

Confirmar modelo y firmware del DVR/NVR, IP LAN, canal y URL RTSP, disponibilidad
de H.264 en un stream de prueba, mecanismo de eventos de movimiento y equipo Linux
siempre encendido en la misma red. Las credenciales se instalan en archivos privados
del gateway o mediante el asistente HTTPS; no se envían por chat ni se versionan.

También hacen falta el dominio HTTPS de video, origen HTTPS de la app, ruta privada
de control desde el backend al gateway, conectividad ICE/TURN y límite de gasto.
Un túnel HTTP para señalización no garantiza por sí solo conectividad WebRTC.
No publicar RTSP, la API administrativa de MediaMTX ni el hook de movimiento.

## Backend

La API se monta bajo `/api`; `CAMERAS_ENABLED` está desactivado por defecto.
MongoDB debe soportar transacciones y los índices únicos de los nuevos modelos.
Gateway ACTIVE y mapping AWS SYNCED son requisitos de la ingesta; no marcarlos
como sincronizados para simular un despliegue inexistente.

Configurar en el gestor de secretos/entorno de despliegue:

| Variable | Valor o propósito |
| --- | --- |
| `CAMERAS_ENABLED` | `true` después de configurar el piloto |
| `AWS_REGION` | `us-east-1` |
| `CAMERA_RECORDINGS_BUCKET` | bucket privado creado para el piloto |
| `CAMERA_RECORDINGS_BUCKET_OWNER` | `337647889342`, verificar identidad antes del despliegue |
| `CAMERA_MEDIA_GATEWAY_ID` | ID Mongo del único gateway del piloto |
| `CAMERA_WHEP_ORIGIN` | origen HTTPS del proxy WHEP, sin credenciales |
| `CAMERA_MEDIA_CONTROL_ORIGIN` | origen privado de la API MediaMTX, puerto 9997 |
| `CAMERA_MEDIA_CONTROL_USER` | usuario técnico del control MediaMTX |
| `CAMERA_MEDIA_CONTROL_PASSWORD` | secreto independiente, mínimo 32 caracteres |
| `CAMERA_MEDIA_AUTH_SERVICE_KEY` | secreto independiente para proxy de autenticación |
| `CAMERA_INGEST_SERVICE_KEY` | secreto independiente para uploader del gateway |
| `CAMERA_INGEST_THING_NAME` | identidad del gateway vinculada al mapping persistido |
| `CAMERA_CONNECTION_ENCRYPTION_KEY` | clave aleatoria de 32 bytes codificada base64, para el asistente |
| `DISABLE_SCHEDULED_JOBS` | no debe ser `true` al habilitar live |

Los endpoints `/api/internal/camera-media/auth` y `/api/internal/cameras/*` deben
quedar tras HTTPS privado/VPN o mTLS y controles de red. El piloto utiliza claves
de servicio vinculadas por configuración a un solo gateway; no es un reemplazo
de MQTT mTLS ni un mecanismo multi-gateway. No registrar headers Authorization,
claves de servicio, URLs firmadas ni fuentes RTSP en logs del proxy.

La plantilla `infra/aws/camera-storage.json` prepara un bucket privado, cifrado
AES256, TLS obligatorio y lifecycle de siete días. Su política GetObject/PutObject
solo cubre `camera/*`; se adjunta al rol del backend, nunca automáticamente al
usuario codex-local ni al gateway. El gateway recibe permisos temporales por
objeto. La plantilla está preparada, **no desplegada**.

La API corta acceso siete días después del evento. S3 calcula lifecycle desde
la creación del objeto y elimina de forma asíncrona; una carga tardía puede durar
más físicamente. No afirmar borrado físico exacto a las 168 horas. Los registros
de auditoría y los tombstones locales tienen retención independiente.

## Gateway Linux

`edge/camera.compose.yml` contiene MediaMTX 1.21.1, el proxy de autenticación y
el agente de captura. Usa networking del host Linux. El estado persistente y los
archivos privados deben pertenecer al UID 1000 del contenedor y estar restringidos.
Ejecutar un solo recorder por volumen de estado.

1. Registrar/vincular el gateway mediante las APIs autorizadas. Con el asistente
   y sincronización no hace falta crear una fuente manual por cámara; las fuentes
   legacy pueden seguir usando `GET /api/cameras/:id/configuration`.
2. Crear fuera del repositorio un JSON privado de entrada para
   `node edge/mediamtx/render-config.js <entrada-privada> <mediamtx.json>`.
   Campos: `sources: []` para registro guiado (o fuentes legacy explícitas), `appOrigins` HTTPS,
   `additionalHosts` alcanzables por los clientes e `iceServers` con configuración
   de TURN adecuada. El render falla si el archivo de salida ya existe.
3. Crear `media-auth.json` privado con `apiOrigin` (HTTPS incluyendo `/api`) y
   `serviceKey` igual a `CAMERA_MEDIA_AUTH_SERVICE_KEY`.
4. Crear `camera-agent.json` privado con `stateDirectory` igual a
   `/var/lib/comunard-camera`, `motionSourceKey` independiente de al menos 32
   caracteres, `channels` (canal local a ID de cámara), `cameras` (ID a
   `{enabled: true, rtspSource}`), y `backend: {apiOrigin, serviceKey, bucket}`.
   La clave backend coincide con `CAMERA_INGEST_SERVICE_KEY`. `storage` permite
   ajustar presupuesto de spool, cantidad máxima y espacio libre mínimo.
5. Definir `CAMERA_PRIVATE_CONFIG_DIRECTORY` y `CAMERA_STATE_DIRECTORY` en el
   host. Validar con `docker compose -f edge/camera.compose.yml config --quiet`.
   Build/start solo después de revisar configuración y dimensionar el piloto.
6. Conectar el detector nativo del DVR o un detector local certificado al hook
   `POST http://127.0.0.1:8079/motion`, header `x-comunard-motion-key`, cuerpo
   `{channel, sourceEventId, occurredAt}`. El timestamp debe ser UTC ISO canónico
   y el evento fresco. Este hook no es para el navegador ni para internet.
7. Instalar proxy HTTPS WHEP hacia loopback 8889 que conserve Authorization,
   SDP, OPTIONS/POST/DELETE, Location y los headers CORS/ICE necesarios. Configurar
   UDP 8189 o TURN según la topología, y ruta privada de control a loopback 9997.
8. Activar desde la app con “Comprobar video”. MediaMTX debe reportar el path
   online y video H.264. No certifica reproducción móvil ni acceso desde internet.

Para sincronización, añadir `mediaControl: {controlUser, controlPassword}` al JSON
privado del agente, coincidiendo con las credenciales del control del backend.
`controlOrigin` solo admite `http://127.0.0.1:9997`. `channels` y `cameras` pueden
iniciar como `{}`; las cámaras registradas se añaden automáticamente.
Los detectores usan el ID de cámara como channel del hook para evitar colisiones
entre distintos DVR con el mismo número de canal. `bucket` puede omitirse en
backend del agente si el despliegue es solo live; grabar/subir requiere S3.

No hay grabación continua de MediaMTX (`record: false`). El recorder inicia un
clip de 30 segundos por movimiento, sin pre-roll; otro movimiento durante ese
clip no extiende su duración. FFmpeg copia video sin audio y exige un archivo
válido de aproximadamente 30 segundos; bitrate/codec/límite de tamaño deben
verificarse con el canal real. El spool reserva hasta 32 MiB por clip por defecto,
con presupuesto 512 MiB; lleno rechaza nuevas capturas y conserva pendientes.

El uploader comprueba bytes/hash local, pide permiso por objeto y el backend
verifica tamaño y SHA-256 con HEAD antes de marcar AVAILABLE. Solo entonces
borra el MP4 local; conserva recibos para deduplicación. Una captura incierta
no se repite automáticamente. Un lock residual exige detener agentes y revisar
el estado antes de recuperarlo manualmente; no borrar la cola para liberar espacio.

La búsqueda y la hora mostrada usan `occurredAt` del movimiento, incluso si el
clip se carga al día siguiente. `createdAt` conserva la fecha de indexación.

## Única aceptación real necesaria para este piloto

Con el DVR y el gateway definidos: reproducir un canal desde otra red en escritorio
y móvil con usuario autorizado; confirmar denegación con usuario ajeno; revocar
acceso y verificar cierre; provocar un movimiento y comprobar clip de 30 segundos,
fecha y playback; una interrupción/reintento debe conservar un único evento.
No hacer pruebas de portón ni crear cámaras extra para este piloto.

## Referencias de configuración

La autenticación y el formato de MediaMTX siguen su
[documentación oficial](https://mediamtx.org/docs/features/authentication) y la
[API de la versión fijada](https://raw.githubusercontent.com/bluenviron/mediamtx/v1.21.1/api/openapi.yaml).
La verificación de objetos utiliza
[HeadObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html)
y las cargas condicionales usan
[PutObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html).
