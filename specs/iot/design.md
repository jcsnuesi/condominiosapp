# IoT / Smart Devices - Diseño

## Estado y alcance

Fases 0-2 documentaron el diseño. Fases 3-9 tienen implementación incremental en el backend/frontend existente; este diseño describe el contrato actual y sus gates pendientes. No se crea una arquitectura de autenticación, datos o frontend paralela.

## Arquitectura existente observada

- **Backend/API:** `backend/app.js` registra routers Express bajo `/api`; `backend/index.js` carga dotenv, conecta Mongoose/MongoDB y escucha HTTP. Middleware compartido incluye `authenticated`, `responseContract` y Morgan (`dev`).
- **Autenticación:** `backend/middleware/auth.js` valida JWT y resuelve `req.auth`. Owner sin Organization activa puede recibir `PERSONAL_OWNER` solo si está activo, verificado y tiene residencia personal; ese contexto se limita a perfil y rutas IoT. Los IDs del token no reemplazan las relaciones actuales de Mongo.
- **Autorización:** `backend/service/authorization.js` compone Organization, role, permisos y scope. `AccessPolicy`/`AccessGrant` sirven a personal administrativo; `backend/middleware/organizationAuth.js` exige mapeo de permisos a Staff/Staff_Admin.
- **Datos de residentes:** MongoDB/Mongoose. `Owner.propertyDetails` y `Family.propertyDetails` son subdocumentos de asociaciones a `Condominium`; el nombre de unidad es texto (`condominium_unit`/`unit`) y no tiene `_id`. `Condominium.units_ownerId` también mantiene referencias de propietario/estado. Helpers activos están en `backend/service/residentPropertyAccess.js`.
- **Contexto de administración:** `Condominium` referencia `Organization`. La Organization representa al administrador/tenant del condominio; no debe ser requisito de existencia para una residencia personal de un Owner.
- **Identidad:** No existe `Tenant` model. `Family` es una cuenta distinta vinculada a Owner; `Occupant` no está en `ACCOUNT_MODELS` y no debe asumirse autenticable.
- **Frontend:** Angular 21 añade Smart Home como feature lazy y alta de Owner personal usando `UserGuard`, `AuthInterceptor` y el servicio HTTP actual. La autorización final sigue en backend.
- **Billing/AWS:** Existen modelos IoT, entitlement manual por contexto y provider AWS SDK v3. No existe checkout/billing recurrente IoT; AWS real está sin cuenta/región/IAM verificados.
- **Auditoría/eventos:** `AuthorizationAudit` permanece intacto. `IoTAuditEvent` guarda acciones y `IoTDeviceEvent` guarda alertas scoped; ninguno debe almacenar secretos o telemetría de alta frecuencia.
- **Configuración:** `.env` documenta MongoDB, JWT, origins y SMTP; no hay configuración AWS. No consultar ni copiar valores de `.env` real a documentación. AWS deberá usar IAM role/credenciales del entorno de backend, nunca Angular.
- **Validación actual:** backend usa `node:test` (`pnpm --dir backend test` desde raíz o ejecutado dentro de `backend`); ya existen pruebas de aislamiento del helper de acceso de residentes.

## Mapeo y decisiones de Fase 2

| Contexto                      | Fuente/representación                                                                                          | Invariantes                                                                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Organization / tenant         | `Organization` derivada de `Condominium`                                                                       | Solo existe para condominios administrados; nunca es autoridad enviada por frontend.                                                                                 |
| Condominio administrado       | `Condominium` con `organizationId` requerido                                                                   | El alcance organizacional se deriva del condominio persistido.                                                                                                       |
| Unidad física del condominio  | Subdocumento `Condominium.units[]` con `_id` estable y etiqueta                                                | `unitId` es la identidad; la etiqueta es presentación. `availableUnits` queda como proyección compatible temporal, no como catálogo/autorización.                    |
| Relación del Owner con unidad | `Owner.propertyDetails[]` con `_id` de asociación, `addressId` y `unitId`                                      | Validar cuenta Owner activa, asociación vigente, condominio y misma unidad estable. No usar el `organizationId` global del Owner para decidir el tenant del recurso. |
| Residencia personal           | Variante de `Owner.propertyDetails[]`, con `_id`, tipo `PERSONAL_RESIDENCE`, etiqueta/estado y sin `addressId` | Pertenece solo al Owner; no crea `Condominium` ni `Organization`.                                                                                                    |
| Acceso familiar               | `Family` + `createdBy` + asociación vigente del Owner                                                          | Se excluye de la primera entrega IoT salvo autorización/grant explícito posterior.                                                                                   |
| Área común                    | `Condominium` + contexto `COMMON_AREA`                                                                         | Requiere permiso IoT de área común y scope administrativo; no permite ver unidades privadas.                                                                         |

La relación legacy estaba embebida con `_id: false`; el esquema actual asigna `_id` y tipo explícito (`CONDOMINIUM_UNIT` o `PERSONAL_RESIDENCE`). Las unidades físicas usan `Condominium.units[]`; la migración incluida mantiene dry-run por defecto y el código IoT deniega asociaciones sin `unitId` estable.

`Owner.organizationId` pasa a opcional para cuentas personales y se conserva como dato legacy durante la migración. `resolveAccessContext()` y login reconocen un Owner activo sin organización y emiten un contexto `PERSONAL_OWNER` mínimo. El middleware de autenticación aplica deny-by-default para ese contexto, permitiendo solo rutas personales IoT explícitamente registradas y perfil/autenticación. Rutas organizacionales existentes requieren contexto organizacional y deben fallar cerradas. Para unidad administrada, la Organization se obtiene desde el Condominium, no desde el Owner.

El dispositivo referencia un discriminador de contexto y una identidad estable: `CONDOMINIUM_UNIT` refiere a Condominium + `unitId`; `PERSONAL_RESIDENCE` refiere a Owner + `residenceId`; `COMMON_AREA` refiere a Condominium + Organization. Para unidad administrada, cualquier Owner con relación activa a esa misma unidad puede autorizarse; `createdBy` es auditoría, no ownership. Un cambio de propietario no transfiere dispositivos personales; los dispositivos de la unidad permanecen en la unidad física y su acceso se recalcula desde relaciones actuales.

## Modelo de datos objetivo

### `Condominium`

- Añadir `units[]`: subdocumento `{ _id, label, normalizedLabel, status, availability }`; `availability` es `AVAILABLE` o `ASSIGNED`. `normalizedLabel` debe ser único en el condominio; validarlo mediante actualización condicional porque un índice multikey no garantiza unicidad dentro del mismo documento.
- `availableUnits: string[]` se conserva temporalmente por compatibilidad y se dual-write desde `units`; una transacción cambia disponibilidad y crea/elimina asociación Owner para impedir reservas simultáneas. Deja de ser fuente de verdad tras la migración.
- Organization continúa requerida para todo Condominium.

### `Owner`

- `organizationId` se vuelve opcional, pero no se elimina durante la transición; cuentas y endpoints legacy mantienen compatibilidad.
- `propertyDetails[]` obtiene `_id`, `contextType`, `unitId` opcional y `residenceLabel` para contextos personales. Para `CONDOMINIUM_UNIT`, `addressId` referencia Condominium y `unitId` identifica un elemento de `Condominium.units`; se conserva `condominium_unit` como etiqueta legacy. Para `PERSONAL_RESIDENCE`, `addressId` y `unitId` son nulos y `_id` identifica la residencia.
- Validación condicional: campos de condominio/unidad requeridos solo para `CONDOMINIUM_UNIT`; defaults personales no deben invalidar documentos previos. La API IoT no permite convertir residencia personal en unidad administrada.
- Conservar campos contractuales existentes y definir defaults válidos para residencia personal (`parkingsQty`, fechas y estado) sin invalidar documentos previos.
- El índice existente por `organizationId/status` admite ausencia de organization; email/phone mantienen unicidad global.

### `IoTDevice`

Campos propuestos: `_id`, `displayName`, `awsThingName` (único global), `deviceType`, `location`, `scopeType`, refs contextuales, `createdBy`, `status`, `metadata` allowlisted, `capabilities` derivadas del backend, `enabled`, `quotaReserved`, `createdAt`, `updatedAt`, `deletedAt`, `idempotencyKey`.

`scopeType` es uno de `CONDOMINIUM_UNIT`, `PERSONAL_RESIDENCE`, `COMMON_AREA` y valida exactamente una variante:

| `scopeType`          | Campos requeridos                           | Campos prohibidos                           |
| -------------------- | ------------------------------------------- | ------------------------------------------- |
| `CONDOMINIUM_UNIT`   | `organizationId`, `condominiumId`, `unitId` | `ownerId`, `residenceId`                    |
| `PERSONAL_RESIDENCE` | `ownerId`, `residenceId`                    | `organizationId`, `condominiumId`, `unitId` |
| `COMMON_AREA`        | `organizationId`, `condominiumId`           | `ownerId`, `residenceId`, `unitId`          |

Para variantes administradas, `organizationId` se deriva del Condominium y se guarda para filtrado eficiente; un validador de servicio comprueba consistencia. La residencia personal no tiene tenant artificial. `awsThingName` usa UUID generado backend (sin PII ni IDs residenciales); `displayName` es el nombre humano. No aceptar `capabilities`, `organizationId`, ownership ni `awsThingName` del cliente como fuente de verdad.

Estados de creación/baja: `PROVISIONING`, `ACTIVE`, `ERROR`, `DELETING`, `DELETED`. `DELETED` es lógico; listar/autorizar solo estados permitidos. `metadata` tiene allowlist/tamaño máximo y no acepta certificados, keys o secretos.

Índices iniciales:

- Único global en `awsThingName`, incluso en borrado lógico, para no reutilizar Thing Names.
- `{ organizationId, scopeType, condominiumId, unitId, status, createdAt }` para contexto administrado.
- `{ ownerId, residenceId, status, createdAt }` para contexto personal.
- Único `{ createdBy, idempotencyKey }` cuando existe clave; idempotencia repetida retorna la operación original solo al actor autorizado.
- No imponer unicidad de `displayName`; validar referencias y combinaciones de scope en servicio además de validadores Mongoose.

### `IoTSubscription`

Una suscripción/entitlement corresponde a un único contexto IoT, no a toda una Organization: `scopeType`, referencias de unidad/residencia/área común, `plan`, `deviceLimit`, `deviceUsage`, `status`, `billingStatus`, `startedAt`, `renewedAt`, `endsAt`. Índices únicos parciales por contexto (`condominiumId + unitId`, `ownerId + residenceId`, o `condominiumId + COMMON_AREA`); no se crea checkout ni proveedor de billing en Fase 2. Limitar `deviceLimit >= 0` y `deviceUsage >= 0`; uso no puede superar el límite.

El endpoint SUPERUSER provisiona entitlement manualmente; no hay checkout. La ausencia, expiración o suspensión deniega **altas nuevas**, nunca significa ilimitado. Mantener dispositivos existentes accesibles según autorización aunque no se permitan nuevas altas. Reservar capacidad con actualización atómica condicionada a `deviceUsage < deviceLimit`; `quotaReserved` evita doble decremento. El reconciliador libera cuota solo tras completar baja.

### `IoTAuditEvent` y `IoTDeviceEvent`

Colección inmutable de eventos de acción IoT, separada del `AuthorizationAudit` administrativo cuyo `organizationId` es obligatorio. Campos: `scopeType`, `organizationId` opcional, `condominiumId`, `unitId`, `ownerId`, `residenceId`, `deviceId`, `actorId`, `actorRole`, `action`, `success`, `errorCode` clasificado, timestamp, requestId e IP disponible. Los campos no aplicables por contexto quedan nulos. Guardar solo valores/comandos allowlisted y redactados; nunca credenciales, tokens o payloads sensibles. No usarla como telemetría de alta frecuencia.

`IoTAuditEvent` es append-only y registra acciones. `IoTDeviceEvent` separa `device.offline`, `device.online`, `water.detected`, `battery.low`, `temperature.high`, `lock.open` y `energy.threshold`, con dedupe key por Thing/versión de Shadow y estado `NEW/ACKNOWLEDGED`. El umbral energético solo se genera con `metadata.energyThresholdW` explícito. La API exige `VIEW_HISTORY` para consultar/ack; el dashboard devuelve una proyección sin IP ni IDs internos.

## Migración y compatibilidad

1. Añadir esquema de subdocumentos `Condominium.units` y campos opcionales nuevos sin cambiar la lectura de `availableUnits` ni `propertyDetails`.
2. Backfill por Condominium desde `availableUnits` y todas las `Owner.propertyDetails` con `addressId` válido, incluidos vínculos inactivos recuperables. Canonicalizar etiquetas, derivar disponibilidad y resolver colisiones antes de asignar IDs; no descartar filas ambiguas.
3. Backfill de `unitId` en asociaciones Owner por `(addressId, normalizedLabel)` y `_id` de asociación; generar contexto `PERSONAL_RESIDENCE` solo en flujo explícito, no inferir residencia personal de documentos sin condo.
4. Reportar conteos, asociaciones no conciliadas, unidades reclamadas por más de un Owner activo y duplicados; modo dry-run, lotes reanudables e idempotentes. No ejecutar migración destructiva ni iniciar AWS hasta completar reconciliación.
5. Dual-write temporal para altas/cambios entre catálogo de unidades y `availableUnits`; actualizar escritores/lectores existentes antes de retirar el campo legacy. Fase 3 no debe alterar de golpe flujos de administración.
6. El login personal y el guard deny-by-default ya están implementados; mantener el gate hasta verificar mail, prueba de rutas organizacionales denegadas y migración de relaciones.

Índices nuevos deben crearse de forma idempotente y precedidos por auditoría de duplicados. Documentos antiguos permanecen válidos durante el rollout; asociaciones sin `unitId` no autorizan IoT tras el gate de migración.

## Componentes propuestos dentro del backend existente

1. Router Express montado desde `app.js`, cada endpoint con `authenticated`.
2. `IoTController` delgado: parseo/validación de DTO y respuesta usando el contrato común.
3. `IoTService`: coordina autorización, persistencia, provider y auditoría; no acepta ownership declarado por cliente.
4. `IoTAuthorizationService`: métodos `canViewDevice`, `canControlDevice`, `canCreateDevice`, `canUpdateDevice`, `canDeleteDevice`; carga/revalida relaciones y scope una vez por operación. Usa contexto resuelto desde persistencia, no considera `createdBy` como ownership, y deniega asociaciones de unidad ambiguas.
5. `IoTSubscriptionService`: verifica entitlement exacto, vigencia y reserva/libera cuota atómicamente; no permite altas si no hay entitlement. Sin integración de billing hasta Fase 9.
6. `IoTProvider` y `AWSIoTProvider`: adaptador AWS SDK JavaScript v3 server-side. Implementa Thing CRUD y Shadow con `@aws-sdk/client-iot` y `@aws-sdk/client-iot-data-plane`, descubre endpoint `iot:Data-ATS` y permite provider mock explícito en desarrollo/test; nunca credenciales permanentes.
7. Modelos Mongoose `IoTDevice`, `IoTSubscription` e `IoTAuditEvent` según este diseño; índices y validaciones se implementan en Fase 3 con pruebas de integridad.

AWS queda detrás del provider. Thing Name se genera backend como `iot-<uuid>`; atributos contienen solo IDs técnicos y scope. IAM runtime requiere `iot:CreateThing`, `iot:DescribeThing`, `iot:DeleteThing`, `iot:DescribeEndpoint` y para Shadow `iot:GetThingShadow`/`iot:UpdateThingShadow`; limitar Thing ARNs donde AWS lo permita y `DescribeEndpoint` a `Resource: "*"`. No otorgar `ListThings`, certificados/policies ni otros Data Plane actions. `AWS_REGION` y role se configuran en backend; claves/certificados privados nunca se almacenan o envían.

### Consistencia AWS/Mongo

Mongo y AWS no comparten transacción. Alta reserva cuota/guarda `PROVISIONING` e idempotency key antes de crear Thing. El reconciliador periódico reintenta estados pendientes, verifica el atributo AWS `deviceId` antes de adoptar un Thing y no elimina recursos ajenos. Baja pasa por `DELETING`, delete idempotente, luego `DELETED` y liberación transaccional de cuota. Reintentos usan backoff acotado; errores agotados requieren reconciliación manual. No reportar éxito parcial.

## Endpoints propuestos (ajustar a convenciones actuales)

- `GET /api/condominiums/:condominiumId/units/:unitId/iot/devices`.
- `POST /api/condominiums/:condominiumId/units/:unitId/iot/devices`.
- `GET /api/iot/my/residences/:residenceId/devices` y `POST /api/iot/my/residences/:residenceId/devices` para Owner personal.
- Área común: `GET/POST /api/condominiums/:condominiumId/iot/common-area/devices` con permiso administrativo explícito.
- `GET /api/iot/devices/:deviceId`.
- `PATCH /api/iot/devices/:deviceId`.
- `DELETE /api/iot/devices/:deviceId`.
- `GET /api/iot/devices/:deviceId/state`, `POST /api/iot/devices/:deviceId/commands`.
- `GET /api/iot/devices/:deviceId/events`, `PATCH /api/iot/events/:eventId/acknowledge`.
- `POST /api/iot/my/residences` para Owner autenticado; `POST /api/iot/owners/register` y verificación one-time para nuevas cuentas.
- `POST /api/iot/admin/subscriptions` reservado a SUPERUSER para provisión manual hasta que se acuerde checkout.

Para todo recurso existente, recuperar por `_id` junto con contexto autorizado y luego autorizar. En create, resolver las rutas tipadas desde base de datos; no confiar en IDs del body ni aceptar cambios de scope por PATCH. No exponer acceso directo a AWS.

## Frontend propuesto

Smart Home es un módulo lazy con selector, métricas, lista/control, Shadow, alertas acknowledgeables y alta de residencia; alta pública personal está enlazada desde login. El selector y permisos solo son UX: toda operación vuelve a autorizar en backend. No hay SDK AWS, MQTT, certificados o credenciales en navegador.

## Auditoría y observabilidad

Reutilizar convenciones de errores (`responseContract`) y la estrategia auditable existente, después de resolver cómo representar contexto sin Organization. La auditoría IoT debe registrar actor ID/role, recurso, contexto, acción, resultado/error clasificado, timestamp e IP cuando esté disponible; redacción de payloads sensibles. Morgan registra solicitudes HTTP pero no sustituye auditoría de negocio. Métricas de conectividad/última actividad deben distinguir eventos de auditoría de comandos de usuario.

## Decisiones abiertas / bloqueos

1. Dry-run de migración no ejecutado porque no se debe tocar una base configurada sin revisión. Corregir duplicados/unidades ambiguas manualmente antes de `--apply`.
2. AWS real requiere intervención de plataforma: región/cuenta, role IAM y permisos revisados. No se proporcionaron esos parámetros ni se invocó AWS.
3. Billing IoT necesita intervención de negocio: planes/precios, moneda, proveedor/checkout, recurrencia, cancelación y periodo de gracia. Hasta entonces solo se permite provisión manual SUPERUSER con `billingStatus=MANUAL`.
4. SMTP debe estar configurado para activar Owner personal; el registro falla cerrado y elimina la cuenta pendiente si no puede enviar verificación.
5. Confirmar retención/visibilidad legal de auditoría y alertas.

## Seguridad y no objetivos

Fase 2 está cerrada como diseño. El runtime continúa en progreso; las reglas normativas están en `authorization.md`. No introducir tenant IDs desde Angular como autoridad, APIs AWS públicas, role-only checks, comandos arbitrarios, automatización activa sin worker/política aprobados ni acceso administrativo implícito a viviendas privadas.
