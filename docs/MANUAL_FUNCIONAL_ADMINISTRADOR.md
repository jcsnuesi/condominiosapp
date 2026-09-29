# Manual funcional para el administrador

## 1. Objetivo y alcance

Este manual describe las funciones disponibles para un usuario con rol `ADMIN` en Condominios App (Build-Inn). Incluye navegación, consulta de datos y operaciones administrativas. La interfaz mezcla actualmente textos en español e inglés; este documento utiliza los nombres visibles cuando ayudan a identificar un control.

> Las acciones de crear, editar, activar, suspender, conciliar, enviar o eliminar modifican información. Confirme el registro y revise los datos antes de aceptar un diálogo de confirmación.

## 2. Inicio y cierre de sesión

### Iniciar sesión

1. Abra la pantalla de inicio de sesión.
2. Escriba el correo y la contraseña de administrador.
3. Pulse el botón de acceso.
4. Espere la redirección al Dashboard.

El sistema conserva una identidad y un token con vencimiento. Si la sesión expira o el servidor responde `401/403`, la aplicación limpia la sesión y vuelve al inicio de sesión.

### Recuperar una contraseña

1. Use **Forgot password?** desde el acceso.
2. Introduzca el correo de la cuenta.
3. Abra el enlace recibido y defina la contraseña nueva.

La recuperación requiere un correo registrado y un enlace vigente. No utilice un enlace de recuperación más de una vez.

### Cerrar sesión

1. Abra el menú de la cuenta en la barra superior.
2. Seleccione la opción de cierre de sesión.
3. Compruebe que la aplicación regresa al acceso.

## 3. Navegación general

El menú lateral presenta las opciones permitidas al administrador:

- **Dashboard**: resumen general.
- **Users**: usuarios administrativos.
- **Bookings**: historial de reservas.
- **Staffs**: personal.
- **Create property** y **Properties**: condominios y unidades.
- **Partners**: propietarios o socios.
- **Documents**: documentos administrativos.
- **iCal Channels & Conflicts**: alquileres cortos e iCal.
- **Payment Monitor**: transacciones y conciliación.
- **Communication History**: registro de comunicaciones.

En pantallas estrechas, abra y cierre el menú con el control de navegación superior. Algunos perfiles y paneles se abren desde una fila o un icono de engranaje y no aparecen como opciones independientes.

## 4. Dashboard

El Dashboard resume la operación de los condominios administrados. Puede mostrar balance, unidades, reservas, personal, consultas, documentos y estadísticas mensuales de facturación.

### Consultar indicadores

1. Abra **Dashboard**.
2. Espere a que terminen las solicitudes de datos.
3. Revise cada tarjeta y su estado vacío o de error.
4. Use el control de actualización cuando esté disponible.

Las tarjetas pueden abrir vistas embebidas de facturas, reservas, personal, consultas o documentos sin cambiar la dirección del navegador.

### Estadística mensual

El gráfico compara importes pagados y pendientes. La tabla asociada permite revisar los valores sin depender únicamente del gráfico.

### Consultas y notificaciones

Cuando existen consultas recientes, seleccione una para abrir su detalle. Las respuestas o cambios de estado modifican el registro.

## 5. Propiedades y condominios

### Consultar propiedades

1. Vaya a **Properties**.
2. Use la búsqueda global o los filtros de columna.
3. Ordene o cambie de página cuando sea necesario.
4. Use **Clear** para retirar los filtros.
5. Abra el condominio desde el control de acción de su fila.

Cada fila puede mostrar nombre, alias, dirección, unidades, estado y otros datos administrativos. Activar o suspender una propiedad cambia su disponibilidad operativa y requiere confirmación.

### Crear una propiedad manualmente

1. Vaya a **Create property**.
2. Complete nombre, tipo, teléfonos y foto opcional.
3. Defina el esquema de numeración de unidades y revise la vista previa.
4. Complete dirección, sector, ciudad, provincia y país.
5. Añada áreas sociales y cuota mensual.
6. Revise el resumen y confirme la creación.

La dirección, el sector y la ciudad son obligatorios. Debe existir al menos una unidad generada antes de finalizar.

### Carga masiva

La modalidad de archivo admite hojas o archivos delimitados compatibles con la pantalla. Use una plantilla controlada, valide encabezados y revise la vista previa antes de crear registros. Un archivo masivo puede producir múltiples propiedades, unidades o propietarios.

### Panel de un condominio

Al abrir una propiedad se muestra su resumen, residentes, unidades, reservas, personal, consultas, documentos y facturación.

Desde este panel puede:

- Consultar alias, estado y fecha de cobro.
- Paginar residentes y abrir su perfil.
- Registrar un propietario individual o mediante archivo.
- Abrir el historial o generador de facturas.
- Editar datos de configuración del condominio.

La configuración puede incluir alias, teléfonos, cuota y fecha de pago. Revise formatos antes de guardar.

## 6. Propietarios o socios

### Consultar propietarios

1. Vaya a **Partners**.
2. Busque, filtre, ordene o pagine la lista.
3. Revise saldo, antigüedad y progreso del propietario.
4. Abra el perfil desde la acción de la fila.

### Registrar un propietario

1. Abra la opción de creación desde **Partners** o el panel del condominio.
2. Busque primero por identificación o correo para evitar duplicados.
3. Complete los datos básicos.
4. Asigne propiedad, unidad, condición de alquiler y parqueos.
5. Revise el tercer paso y confirme.

El correo y la identificación deben ser únicos cuando se crea una persona nueva.

### Perfil del propietario

El perfil resume balance, unidades, reservas, miembros autorizados y pagos recientes. Sus accesos internos permiten consultar:

- Información básica.
- Propiedades y unidades asignadas.
- Usuarios autorizados.
- Historial de pagos.
- Reservas.
- Configuración de la cuenta.

Desde las propiedades del propietario se pueden asignar, editar o retirar unidades. Retirar una unidad o eliminar una cuenta son operaciones de alto impacto y deben reservarse para registros verificados.

## 7. Usuarios administrativos

### Consultar y seleccionar

1. Abra **Users**.
2. Busque, ordene y pagine la tabla.
3. Seleccione un usuario para editarlo o administrar su estado.

### Crear o editar

Complete nombre, apellido, género, teléfono, identificación, cargo, correo, permisos y contraseña inicial. En edición, revise cuidadosamente los permisos antes de guardar.

Desactivar impide el uso normal de la cuenta. El borrado por selección es irreversible desde la interfaz; utilícelo únicamente con usuarios de prueba o cuando exista respaldo y autorización operativa.

## 8. Personal

La pantalla **Staffs** presenta tabla en escritorio y una vista adaptada en móvil.

### Consultar personal

Use búsqueda, filtros, orden y paginación. Abra **Settings** para revisar la ficha, asignación, cargo y estado.

### Crear o editar personal

Complete foto opcional, datos personales, fecha de nacimiento, identificación, teléfono, condominio, cargo y correo. La edición también permite cambiar asignación, contraseña y estado según los controles visibles.

Eliminar permanentemente debe limitarse a registros sintéticos o a un procedimiento autorizado.

## 9. Reservas y accesos

Para el administrador, **Bookings** funciona principalmente como historial y consulta.

### Consultar reservas

1. Abra **Bookings**.
2. Busque, filtre, ordene o pagine los registros.
3. Abra **Settings** en una reserva.
4. Revise condominio, unidad, área, fechas, estado, comentarios y visitantes.

En la modalidad ADMIN, el detalle se presenta como solo lectura y la actualización no debería estar habilitada.

Las funciones para anunciar visitas o reservar áreas se orientan al propietario y pueden aparecer embebidas en su contexto. Incluyen unidad, huésped, tipo de notificación, llegada, área, entrada, salida y visitantes.

## 10. Usuarios autorizados

Esta función se abre desde el perfil de un propietario y no figura como menú ADMIN independiente. Permite consultar miembros, propiedades asignadas y accesos temporales.

Los formularios contienen foto, datos personales, correo, condominios, fechas de acceso temporal y estado. Algunos botones de creación o edición están restringidos al propietario aunque el administrador pueda consultar el componente indirectamente.

## 11. Consultas y avisos

### Consultas

La vista de consultas ofrece resumen estadístico, filtro por estado, actualización, paginación y detalle. Según los permisos visibles, se puede responder, cerrar o reabrir una consulta. También puede existir una opción **New Inquiry** con título, condominio, unidad, categoría, prioridad, contenido y adjuntos.

### Avisos y notificaciones

Los avisos pueden filtrarse por tipo y abrirse para leer o descargar adjuntos. Crear o editar un aviso puede incluir título, tipo, prioridad, audiencia, receptores, contenido, vencimiento, adjuntos y publicación o borrador.

Marcar como leído, responder, cerrar, reabrir o publicar cambia el estado almacenado.

## 12. Documentos

### Consultar y descargar

1. Abra **Documents**.
2. Revise título, tipo, condominio, fecha, creador y estado.
3. Use los filtros disponibles.
4. Descargue el archivo desde la acción correspondiente.

### Crear o editar

Indique título, condominio, categoría, descripción y adjunto. Revise el tamaño permitido por la pantalla antes de cargar. Cambiar estado, reemplazar archivos o borrar un documento modifica información compartida con otros usuarios.

## 13. Facturación y pagos

### Historial de facturas

El historial suele abrirse desde un condominio o perfil. Permite buscar, filtrar por datos y estado, paginar, abrir el detalle y generar un PDF.

### Generar factura

Seleccione descripción, concepto e importe, revise el destinatario y confirme la emisión. Esta acción crea un documento financiero.

### Historial de pagos

Muestra proveedor, propiedad, unidad, monto, estado y transacción. Según el registro, permite abrir comprobantes PDF, iniciar un pago o preparar una comunicación por WhatsApp.

No inicie pagos ni envíe mensajes desde un entorno de pruebas sin pasarela sandbox, modo `dry-run` o autorización expresa.

## 14. Monitor y conciliación de pagos

### Filtrar transacciones

En **Payment Monitor**, filtre por propietario, factura, proveedor, estado, conciliación o fechas. Algunos filtros solicitan identificadores técnicos.

### Exportar CSV

Exporte los resultados filtrados y compruebe nombre, codificación, encabezados y número de filas.

### Resolver o importar conciliación

Una resolución manual solicita resultado y nota. La importación recibe proveedor y archivo CSV, y debe presentar totales como coincidentes, no coincidentes, revisión, no encontrados o inválidos.

Estas operaciones afectan información financiera. Use archivos de prueba aislados y revise el resumen antes de confirmar.

## 15. Comunicaciones y recordatorios

**Communication History** permite filtrar por canal, tipo, estado, identificadores y fechas, además de paginar resultados. Los registros pueden contener teléfonos y otros datos personales; no los copie a evidencias públicas.

La vista previa de recordatorios (`dry-run`) permite definir días de gracia, frecuencia y tamaño de lote. Confirme que la pantalla indique explícitamente que se trata de una simulación antes de ejecutarla.

## 16. Integración STR e iCal

### Seleccionar el alcance

1. Abra **iCal Channels & Conflicts**.
2. Seleccione un condominio.
3. Actualice la vista.

### Canales

Un canal contiene plataforma, etiqueta, unidad, frecuencia, URL `.ics` y estado. Crear, editar, sincronizar o activar un canal modifica el proceso de importación y puede acceder a una fuente externa.

### Reservas externas y conflictos

La pantalla puede mostrar unidad, huésped, fechas, canal, estado de origen y condición de conflicto. La pestaña de conflictos permite revisar superposiciones entre calendarios externos y reservas internas.

## 17. Uso seguro y solución de problemas

- Si una pantalla no termina de cargar, use su control de actualización una vez y verifique la conexión.
- Si aparece `401` o `403`, vuelva a iniciar sesión; no repita una operación financiera sin confirmar su estado.
- Si una lista aparece vacía, retire filtros antes de concluir que no existen registros.
- Antes de una carga masiva, conserve el archivo original y pruebe con un lote pequeño.
- Antes de eliminar, confirme nombre, correo, condominio o identificador del registro.
- No comparta capturas que contengan tokens, contraseñas, teléfonos o archivos privados.

## 18. Glosario

- **ADMIN**: administrador global de la plataforma.
- **Owner / Partner**: propietario o socio asociado a una unidad.
- **Staff**: personal operativo o administrativo.
- **STR**: alquiler de corta estancia.
- **iCal / ICS**: formato de calendario utilizado para intercambiar reservas.
- **Dry-run**: simulación que debe mostrar el resultado sin enviar comunicaciones reales.
- **Conciliación**: asociación de una transacción con la factura o cuenta correspondiente.
