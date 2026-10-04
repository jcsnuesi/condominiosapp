# FinanceComponent: manual funcional paso a paso

Este documento explica el comportamiento implementado en `FinanceComponent`, sus siete pestañas y los servicios que utiliza. Los nombres en inglés corresponden a los botones y etiquetas actuales de la pantalla. La explicación se basa en el código del repositorio; no implica que las etapas ya estén habilitadas en un condominio operativo.

## 1. Acceso y funcionamiento general

La pantalla **Financial management** se encuentra en la ruta `/finance`.

1. Al entrar, `ngOnInit()` consulta los condominios disponibles mediante `GET finance/options`.
2. Selecciona el primer condominio disponible y carga su configuración.
3. Prepara las unidades, sus propietarios y el importe mensual del condominio como valor inicial de los cargos.
4. Para usuarios administrativos, carga también las cuentas bancarias.
5. Si Finanzas está habilitado, consulta los datos de la pestaña activa. Un administrador comienza en **Accounts receivable**; un propietario comienza en **Unit statement**.
6. Al cambiar de pestaña, carga los datos correspondientes. Al cambiar de condominio, limpia los resultados anteriores, reinicia la paginación y vuelve a cargar la configuración y las unidades.

### Controles compartidos

| Control | Función |
|---|---|
| **Condominium** | Selecciona el condominio dentro del alcance autorizado. |
| **Currency** | Código de moneda de hasta tres caracteres; comienza en `DOP`. Se utiliza para crear operaciones y para las consultas que admiten filtro de moneda. |
| **Refresh** | Vuelve a consultar la pestaña activa. En Settings recarga el contexto completo del condominio, incluidos los borradores de configuración. |
| Navegación de pestañas | Cambia la sección activa y solicita sus datos cuando la etapa está habilitada. |
| Mensaje de error | Informa fallos de conexión, permisos, validación o ejecución. |
| Mensaje de éxito | Confirma una operación completada. |

Mientras una operación está en curso, `busy()` deshabilita los controles principales y evita ejecutar simultáneamente otra acción gestionada por `perform()`.

Las fechas iniciales de emisión, vencimiento, operaciones y saldo inicial se calculan con la zona `America/Santo_Domingo`. El rango inicial de consulta abarca enero a diciembre del año inicial del componente.

### Roles y permisos

| Perfil o permiso | Comportamiento |
|---|---|
| `OWNER` | Solo ve Accounts receivable y Unit statement; no puede modificar finanzas. Las consultas limitan sus datos por titular y alcance; el historial valida además que la unidad esté actualmente autorizada. |
| Administrador con `finance.read` | Consulta las secciones administrativas dentro de su organización y condominios autorizados. |
| `finance.create` | Permite emitir cargos, registrar ingresos/egresos y evaluar moras manualmente. La interfaz también usa este permiso para mostrar la creación de cuentas bancarias. |
| `finance.update` | Permite ajustes, aplicación de créditos, reversos, vinculaciones bancarias, configuración, saldo inicial y presupuesto. |
| Administrador principal reconocido por `isOwnerAdmin()` | La interfaz habilita creación y actualización sin exigir esos permisos individuales. No debe confundirse con el rol propietario `OWNER`. |

El servidor verifica los permisos y el alcance de cada operación. La creación de cuentas utiliza el endpoint del módulo bancario y está sujeta también a las validaciones y permisos de ese módulo.

### Etapas de activación

| Etapa | Propiedad | Funciones habilitadas |
|---|---|---|
| 1 | `enabled` | Cuentas por cobrar, cargos, ajustes, créditos y estado de cuenta. |
| 2 | `cashbookEnabled` | Registro de ingresos, gastos y transferencias. Requiere la etapa 1. |
| 3 | `reportsEnabled` | Presupuesto y reportes. Requiere las etapas 1 y 2. |

Las pestañas administrativas siguen visibles aunque una etapa esté deshabilitada, pero muestran un aviso en lugar de sus funciones. Settings permanece accesible para preparar la activación. Si no hay condominios disponibles, la pantalla lo informa.

## 2. Accounts receivable — Cuentas por cobrar

**Objetivo:** consultar las facturas con deuda pendiente y su antigüedad.

### Paso a paso

1. Selecciona un condominio y abre **Accounts receivable**.
2. Revisa las tarjetas de resumen. Cada moneda conserva su total y su distribución por antigüedad.
3. Consulta la tabla: número de factura, unidad, tipo de cargo, vencimiento, saldo pendiente y tramo de antigüedad.
4. Usa **Previous** y **Next** para recorrer las facturas. La pantalla utiliza páginas de 50 registros.
5. Pulsa **Export CSV** para descargar `receivables.csv` con la cartera completa autorizada, no solo la página visible.
6. Si tienes permiso de actualización, pulsa **Apply adjustment** en una factura. La pantalla cambia a Charges and adjustments, selecciona esa factura, propone su saldo pendiente como importe y limpia la selección de crédito.

### Cómo se calculan los resultados

El saldo ordinario responde a esta relación:

```text
Saldo pendiente = cargo original − pagos aplicados − ajustes − créditos aplicados
```

Las facturas históricas completadas sin detalle de importe pagado conservan el tratamiento especial de saldo cero.

| Tramo | Criterio |
|---|---|
| Current | No vencida, vence hoy o no tiene vencimiento verificable. |
| 1–30 days | Entre 1 y 30 días después del vencimiento. |
| 31–60 days | Entre 31 y 60 días. |
| 61–90 days | Entre 61 y 90 días. |
| Over 90 days | Más de 90 días. |

Solo aparecen facturas con saldo positivo y emisión no posterior al día actual. Los totales corresponden a toda la cartera consultada, aunque la tabla esté paginada. Si no hay deuda, muestra **No outstanding debt**.

**Detalle del filtro:** esta consulta no filtra por la moneda escrita en Currency ni por el año. Devuelve las monedas de la cartera por separado. Su exportación también representa deuda actual, no un corte histórico por rango de fechas.

**Métodos principales:** `loadReceivables()`, `selectInvoice()`, `paginate()` y `export('receivables')`.

## 3. Charges and adjustments — Cargos y ajustes

**Objetivo:** emitir facturas, reducir deuda mediante descuentos o condonaciones y aplicar saldos a favor existentes.

### A. Emitir cargos

1. Abre **Charges and adjustments** con permiso de creación y la etapa 1 habilitada.
2. Selecciona el tipo de cargo:

   | Tipo | Uso y selección de unidades |
   |---|---|
   | Monthly fee | Cuota mensual; permite varias unidades. |
   | Special assessment | Cargo extraordinario; permite varias unidades. |
   | Individual charge | Cargo individual; exige una sola unidad. |
   | Fine | Multa; exige una sola unidad. |

3. Indica fecha de emisión, fecha de vencimiento y una descripción o motivo de 3 a 500 caracteres.
4. Para un importe uniforme, escribe **Equal amount** y pulsa **Copy amount to units**. Copia el valor a todas las unidades de la tabla, sin seleccionarlas automáticamente.
5. Marca las unidades que recibirán el cargo. Puedes modificar el importe de cada una; utiliza importes positivos con precisión de centavos.
6. Pulsa **Record charges**. El servidor valida el lote y emite las facturas en una transacción.
7. Al completarse, se desmarcan las unidades y se actualiza la cartera. La pestaña permanece en cargos y ajustes.

El servidor admite de 1 a 500 unidades por lote y rechaza unidades repetidas. Si el lote es inválido, no se aplica parcialmente. La cuota mensual utiliza una referencia única por organización, condominio, unidad y período; pagarla o cambiar de propietario no libera esa referencia.

### B. Registrar descuento o condonación

1. Selecciona **Outstanding invoice**, o entra desde **Apply adjustment** en cuentas por cobrar.
2. Elige **Discount** o **Waiver**. Ambos reducen el saldo; el tipo distingue el motivo funcional de la aplicación.
3. Indica el importe y un motivo de 3 a 500 caracteres.
4. Pulsa **Record adjustment**.
5. Se guarda una aplicación auditada, se recalcula la factura y se actualizan cartera y créditos. El importe no puede superar la deuda pendiente.

Ejemplo: una factura de DOP 5,000 con DOP 2,000 pagados tiene DOP 3,000 pendientes. Un descuento de DOP 500 deja DOP 2,500 pendientes y conserva el cargo original de DOP 5,000.

### C. Aplicar saldo a favor

1. Selecciona la factura pendiente.
2. En **Available credit balance**, elige un crédito disponible.
3. Indica cuánto aplicar y el motivo.
4. Pulsa **Apply credit balance**.
5. El servidor reduce el crédito disponible y el saldo de la factura en la misma transacción.

El crédito debe corresponder al mismo condominio, titular, unidad y moneda. No puede aplicarse más que el crédito disponible ni más que la deuda. Los créditos sin unidad identificada se muestran como pendientes de revisión, pero no pueden consumirse.

La lista **Credit balances** muestra los saldos disponibles. El selector de facturas utiliza la página actual de cuentas por cobrar; **Previous invoices** y **More invoices** permiten cargar otras páginas. La lista general de créditos puede contener distintas monedas; el selector aplicable a una factura filtra por coincidencia y disponibilidad.

Los pagos se registran mediante los flujos de pago existentes. Un ajuste o una aplicación de saldo a favor reduce deuda sin registrar una nueva entrada de dinero. El servidor bloquea las aplicaciones si la factura tiene flujo de pasarela o transacciones de pasarela pendientes, en procesamiento o exitosas; ese flujo debe resolverse primero.

**Métodos principales:** `equalAmounts()`, `saveCharges()`, `saveAdjustment()` y `usableCredits`.

## 4. Unit statement — Estado de cuenta por unidad

**Objetivo:** reconstruir cargos y aplicaciones de una unidad en un período, junto con su deuda actual.

### Paso a paso

1. Abre **Unit statement**.
2. Selecciona la unidad. Los administradores también pueden escribir un identificador en **Historical unit** para consultar unidades históricas; ambos controles editan el mismo valor.
3. Define **From** y **To**, y pulsa **View**. Cambiar la unidad en el selector recarga automáticamente y vuelve a la primera página.
4. Revisa los tres indicadores: saldo al inicio del rango, saldo al cierre del rango y deuda actual.
5. Consulta las filas con fecha, descripción, cargos, aplicaciones y saldo acumulado.
6. Usa la paginación de 50 filas o **Export CSV**. La descarga `history.csv` incluye todas las filas autorizadas del rango.
7. Consulta **Current available credits** para conocer los saldos a favor disponibles actualmente.

El saldo inicial/final pertenece al período consultado; la deuda y los créditos actuales pueden reflejar operaciones posteriores. Un cargo aumenta el saldo y una aplicación lo reduce.

### Revertir una aplicación

1. Con permiso de actualización, escribe un motivo de al menos tres caracteres en **Reason for reversing an application**.
2. Pulsa **Reverse** en una fila que ofrezca esa acción.
3. El servidor crea un reverso conservando el registro original y recalcula la deuda.
4. Si se revierte una aplicación de crédito, devuelve el importe al crédito disponible. La factura puede volver a quedar pendiente.
5. Se recarga el estado de cuenta.

Esta acción corresponde a descuentos, condonaciones y aplicaciones de crédito reversibles; no constituye un botón general para cancelar pagos. No puede revertirse nuevamente una aplicación ya revertida ni revertirse un reverso.

Los pagos históricos sin fecha verificable generan un aviso. No se asignan a una fecha inventada para construir el rango. Los propietarios consultan exclusivamente sus registros autorizados; la vista administrativa permite seguir la continuidad de la unidad.

**Métodos principales:** `loadHistory()`, `changeHistoryFilter()`, `reverseApplication()` y `export('history')`.

## 5. Income and expenses — Ingresos y egresos

**Objetivo:** registrar movimientos manuales de dinero ya realizado y vincularlos con movimientos bancarios importados. Requiere `cashbookEnabled`.

### A. Registrar una operación

1. Abre **Income and expenses** con permiso de creación.
2. Selecciona **Paid expense**, **Other income received** o **Transfer between accounts**.
3. Indica fecha, importe positivo, categoría y descripción de 3 a 500 caracteres.
4. Selecciona una cuenta de la moneda activa o **Cash** para efectivo.
5. Completa, si corresponde, **Reference** y **Supporting document reference**. Este último campo guarda una referencia textual; no carga archivos.
6. Para una transferencia, selecciona cuentas de origen y destino distintas del mismo condominio y moneda. La opción Cash no sirve como origen de una transferencia entre cuentas.
7. Opcionalmente, despliega **Link an imported bank transaction** y selecciona el movimiento de origen y, para transferencias, el de destino.
8. Pulsa **Record transaction**. Se guarda la operación y se recargan los registros y movimientos disponibles.

No se admiten fechas futuras porque se registran ingresos recibidos y gastos pagados. La categoría `Cobros de cuotas` está reservada: los pagos confirmados de cuotas se incorporan automáticamente en Reports. La tabla de esta pestaña contiene registros manuales, no la lista de pagos de facturas.

Las transferencias mueven dinero entre cuentas y no suman ingresos ni gastos. No hay conversión automática de monedas.

### B. Vincular un movimiento bancario después de registrar

1. Busca un registro bancario que todavía tenga un lado sin vincular.
2. Pulsa **Link bank transaction**.
3. Selecciona el movimiento de origen y/o destino en el formulario que aparece.
4. Pulsa **Link**. Los campos en **No change** conservan la vinculación existente.

La interfaz propone movimientos según cuenta, moneda y dirección: crédito bancario para ingresos o destino de transferencias; débito para gastos u origen de transferencias. El servidor verifica además importe, fecha, condominio, estado confirmado del extracto y que el movimiento no esté usado por otro registro o comprobante.

**Bank transactions to classify** muestra el total pendiente y permite cambiar de página. Los selectores utilizan los movimientos de la página cargada; si el esperado no aparece, recorre esas páginas. Los registros manuales y los movimientos tienen paginaciones independientes de 50 elementos.

### C. Revertir un registro manual

1. Escribe un motivo de al menos tres caracteres en **Reversal reason**.
2. Pulsa **Reverse** en un registro original que no haya sido revertido.
3. Se crea un registro de corrección con la fecha actual; en la tabla y el reporte su efecto aparece con signo negativo.
4. Las vinculaciones bancarias se liberan para reclasificación.

El reverso corrige la clasificación financiera, pero no representa una devolución bancaria. El movimiento importado original permanece en el estado bancario.

**Métodos principales:** `loadEntries()`, `loadMovements()`, `movementOptions()`, `saveEntry()`, `selectEntry()`, `linkEntry()` y `reverseEntry()`.

## 6. Budget — Presupuesto

**Objetivo:** definir el presupuesto anual por moneda, mes, tipo y categoría. Requiere `reportsEnabled`.

### Paso a paso

1. Abre **Budget**, selecciona moneda y año entre 2000 y 2200, y pulsa **Load budget**.
2. Con permiso de actualización, completa mes de 1 a 12, tipo **Expense** o **Income**, categoría e importe no negativo.
3. Pulsa **Add or update budget line**. Si ya existe una línea con el mismo mes, tipo y categoría, reemplaza su importe; de lo contrario agrega una nueva.
4. Repite para las partidas necesarias. **Remove** elimina una línea del borrador.
5. Pulsa **Save annual budget** para persistir el conjunto completo de líneas.
6. La pantalla vuelve a cargar el presupuesto y su revisión actualizada.

Agregar, actualizar y eliminar líneas modifica primero el borrador local. Cambiar de condominio o recargar el presupuesto descarta cambios sin guardar. El año del presupuesto y el rango de fechas de History/Reports son campos independientes.

El servidor rechaza partidas repetidas y utiliza `revision` para impedir que una versión antigua sobrescriba cambios de otro administrador. Ante un conflicto, vuelve a cargar y revisa las partidas antes de guardar.

Las categorías se comparan por texto exacto. Para presupuestar los pagos automáticos de cuotas, usa **Income** y la categoría `Cobros de cuotas`; para gastos manuales, usa el mismo nombre de categoría que registras en caja.

**Métodos principales:** `loadBudget()`, `addBudgetLine()`, `removeBudgetLine()` y `saveBudget()`.

## 7. Reports — Reportes administrativos

**Objetivo:** consultar ingresos y gastos realizados, ejecución presupuestaria, situación bancaria y cartera. Requiere `reportsEnabled`.

### Paso a paso

1. Abre **Reports** y selecciona la moneda.
2. Define **From** y **To** dentro de un mismo año; el servidor rechaza rangos que cruzan años para este reporte presupuestario.
3. Pulsa **View**.
4. Revisa **Income**, **Expenses** y **Net cash flow**.
5. Consulta **Budget versus actuals** por mes, tipo y categoría.
6. Revisa **Bank accounts as of** a la fecha To, incluido el número de movimientos pendientes de clasificación.
7. Consulta **Current accounts receivable**, que indica su propia fecha de consulta actual.
8. Revisa **Transactions for the period** y descarga `report.csv` mediante **Export income and expenses CSV**.

### Interpretación de indicadores

| Indicador | Cálculo o fuente |
|---|---|
| Income | Pagos exitosos con fecha confirmada más otros ingresos manuales, considerando reversos. |
| Expenses | Gastos manuales pagados, considerando reversos. |
| Net cash flow | Ingresos menos gastos; las transferencias no alteran este resultado. |
| Budget | Importes planificados de los meses completos incluidos en el rango. |
| Actual | Importes reales de las operaciones del rango, agrupados por mes, tipo y categoría. |
| Variance | Real menos presupuestado. |
| % | `(real − presupuestado) / presupuestado × 100`; muestra un guion si el presupuesto es cero. |

Ejemplo: un gasto presupuestado de DOP 10,000 con ejecución de DOP 12,000 produce variación de DOP 2,000 y 20%. El signo indica exceso respecto del plan; su interpretación depende de si la línea es ingreso o gasto.

**Meses parciales:** el presupuesto no se prorratea. Si consultas del 15 de enero al 28 de febrero, solo se incorpora el presupuesto mensual de febrero. Los movimientos reales de enero dentro del rango sí pueden aparecer con presupuesto cero.

**Bancos:** el saldo inicial representa el comienzo del día de apertura. El saldo calculado agrega movimientos importados desde esa fecha y operaciones bancarias manuales sin vincular. Si falta saldo inicial o la apertura es posterior al corte, indica **No opening balance for this date**. Una operación manual y su movimiento importado pueden contarse ambos mientras no se vinculen; revisa los pendientes de clasificación.

**Fechas y monedas:** ingresos, gastos y presupuesto se filtran por moneda. El resumen bancario y la cartera del reporte pueden incluir otras monedas, identificadas por separado. La cartera muestra deuda actual, aunque To sea una fecha pasada; no equivale a cartera histórica al corte.

Los avisos identifican pagos sin fecha confirmada y facturas históricas pagadas sin transacción. Esos registros se excluyen de los cobros del período. El CSV exporta las filas de movimientos del período, incluidas transferencias si las hay; no exporta las tarjetas bancarias ni la tabla presupuestaria completa.

**Métodos principales:** `loadActiveTab()` para `reports` y `export('report')`; cálculos en `financeReporting.js` y `financeRules.js`.

## 8. Settings — Configuración

**Objetivo:** activar las etapas por condominio, configurar moras y preparar cuentas bancarias. Está disponible para usuarios administrativos.

### A. Activar por etapas

1. Revisa los datos y saldos del condominio.
2. Comprueba que la revisión y migración de datos e índices esté completada. Si `migrationReady` es falso, la pantalla muestra un aviso y bloquea la activación.
3. Marca **I reviewed the data and balances for this condominium** para la activación inicial.
4. Marca **Enable charges, adjustments, credits and history**.
5. Si corresponde, marca **Enable income and expenses**.
6. Después puedes marcar **Enable budget and reports**.
7. Pulsa **Save settings** con permiso de actualización.

Desmarcar la etapa 1 desmarca también caja, reportes y mora en el borrador. Desmarcar caja desmarca reportes. Debes guardar para aplicar esos cambios. Desactivar una etapa conserva los registros existentes.

La pantalla no ejecuta la migración: es una tarea técnica previa. Consulta [FINANCE.md](FINANCE.md) para el procedimiento de revisión y migración. Las operaciones transaccionales requieren MongoDB con replica set.

### B. Configurar mora automática

1. Con la etapa 1 habilitada, marca **Enable a one-time charge per overdue invoice**.
2. Selecciona **Fixed amount** o **Percentage of overdue balance**.
3. Introduce importe o porcentaje positivo con hasta dos decimales; el porcentaje no puede superar 100%.
4. Indica días de gracia como entero entre 0 y 365.
5. Guarda la configuración.
6. El proceso programado evalúa diariamente a las **10:00 a. m., hora de Santo Domingo**. Si tienes permiso de creación y la mora está guardada como activa, puedes usar **Evaluate late fees now**.

La mora se emite como un cargo separado una sola vez por factura. Se calcula sobre el saldo pendiente cuando corresponde, después del vencimiento y de superar los días de gracia. No se aplica a moras ni a cargos `legacy`.

Activar o cambiar la política establece su vigencia desde el día actual; no aplica retroactivamente a vencimientos anteriores a esa vigencia. Pagar o ajustar después la factura original no cancela una mora emitida; esa mora puede tratarse mediante ajustes auditados.

Ejemplo: saldo elegible de DOP 2,000 con mora de 5% genera un cargo separado de DOP 100. Una evaluación posterior no genera otra mora para la misma factura.

### C. Crear una cuenta bancaria

1. En **Bank accounts**, revisa banco, etiqueta, moneda y si existe fecha de apertura.
2. Con la acción disponible, escribe **Bank** y **Account label**, ambos requeridos y de hasta 120 caracteres.
3. Pulsa **Create account in DOP**, o el código de moneda seleccionado.
4. Se utiliza `BankReconciliationService` y se recarga la lista de cuentas.

La creación no registra automáticamente un saldo inicial. El código de moneda activo determina la moneda enviada al crear la cuenta.

### D. Registrar saldo inicial

1. Habilita caja y utiliza un usuario con permiso de actualización.
2. Selecciona una cuenta de la moneda activa que todavía no tenga fecha de apertura.
3. Indica **As-of date**, sin fecha futura.
4. Introduce **Balance**; puede ser cero, positivo o negativo.
5. Pulsa **Record opening balance**.

Representa el saldo al comienzo del día indicado y solo puede definirse una vez. Los movimientos desde ese día forman parte del cálculo posterior. La pantalla no ofrece edición de un saldo inicial ya registrado.

**Métodos principales:** `settingsValidationError`, `changeFinanceEnabled()`, `changeCashbookEnabled()`, `saveSettings()`, `runLateFees()`, `createAccount()` y `saveOpening()`.

## 9. Componentes técnicos y comunicación

Las siete pestañas son bloques condicionales de una misma plantilla, no siete componentes Angular hijos independientes.

| Pieza | Responsabilidad |
|---|---|
| [finance.component.ts](../frontend/src/app/demo/components/finance/finance.component.ts) | Estado, permisos de interfaz, carga por pestaña, formularios, guardado, reversos y exportación. |
| [finance.component.html](../frontend/src/app/demo/components/finance/finance.component.html) | Controles, navegación, tarjetas, tablas y validaciones de formulario. |
| [finance.component.css](../frontend/src/app/demo/components/finance/finance.component.css) | Presentación del módulo. |
| [finance.service.ts](../frontend/src/app/demo/service/finance.service.ts) | Tipos de datos y solicitudes HTTP a `finance/`, con autenticación y extracción de `data`. |
| [bank-reconciliation.service.ts](../frontend/src/app/demo/service/bank-reconciliation.service.ts) | Servicio bancario utilizado para crear cuentas. |
| `AccessContextService` y `UserService` | Permisos, identidad, rol y credenciales de las solicitudes. |
| [controllers/finance.js](../backend/controllers/finance.js) | Validación y ejecución de consultas y operaciones financieras. |
| [financeAccess.js](../backend/service/financeAccess.js) | Autorización, alcance, activación de etapas y verificación de índices. |
| [financeRules.js](../backend/service/financeRules.js) | Reglas de saldo, antigüedad, mora, variación y CSV. |
| [financeReporting.js](../backend/service/financeReporting.js) | Cartera, historial, reporte de caja y resumen bancario. |
| [lateFeeJob.js](../backend/service/lateFeeJob.js) | Evaluación diaria programada de moras. |

El componente es standalone, usa `OnPush`, signals para los resultados y formularios con `ngModel`. Convierte las respuestas observables a promesas mediante `firstValueFrom()` para coordinar la secuencia de consultas.

### Flujo de una acción

1. Un evento de la plantilla llama a un método del componente.
2. `perform()` activa el estado ocupado y limpia mensajes anteriores.
3. El método consulta o modifica datos mediante el servicio correspondiente.
4. El servidor valida identidad, permiso, alcance, etapa y reglas de negocio.
5. El componente actualiza los datos de la sección y presenta el resultado.
6. `perform()` libera el estado ocupado, incluso si hubo un error.

Los importes `*Minor` se expresan en centavos: `250050` se muestra como `2,500.50`. La factura también mantiene campos como `amount` y `balancePending` en unidades monetarias; estos no deben dividirse nuevamente entre 100.

Cargos, aplicaciones y reversos utilizan claves de idempotencia para reconocer reintentos de una misma operación. La clave se conserva tras un fallo y se libera después del éxito. Si se reintenta con la misma clave y datos diferentes, el servidor puede devolver un conflicto. El presupuesto utiliza revisión de versión en lugar de esa clave.

### API utilizada por pestaña

Las rutas siguientes son relativas a la base `finance/` del servicio.

| Pestaña | Consultas y operaciones |
|---|---|
| Contexto general | `GET options`, `GET condominiums/:id/settings`, `GET accounts` para administradores. |
| Accounts receivable | `GET receivables`, `GET credits`; CSV con `format=csv`. |
| Charges and adjustments | `POST charges`, `POST invoices/:id/adjustments`, `POST invoices/:id/credits`. |
| Unit statement | `GET history`, `POST applications/:id/reversal`; CSV con `format=csv`. |
| Income and expenses | `GET/POST entries`, `GET movements`, `POST entries/:id/link`, `POST entries/:id/reversal`. |
| Budget | `GET/PUT budget`. |
| Reports | `GET report`; CSV con `format=csv`. |
| Settings | `PUT condominiums/:id/settings`, `POST late-fees/run`, `PUT accounts/:id/opening-balance`; creación de cuentas mediante `bank-accounts` del servicio bancario. |

## 10. Ejemplo de recorrido completo

1. **Settings:** revisa los saldos y activa las etapas necesarias.
2. **Charges and adjustments:** emite una cuota de DOP 5,000 para una unidad.
3. **Accounts receivable:** verifica la nueva factura y su saldo de DOP 5,000.
4. **Flujo de pagos existente:** confirma un pago de DOP 3,000; el saldo queda en DOP 2,000.
5. **Charges and adjustments:** aplica un descuento de DOP 200; quedan DOP 1,800 pendientes.
6. **Unit statement:** comprueba el cargo, el pago, el ajuste y el saldo de la unidad.
7. **Income and expenses:** registra un gasto ya pagado de DOP 1,000, con categoría y soporte.
8. **Budget:** guarda las partidas planificadas del mes usando las categorías que aparecerán en los movimientos reales.
9. **Reports:** consulta el período: ese pago aporta DOP 3,000 de ingresos, el gasto aporta DOP 1,000 de egresos y el flujo neto es DOP 2,000, si no existen otras operaciones. El descuento no aumenta el ingreso; la cartera actual conserva DOP 1,800 pendientes.

Este recorrido describe administración de cobros y caja. El módulo no implementa contabilidad de doble partida.
