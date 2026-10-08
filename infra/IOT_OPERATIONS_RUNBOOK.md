# E6 — procedimiento de operación preparado, pendiente de validación

Este procedimiento sirve para preparar el piloto. No acredita un despliegue ni
implementa alarmas/tareas automáticas. La conexión física DVR/gateway queda
aplazada por instrucción del usuario. No ejecutar pruebas del portón.

## Diagnóstico con una sola reproducción

Registrar hora UTC, contexto, gateway/dispositivo/cámara, versión de agente y
configuración, último recibo de aplicación y código de fallo. Nunca adjuntar
RTSP con credenciales, certificados, tokens de video ni cuerpos de configuración.
Crear o actualizar el mismo ticket del incidente con esa evidencia; las
referencias automáticas a ThingsBoard y la unicidad por alarmId siguen pendientes.

| Síntoma | Evidencia y acción | Criterio de recuperación |
| --- | --- | --- |
| Gateway sin salud reciente | Comparar último heartbeat admitido con reloj y conexión del equipo; comprobar cola pendiente y backoff | Heartbeat nuevo admitido, secuencia creciente; no basta un PUBACK |
| Cola bloqueada/llena | Comprobar almacenamiento libre y presupuesto del spool; detener productores antes de investigar locks residuales | Una admisión nueva sin repetir actuadores; conservar historia y secuencias |
| Cámara sin video | Comprobar binding/configVersion y una sola inspección de path; corregir canal y codec si falla | Path listo H.264 y reproducción por usuario autorizado cuando haya hardware |
| Video local funciona, externo falla | Revisar HTTPS y ICE/TURN en el despliegue pendiente | Una sesión desde internet; evitar reinicios y nuevas sesiones repetidos |
| No hay clip | Distinguir ausencia de evento de fallo de captura o upload; consultar intención, checksum y recibo | Evento único, clip de 30 s AVAILABLE y consulta dentro de retención |
| Zigbee no reporta | Verificar binding, profileVersion, last_seen, retain y código de rechazo | Un reporte físico reciente admitido, no availability ni caché |
| Usuario ve acceso denegado | Comprobar permiso y propiedad vigente del contexto; reasignación requiere flujo auditado | Acceso en contexto propio y denegación cruzada sin ampliar permisos |

Un proceso detenido con lock residual requiere detener **todas** sus instancias
antes de una recuperación manual supervisada. No borrar la cola, recibos ni el
contador para hacer desaparecer un fallo. No reejecutar automáticamente un
comando cuyo resultado sea incierto.

## Registro de certificación por modelo

Registrar fabricante, modelo, firmware, protocolo, perfil/versión, capacidades,
unidades, intervalo de reporte, prueba física y limitaciones. Usar EXPERIMENTAL
hasta disponer de evidencia; SUPPORTED/CERTIFIED requieren resultados del
piloto, y UNSUPPORTED impide admisión. La lista de equipos del bridge y una
traducción de campos no constituyen certificación.

Para cámaras registrar DVR/canal, codec, visualización externa y si el evento de
movimiento fue confirmado. Ausencia de eventos no demuestra incompatibilidad.
Para grabación validar una captura por movimiento de 30 s y expiración lógica
a los siete días; la eliminación S3 depende del lifecycle desplegado.

## Cierre y pendientes

Un incidente se cierra con evidencia de recuperación y su causa/corrección,
conservando IDs y fechas. En staging validar primero un fallo reproducible sin
crear infraestructura adicional. Permanecen pendientes: automatización
alarma→tarea idempotente, enlace autorizado a dashboards, catálogo comercial,
planes/límites de gasto y validación de este runbook con equipos reales. No hay
presupuesto mensual acordado ni aprovisionamiento AWS ejecutado aquí.
