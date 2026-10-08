# E5 — frontera de reportes Zigbee

`state-adapter.js` es una frontera local de validación; no abre sockets, no
descubre/asigna dispositivos ni ejecuta acciones. No está conectado al agente
desplegado. Los cuatro casos de prueba usan exclusivamente mensajes ficticios.

## Vinculación y configuración

La configuración confiable debe proporcionar gatewayId y, por dispositivo,
resourceId, ieeeAddress, friendlyName exacto, deviceType, profileVersion, profile
y fields (campo Zigbee → campo del perfil). El servicio que instale esta
configuración debe comprobar propiedad, gateway activo y binding vigente. Un
mensaje `bridge/devices` nunca constituye autorización ni certificación.
El adaptador solo admite nombres de un segmento; nombres con `/` requieren
renombrarse y actualizar el binding auditado antes de este piloto.

Ejemplo de traducción para WATER_SENSOR: `water_leak → waterDetected` y
`battery → battery`; LIGHT puede usar `state → power` con valores ON/OFF.
Son traducciones de campos, **no modelos certificados**. La correspondencia se
debe comprobar contra los exposes del modelo y firmware reales; no convierte
un booleano o unidad arbitraria a un tipo esperado.

Para este contrato, configurar Zigbee2MQTT así antes de conectarlo:

```yaml
advanced:
  output: json
  last_seen: ISO_8601
  cache_state: false
  cache_state_send_on_startup: false
```

El cliente MQTT debe entregar a `observe(topic, bytes, { retain })` el indicador
real del paquete; no debe inventar `retain: false`. Mantener ACL del broker que
permita publicar los topics de reportes exclusivamente al bridge autorizado.
El topic identifica el binding instalado, no demuestra por sí mismo la IEEE
del emisor; la confianza depende también de la configuración/ACL del bridge.
Ver [topics oficiales](https://www.zigbee2mqtt.io/guide/usage/mqtt_topics_and_messages.html)
y [settings oficiales](https://www.zigbee2mqtt.io/guide/configuration/all-settings.html).

## Resultado y límites

`OBSERVED` devuelve gatewayId, resourceId, profileVersion, occurredAt y payload
parcial validado. El timestamp proviene de last_seen UTC, con máximo cinco
minutos de antigüedad y sin fechas futuras. Retained, availability, discovery,
topics desconocidos y mensajes sin estado no actualizan presencia. Datos
malformados o fuera de perfil producen un error con código, sin registrar el
payload. Los campos extra se descartan y no asignan contexto ni commandId.

El siguiente componente, aún pendiente, debe reservar secuencia e ID estables,
persistir un envelope antes del envío y reintentar ese mismo envelope hasta el
recibo de admisión. Este módulo **no** proporciona esa cola ni transforma
OBSERVED en APPLIED/EXECUTED. Backend conserva su autorización por identidad
autenticada, contexto y binding al ingerir; no acepta identidad del payload.

Al revocar o cambiar un binding, detener la suscripción y sustituir la instancia
con configuración actualizada; la sincronización remota sigue pendiente. Pairing
acotado, comandos, feedback, transporte MQTT autenticado y validación de 3–5
equipos físicos siguen pendientes. Sensores con intervalos superiores a cinco
minutos requieren una política de salud por perfil antes de certificarse;
no ampliar globalmente la frescura de comandos para resolver ese caso.

Prueba local: `node --test edge/adapters/zigbee/tests/*.test.js` desde la raíz.
