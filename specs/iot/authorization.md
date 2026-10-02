# IoT / Smart Devices - Authorization

## Principio

Autenticación identifica al actor, pero ni el role ni un ID enviado por cliente demuestran acceso. En cada acción se resuelve el dispositivo/contexto desde persistencia, se comprueba la relación vigente actor-contexto y después se valida el permiso exacto sobre la acción. Denegar por defecto ante ausencia, ambigüedad o estado inactivo.

**No válido:** `if (role === "OWNER") allow` o confiar en `organizationId`, `residenceId`, `unitId`, `deviceId`, `ownerId`, scope o rol del body/query.

## Evidencia de arquitectura actual

- `middleware/auth.js` valida JWT y genera `req.auth` mediante `service/authorization.js`.
- `resolveAccessContext()` requiere cuenta activa; roles administrativos requieren Organization activa. OWNER puede tener scope organizacional o, sin Organization, `PERSONAL_OWNER` si está verificado y tiene residencia personal activa. El JWT no conserva una Organization retirada del documento Owner.
- `canAccessCondominium()` autoriza a nivel de Condominium, no distingue `unitId`. No es suficiente para aislamiento de dispositivos entre unidades del mismo condominio.
- Staff/Admin administrativo usa `AccessGrant`/`AccessPolicy`, scope `ALL` o lista de Condominium y catálogo central. El catálogo incluye `iot.*`; los comandos e historial mapean a `iot.control` y `iot.history`.
- `AccessGrant.subjectModel` no soporta Owner, Family, Tenant u otros residentes.
- Owner personal verificado puede autenticarse sin Organization. Un Owner con o sin Organization puede acceder a su residencia personal propia; si no tiene Organization, el middleware limita el contexto a IoT y perfil. Las rutas organizacionales siguen denegadas.

## Resolución confiable del recurso

### Unidad residencial de condominio

1. Validar JWT y cargar actor activo desde `req.auth`.
2. Resolver el dispositivo por ID junto con tenant/contexto persistido; no devolverlo antes de autorizar.
3. Derivar `Condominium` y Organization desde la referencia guardada del dispositivo.
4. Para OWNER: comprobar actor Owner activo y una sola asociación activa en `propertyDetails` con `addressId === condominiumId` y `unitId` igual al subdocumento persistido. `condominium_unit` es etiqueta legacy; asociaciones duplicadas/ambiguas se deniegan hasta reconciliación.
5. Para FAMILY: validar Family activa, `createdBy` Owner activo y asociación familiar autorizada para la misma unidad que aún pertenece al Owner.
6. Aplicar permiso de acción (view/control/manage/history) y cualquier grant explícito/temporal habilitado.
7. Solo entonces leer estado, mutar MongoDB o invocar AWS.

La asociación embebida actual no tiene ID persistente (`_id: false`). Fase 2 asigna identidad estable a asociación y unidad física. No confiar solo en `availableUnits`, `Condominium.units_ownerId` sin cruzar `Owner.propertyDetails`, `canAccessCondominium()` ni un campo de unidad del cliente.

### Residencia personal del Owner

La residencia personal se representa en la relación de ownership del Owner, con ID estable y estado activo; no se consulta ni utiliza el modelo `Property`. El backend comprueba que `residenceId` pertenece al Owner autenticado. Sin Organization, solo se emite `PERSONAL_OWNER` y se permiten rutas IoT/perfil; no se fabrica Organization para completar `req.auth`.

### Área común

1. Resolver dispositivo y Condominium/Organization persistidos.
2. Verificar organización activa y acceso de actor a la organización/Condominium por contexto administrativo.
3. Exigir permiso IoT específico de acción sobre `COMMON_AREA` (propuesto: `iot.common_area.view`, `.control`, `.manage`).
4. Rechazar si el dispositivo pertenece a una unidad privada, aunque el usuario tenga scope organizacional `ALL`.

OwnerAdmin con alcance global no debe recibir automáticamente permiso sobre dispositivos privados. Un permiso global añadido a `PERMISSIONS` podría propagarse a OwnerAdmin porque `resolveAccessContext()` entrega todos los permisos; proteger la frontera privada con autorización contextual, no solo con el nombre del permiso.

## Matriz propuesta

| Actor/contexto                                |                                       View |                                                 Control |           Create/manage/delete | Condición mínima                                                                         |
| --------------------------------------------- | -----------------------------------------: | ------------------------------------------------------: | -----------------------------: | ---------------------------------------------------------------------------------------- |
| OWNER, unidad de condominio propia            |                                         Sí | Solo autorizado por capability/permisos del dispositivo |              Sí, sujeto a plan | Relación activa exacta Condominium + unidad; Organization derivada del Condominium.      |
| OWNER, residencia personal                    |                                         Sí | Solo autorizado por capability/permisos del dispositivo |              Sí, sujeto a plan | `residenceId` activo pertenece al Owner; no requiere Organization.                       |
| OWNER, unidad ajena                           |                                         No |                                                      No |                             No | Denegar aun cuando pertenece al mismo Condominium.                                       |
| FAMILY, unidad autorizada                     |                   Según policy de producto |                                Solo con grant explícito |                 No por defecto | Family activa, Owner creador activo y misma unidad aún autorizada.                       |
| TENANT / familiar invitado / Property Manager |                                No por role |                                             No por role |                    No por role | Solo con identidad/relación real y grant explícito; no hay Tenant ni IoT sharing actual. |
| Staff/Staff_Admin                             |            Solo scope y permiso explícitos |                            Permiso de control explícito |   Permiso de gestión explícito | AccessGrant vigente, scope incluye Condominium y permiso IoT específico.                 |
| Admin / OwnerAdmin                            |             Comunes si política lo permite |                          Comunes si política lo permite | Comunes si política lo permite | Organization y Condominium coinciden; no acceso inferido a unidades privadas.            |
| Superuser                                     | Operación de soporte definida por política |                                            No implícito |                   No implícito | No hay permisos en contexto actual; definir break-glass auditado si es necesario.        |

Matriz funcional propuesta para MVP. La relación por sí sola puede bastar para administrar dispositivos propios, pero control remoto debe tener deny-by-default por capabilities y política de riesgo.

## Contratos de autorización centrales

- `canViewDevice(actor, device)`
- `canControlDevice(actor, device, command)`
- `canCreateDevice(actor, context, attributes)`
- `canUpdateDevice(actor, device, changes)`
- `canDeleteDevice(actor, device)`
- `canViewHistory(actor, device)`

Todas deben recibir actor y entidad/contexto resueltos por servidor, no un role o ID aislado. Deben producir decisión auditable (permit/deny + razón interna segura) sin filtrar existencia del recurso al actor no autorizado. Controllers no duplican las reglas.

## Requisitos por operación

- **Listar:** autenticar; resolver contexto desde ruta y relaciones del actor; filtrar en query por contexto; cada resultado queda dentro del alcance permitido. Unidad administrada: `condominiumId + unitId`. Owner personal: `ownerId + residenceId`. No listar globalmente y filtrar en Angular.
- **Crear:** autenticar; resolver contexto solicitado y relación exacta; comprobar manage/create, límite del plan si habilitado, tipo/capabilities allowlisted y entradas; generar Thing Name/contexto en backend; ejecutar persistencia/proveedor; auditar resultado.
- **Leer detalle/estado/historial:** buscar recurso bajo filtro de tenant/contexto, después autorizar view/history antes de exponer ningún dato o llamar AWS.
- **Actualizar/controlar:** recargar recurso persistido, comprobar autorización de acción y validar campos/comando allowlist; no permitir mover de propietario cambiando IDs. Cambios de ownership exigen flujo explícito y auditable.
- **Eliminar/desvincular:** recargar y autorizar manage/delete; idempotencia; no borrar otro tenant por Thing Name; definir baja lógica y persistencia de auditoría.
- **Fallo parcial:** registrar evento con éxito=false/error clasificado sin secreto, y reconciliar estado AWS/Mongo.

## Sharing futuro

Delegaciones son grants a nivel de dispositivo o contexto con subject real, recursos permitidos, `VIEW_DEVICE`, `CONTROL_DEVICE`, `MANAGE_DEVICE`, `VIEW_HISTORY`, vigencia, revocación y otorgante. La autorización debe cruzar grant con la autoridad vigente del propietario; un grant no sobrevive a una relación de propiedad revocada. La separación y precedencia de deny/allow requieren especificación antes de Fase 8 o exposición de sharing.

## Respuestas y auditoría

Mantener el contrato HTTP existente: 401 para JWT ausente/inválido según middleware actual y 403/404 para denegaciones de recurso según convención acordada; no filtrar nombre, Thing Name, estado ni pertenencia de recurso ajeno. Registrar usuario, role verificado, device/context IDs, acción, resultado/error interno, timestamp e IP disponible. No registrar JWT, AWS keys, certificados privados, payloads secretos ni información residencial innecesaria.

La auditoría administrativa `AuthorizationAudit` conserva su esquema y su `organizationId` requerido. IoT escribe acciones en `IoTAuditEvent`, con contexto discriminado y `organizationId` solo para recursos organizacionales. Estado/eventos se guardan aparte en `IoTDeviceEvent`; historial y acknowledgement requieren `iot.history` y vuelven a autorizar el dispositivo. No insertar Organization arbitraria ni omitir auditoría personal.
