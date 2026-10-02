# IoT / Smart Devices - Requirements

## Estado

Estado: **Fases 0-2 cerradas; Fases 3-9 en implementación incremental**. Hay slices funcionales con tests, pero ninguna historia está `[x]` hasta validar todos sus criterios, integración de datos y gates operativos.

Convenciones Kiro-inspired: `[ ] Pending`, `[~] In Progress`, `[x] Completed`, `[!] Blocked`. Una historia solo pasa a `[x]` cuando su implementación, pruebas, autorización, tratamiento de errores y documentación cumplen sus criterios.

## Contexto confirmado

- Backend: Node.js/Express 5, Mongoose 9 y MongoDB. Las rutas se montan bajo `/api`; JWT y contexto de acceso se resuelven en middleware.
- Frontend: Angular 21. Las rutas usan `UserGuard`, `AuthInterceptor` agrega el JWT y los permisos de interfaz se obtienen del contexto de acceso. La interfaz no es frontera de seguridad.
- Organización: `Organization` representa el tenant; `Condominium` pertenece a una organización.
- Propietario y unidad de condominio: `Owner.propertyDetails` conserva asociaciones legacy y ahora permite contextos `CONDOMINIUM_UNIT` y `PERSONAL_RESIDENCE`; `Condominium.units[]` y las asociaciones tienen subdocumentos con ID estable. Los documentos antiguos requieren backfill antes de IoT unitario.
- La relación `Owner.propertyDetails` será el punto de evolución para contextos IoT: asociaciones de unidad administrada (Condominium + unidad) y residencias personales independientes. El modelo `Property` y sus endpoints quedan fuera del módulo IoT.
- No se encontró modelo `Tenant` ni billing recurrente IoT. Existe `IoTSubscription` con entitlement manual por contexto; no hay checkout ni integración de facturación IoT. `Family` no equivale a Tenant.
- `Owner.organizationId` es opcional en el esquema. Login/resolución admiten `PERSONAL_OWNER` verificado con permiso IoT y middleware deny-by-default para otras rutas; las residencias personales pueden coexistir con relaciones organizacionales.
- El backend tiene AWS IoT SDK v3, provider control/data plane, endpoints y pruebas mock. No se han configurado ni probado cuenta, región, endpoint ATS o IAM reales.
- `AuthorizationAudit` conserva su contrato administrativo. IoT usa `IoTAuditEvent` inmutable sin Organization obligatoria; la lectura del inbox de alertas usa `IoTDeviceEvent` scoped.

## Objetivo

Administrar Things de AWS IoT Core desde Condominios, conservando AWS exclusivamente en backend y aplicando autorización por relación verificable con la entidad propietaria del dispositivo, además de permisos sobre la acción concreta.

## Historias y aceptación

### US-IOT-001 - Dashboard personal [~] In Progress

Como usuario autenticado con acceso a una unidad, quiero un dashboard IoT para ver los dispositivos que puedo administrar.

Criterios:

- Dado un usuario autenticado, cuando solicita el dashboard de un contexto accesible, entonces recibe solo dispositivos autorizados para ese contexto.
- Un Owner con cuenta personal sin Organization puede consultar el dashboard de sus residencias personales; no obtiene por ello acceso a endpoints ni recursos de organizaciones.
- Cuando se presenta el resumen, entonces total, online, offline, alertas y actividad se calculan desde datos de backend y no de IDs o contadores enviados por el cliente.
- Si el contexto no es accesible, entonces la API responde según el contrato de errores existente (403 o 404) sin revelar datos del contexto ajeno.

### US-IOT-002 - Registrar dispositivo [~] In Progress

Como OWNER con relación activa a una unidad, quiero registrar un dispositivo en esa unidad.

Criterios:

- Dado un usuario autenticado, cuando registra un dispositivo, entonces el backend valida relación activa exacta con la unidad, permiso de creación, suscripción/límite si están habilitados y payload permitido antes de invocar AWS.
- Cuando se crea, entonces el backend genera Thing Name globalmente único, conserva separado el nombre visible, guarda la relación local y escribe auditoría.
- Si AWS o MongoDB falla, entonces no queda un dispositivo parcial utilizable; se aplica compensación/reintento idempotente y el resultado queda observable.
- El cliente nunca proporciona la propiedad efectiva ni las credenciales AWS.

### US-IOT-003 - Seleccionar contexto [~] In Progress

Como usuario con varias propiedades/unidades, quiero cambiar entre contextos IoT autorizados.

Criterios:

- Cuando pide opciones, recibe únicamente contextos asociados a relaciones activas verificadas en backend.
- El selector incluye las unidades administradas vinculadas activamente al Owner y sus residencias personales independientes.
- Cambiar o falsificar `residenceId`, `condominiumId` o `unit` no amplía el acceso.
- No se asume que `Condominium.availableUnits` prueba propiedad o membresía.

### US-IOT-004 - Listar dispositivos [~] In Progress

Como usuario con acceso a un contexto, quiero consultar sus dispositivos.

Criterios:

- La consulta está filtrada en backend por contexto y autorización; los filtros cliente nunca reemplazan el filtro de seguridad.
- La respuesta incluye solo campos permitidos: nombre, tipo, ubicación, estado, última comunicación, alertas y creación.
- AWS Thing Name podrá mostrarse únicamente a usuarios con permiso de administración; nunca se devuelven claves, certificados privados ni credenciales.

### US-IOT-005 - Detalle de dispositivo [~] In Progress

Como usuario autorizado, quiero consultar detalle, conectividad, estado reportado, estado deseado y actividad accesible.

Criterios:

- Cada lectura resuelve el dispositivo y valida acceso sobre su contexto persistido.
- Los estados Shadow y la actividad se obtienen por backend, con forma de respuesta acotada y sin secretos.

### US-IOT-006 - Control remoto [~] In Progress

Como usuario autorizado, quiero controlar un dispositivo mediante comandos admitidos.

Criterios:

- Antes de enviar, el backend comprueba `canControlDevice` sobre el dispositivo y valida comando, capability, tipo y valores contra definiciones permitidas.
- Comandos desconocidos, valores fuera de rango o payload arbitrario son rechazados y no se envían a AWS.
- Cada resultado, incluido fallo, se audita sin guardar secretos.

### US-IOT-007 - Autorización por rol y relación [~] In Progress

Como usuario del sistema, quiero que permisos y relación con una unidad se evalúen conjuntamente.

Criterios:

- Un rol por sí solo nunca concede acceso a un dispositivo.
- OWNER requiere una asociación activa con el contexto exacto; en condominio se valida la unidad y en residencia personal el propietario autenticado. Family requiere acceso familiar autorizado y Owner activo; personal delegado usa un grant explícito si se implementa.
- Personal de administración requiere permiso IoT explícito y scope organizacional/condominal compatible. No obtiene acceso a dispositivos privados de unidades por ser administrador del condominio.
- Un Owner sin Organization recibe un contexto personal mínimo; las rutas que requieren Organization siguen denegando acceso.

### US-IOT-008 - Delegar acceso [!] Blocked (fuera del MVP; requiere modelo/grants de sujetos aprobado)

Como OWNER, quiero delegar permisos limitados sobre ciertos dispositivos o unidad.

Criterios de diseño:

- Separar `VIEW_DEVICE`, `CONTROL_DEVICE`, `MANAGE_DEVICE` y `VIEW_HISTORY`.
- Grant acotado a sujeto, contexto/recurso, permisos, vigencia y estado; revocación efectiva inmediata.
- No reutilizar `AccessGrant` administrativo sin adaptar su modelo: hoy solo acepta Admin/Staff_Admin/Staff y scope de organización/condominio.

### US-IOT-009 - Áreas comunes [~] In Progress

Como administrador con permiso, quiero gestionar dispositivos comunes del condominio.

Criterios:

- Los dispositivos comunes tienen contexto `COMMON_AREA` (o equivalente inequívoco) vinculado al Condominium y a su organización.
- Permiso de área común no concede lectura o control de dispositivos privados de Units.
- El backend verifica tenant, scope de condominium y permiso antes de cualquier operación.

### US-IOT-010 - Aislamiento multi-tenant [~] In Progress

Como usuario, quiero que ninguna manipulación de IDs permita acceder a otro propietario o tenant.

Criterios:

- Todas las lecturas y mutaciones vuelven a resolver relación/permiso en backend, incluso si ya se autorizó el selector o una ruta padre.
- Cubrir view, list, create, update, control y delete con usuarios/propiedades ajenos; 403 o 404 sigue la convención elegida y no permite enumeración.
- Queries combinan ID del recurso con contexto autorizado; no se busca por `deviceId` global y se autoriza después de devolver datos.

### US-IOT-011 - Cuenta Owner personal [~] In Progress

Como persona propietaria que no pertenece a una organización administradora, quiero tener una cuenta OWNER y registrar una residencia personal, para administrar sus dispositivos IoT.

Criterios:

- El flujo aprobado de alta puede crear una cuenta `Owner` activa sin `organizationId`; conserva unicidad de identidad y verificación de cuenta según las políticas de autenticación existentes.
- El Owner puede crear una residencia personal dentro de su propia relación `Owner.propertyDetails`; esta asociación tiene identidad persistente, estado y etiqueta, y no requiere ni crea `Condominium` u `Organization`.
- La alta personal no crea identidades `ADMIN`, no concede permisos de organización y no acredita propiedad sobre una unidad administrada o área común.
- El usuario solo puede seleccionar, ver y gestionar residencias personales vinculadas a su Owner ID. Vincular una unidad administrada requiere el flujo/relación autorizados de ese condominio.
- Si el Owner personal llama a una ruta que exige contexto organizacional, el backend deniega la operación sin ampliar permisos ni fabricar un `organizationId`.

## Requisitos EARS

- **WHEN** una petición IoT llega sin JWT válido, **THE SYSTEM SHALL** rechazarla antes de acceder a MongoDB de dominio o AWS.
- **WHEN** un usuario solicita un dispositivo, **THE SYSTEM SHALL** validar su relación activa con el contexto persistido del dispositivo y el permiso para esa acción.
- **WHEN** un usuario OWNER accede a una unidad administrada, **THE SYSTEM SHALL** comprobar la asociación exacta `Condominium + unitId`, no solo el rol ni el acceso a cualquier unidad del condominio.
- **WHEN** un usuario OWNER sin Organization accede a IoT, **THE SYSTEM SHALL** comprobar su relación activa con la residencia personal y limitar su contexto a recursos propios.
- **WHEN** una persona crea una cuenta Owner personal, **THE SYSTEM SHALL** crear una identidad sin Organization y un contexto de acceso personal mínimo solo después de cumplir verificación de cuenta.
- **WHEN** una residencia está asociada a un Condominium, **THE SYSTEM SHALL** derivar Organization desde ese Condominium; **SHALL NOT** exigir ni inventar una Organization para una residencia personal.
- **WHEN** un Owner personal solicita una operación de organización, **THE SYSTEM SHALL** denegarla salvo que exista una relación organizacional válida e independiente.
- **WHEN** un usuario con acceso administrativo solicita un dispositivo, **THE SYSTEM SHALL** aplicar scope y permiso IoT de área común y **SHALL NOT** inferir acceso a unidades privadas.
- **WHEN** se acepta una operación AWS, **THE SYSTEM SHALL** ejecutarla únicamente desde backend con credenciales IAM de privilegio mínimo.
- **WHEN** una operación IoT crea/modifica/elimina/controla un dispositivo, **THE SYSTEM SHALL** escribir auditoría con actor, contexto, acción, resultado y timestamp, sin material secreto.
- **WHEN** se habilite un límite de plan para la unidad, **THE SYSTEM SHALL** comprobar estado de suscripción y capacidad en backend antes de crear dispositivos.
- **IF** el vínculo de propietario/contexto está inactivo o es ambiguo, **THEN THE SYSTEM SHALL** denegar la operación por defecto.

## Fuera del MVP inicial

Motor completo de automatización (las reglas draft permanecen desactivadas), sharing, checkout/billing recurrente, notificaciones externas (email/push/WhatsApp) y provisioning de certificados/policies de hardware. El alta Owner personal sí está en implementación, pero necesita SMTP configurado para activar cuentas.
