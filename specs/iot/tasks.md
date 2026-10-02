# IoT / Smart Devices - Tasks

## Estados

`[ ]` Pending · `[~]` In Progress · `[x]` Completed · `[!]` Blocked

Una tarea Fase 0 puede marcarse completa si solo produce discovery/documentación. Una historia funcional solo se marca `[x]` tras tests passing, autorización revisada, manejo de errores y criterios de aceptación comprobados. Fases futuras quedan pendientes hasta cerrar la fase actual.

## Fase 0 - Discovery (completada)

- [x] Revisar Express/API, JWT, resolución de contexto y RBAC.
- [x] Identificar Organization, Condominium, Owner, Family y relaciones de unidad; excluir el modelo `Property` del diseño IoT.
- [x] Verificar stack ORM/DB, frontend, suscripción/billing, AWS, auditoría, logging, variables de entorno y tests.
- [x] Registrar hallazgos, limitaciones y decisiones abiertas en `requirements.md`, `design.md` y `authorization.md`.
- [x] Crear este backlog por fases.
- [x] No modificar código funcional.

**Gate Fase 0:** completado. No se implementó funcionalidad.

## Fase 1 - Requisitos y aceptación (completada en especificación)

- [x] Excluir el modelo `Property` y sus endpoints del contexto IoT.
- [x] Definir Owner personal sin Organization y su contexto de acceso limitado a residencias propias.
- [x] Definir evolución de `Owner.propertyDetails` como relación de ownership para unidad administrada y residencia personal, con identidad persistente.
- [x] Actualizar historias US-IOT-001 a US-IOT-010, criterios de aceptación y requisitos EARS.
- [x] Añadir criterios de cuenta Owner personal y alta de residencia independiente.
- [x] Actualizar matriz de autorización, separación de área común y frontera owner/organization.
- [x] Mantener decisiones de implementación, migración, AWS, auditoría y billing como gates explícitos de Fase 2.

**Gate Fase 1:** requisitos y propuesta de relación consolidados; ninguna historia funcional está completa. Fase 2 documenta el diseño, sin ejecutar migraciones ni cambios funcionales.

## Fase 2 - Modelo de datos y diseño técnico (completada en especificación)

- [x] Definir `Condominium.units[]` con IDs estables y conservar `availableUnits` durante la transición.
- [x] Definir asociaciones `Owner.propertyDetails[]` tipadas, IDs estables, Owner personal sin Organization y límites de auth.
- [x] Definir migración idempotente/dry-run, backfill de unidades y asociaciones, conciliación y dual-write.
- [x] Definir esquema `IoTDevice`, invariantes por scope, índices, estados y borrado lógico.
- [x] Definir `IoTSubscription` por contexto, denegación por ausencia, límite y reserva de cuota atómica; billing queda diferido.
- [x] Definir `IoTAuditEvent` inmutable sin debilitar `AuthorizationAudit` existente.
- [x] Definir métodos y frontera de `IoTAuthorizationService` con `service/authorization.js`.
- [x] Definir contrato/control-plane inicial de `IoTProvider`, SDK AWS v3 y mocks de tests.
- [x] Definir saga, idempotencia, estados reintentables y reconciliación AWS/Mongo.
- [x] Documentar threat model, protección de credenciales y gates de despliegue.

**Gate Fase 2:** modelo y diseño técnico documentados; no se modificaron modelos, APIs ni autenticación. El despliegue queda bloqueado hasta resolver ambigüedades de datos y provisionar entitlement/AWS de forma operativa.

## Fase 3 - MVP (implementación en progreso)

- [~] US-IOT-007: servicio central y deny-by-default por contexto; falta validación API con Mongo migrado.
- [~] US-IOT-002: alta Thing/idempotencia/entitlement implementados; pendiente ejecución contra AWS real.
- [~] US-IOT-004 / US-IOT-005: listado/detalle/Shadow aislados y sanitizados; falta prueba API con datos migrados.
- [~] Desvincular con baja lógica, cuota transaccional y reconciliador reintentable.
- [~] US-IOT-001 / US-IOT-003: dashboard y selector Angular compilados; falta E2E autenticado.
- [x] Rutas REST, servicio Angular y onboarding personal están conectados.
- [~] Unit tests de autorización/provider/modelos/migración pasan; hay contratos de controlador para aislamiento de residencia y Shadow, pero faltan tests API multi-tenant completos contra Mongo migrado.
- [!] IAM real, backfill de base y SMTP requieren configuración/revisión humana.
- [~] Runbook operativo se actualizará tras resolver gates de AWS/billing.

## Fases posteriores (diseño ahora, implementación por gate)

### Fase 4 - Device Shadow (implementado, AWS real pendiente)

- [x] Provider server-side Get/Update Shadow, sanitización por capability, conectividad/lastSeen y tests mock.
- [~] Autorización central y detalle de estado; falta probar con Thing AWS real.

### Fase 5 - Dashboard Smart Home (UI implementada)

- [x] Selector multi-contexto, dashboard, métricas, controles, detalle y alertas acknowledgeables.
- [~] Build Angular pasa; falta Playwright/E2E autenticado y revisión visual móvil.

### Fase 6 - Capabilities y comandos (allowlist implementada)

- [x] Definitions por tipo y comandos allowlist con rangos validados server-side.
- [x] Tests de comandos permitidos, inválidos y capabilities read-only.
- [~] Falta versionar capabilities para hardware/protocolos físicos.

### Fase 7 - Alertas (in-app implementado)

- [x] Eventos tipados, deduplicación por Shadow version, inbox por scope y acknowledgement.
- [~] Email/push/WhatsApp no conectados; faltan canales y política de retención aprobados.

### Fase 8 - Automatización (scaffold seguro; ejecución desactivada)

- [x] Modelo draft y evaluación determinista; mismo scope y comandos allowlist.
- [x] Rules nuevas quedan `DRAFT`/disabled; tests rechazan cross-scope.
- [!] No hay executor/worker; no activar reglas hasta revisión operativa/seguridad.

### Fase 9 - Subscription y billing (entitlement manual; checkout pendiente)

- [x] Entitlement y deviceLimit por contexto; deniega altas sin plan y reserva/libera cuota atómicamente.
- [x] Provisión manual solo SUPERUSER, con referencia validada desde Mongo.
- [!] Checkout, precio, moneda, recurrencia, cancelación y periodo de gracia requieren decisión humana de negocio/proveedor.

## Riesgos / dependencias

- `[x]` Owner personal sin Organization tiene login/contexto mínimo y tests unitarios; falta E2E en entorno autenticado.
- `[!]` Dry-run de migración verificado: 30 condominios seguros, 2,749 unidades, 20 asociaciones y 0 incidencias. La ejecución `--apply` sigue requiriendo revisión y aprobación humana.
- `[!]` Entitlement manual existe; checkout/billing recurrente no existe y requiere precio/proveedor/política aprobados.
- `[x]` `IoTAuditEvent` y `IoTDeviceEvent` están implementados con tests de scope/inmutabilidad.
- `[!]` AWS real requiere cuenta/región/IAM role y permisos revisados; no se hizo ninguna llamada AWS.
- `[!]` SMTP debe estar configurado para verificar cuentas Owner personales.
- `[!]` Reglas automáticas permanecen draft/disabled hasta desplegar y revisar executor.
- `[~]` Faltan E2E autenticados y pruebas API contra Mongo migrado.

## Definition of Done para cada fase

- Historias/criterios de la fase se verifican por pruebas reproducibles.
- Autorización es server-side, contextual y testeada contra recursos de otros usuarios/tenants.
- Fallos externos/locales se representan sin estados parciales exitosos ni secretos en logs/respuestas.
- Documentación y variables de despliegue están actualizadas; migraciones son compatibles y revisables.
- Se presenta informe Kiro de fase y se detiene antes de iniciar la siguiente.
