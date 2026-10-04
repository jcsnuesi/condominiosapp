# Administración financiera

La ruta `/finance` reúne cargos, cuentas por cobrar, aplicaciones de saldo a favor, ajustes, historial por unidad, ingresos/egresos, presupuesto y reportes administrativos. Reutiliza las facturas y los pagos existentes. No incorpora contabilidad de doble partida.

## Activación gradual

1. Desde `backend`, ejecutar `npm run finance:migrate:dry-run` con `MONGODB_URI` configurado para el entorno que se va a revisar. Es una revisión de solo lectura; no muestra credenciales.
2. Resolver manualmente las colisiones mensuales identificadas. El script no elimina facturas ni altera sus importes o pagos. Los cargos antiguos de origen no verificable conservan el tipo `legacy`.
3. Ejecutar `npm run finance:migrate:apply`. Añade metadatos verificables, relaciona excedentes con sus unidades mediante la factura/comprobante de origen e instala el índice único de referencias. Retira únicamente el índice obsoleto `unique_monthly_unit_invoice`. Se puede repetir sin reinicializar créditos consumidos.
4. En **Finanzas → Administración financiera → Configuración**, revisar los saldos del condominio y activar cargos/ajustes/historial. Después activar ingresos/egresos y finalmente presupuesto/reportes. Se pueden mantener condominios desactivados mientras se revisan.

Las transacciones requieren MongoDB con replica set. La migración debe hacerse con la emisión de cuotas pausada o en una ventana de mantenimiento para que la revisión de duplicados y la asignación de referencias se ejecuten sobre datos estables. No usar `syncIndexes`, porque podría retirar índices ajenos a esta ampliación. Revertir el código no borra los nuevos datos; desactivar las etapas detiene nuevas operaciones y moras, conservando los registros existentes.

## Cobros, ajustes y créditos

- `amount` mantiene el cargo original; `paidAmount` refleja dinero aplicado, `adjustmentAmount` descuentos/condonaciones y `creditAppliedAmount` consumo de excedentes. El saldo es el cargo menos esas aplicaciones. Las facturas antiguas completadas sin `paidAmount` conservan saldo cero.
- La cuota mensual tiene una referencia única por organización, condominio, unidad normalizada y período. Cambiar el propietario o pagar no libera esa referencia. Los cargos extraordinarios, individuales y multas tienen referencias independientes.
- La emisión manual y el cron utilizan el mismo servicio de emisión por unidad. La revisión diaria verifica todas las unidades, aunque existan facturas antiguas duplicadas.
- Los lotes y las aplicaciones requieren `idempotencyKey`; repetir la misma operación devuelve el registro existente. Cambiar los datos asociados a la clave produce un conflicto. Un lote inválido se revierte completo.
- Los créditos solo se aplican a facturas de la misma unidad, titular, condominio y moneda. `consumedMinor` registra su consumo; la consulta bancaria de créditos muestra el disponible. Créditos sin unidad identificable quedan visibles para revisión, pero no pueden consumirse.
- Descuentos, condonaciones y aplicaciones se corrigen mediante reversos con motivo, autor y fecha. Un reverso puede reabrir una factura y devolver crédito disponible; no elimina el registro original.
- La conciliación bancaria usa el saldo neto después de ajustes y créditos; un excedente genera crédito vinculado a la unidad. Las facturas con aplicaciones se mantienen en el flujo de transferencia bancaria y no pueden sobrescribirse desde la pasarela.

## Mora

Desactivada por defecto. Cada condominio puede habilitar un importe fijo (en la moneda de la factura) o un porcentaje del saldo pendiente, con días de gracia. Al activar o cambiar la regla, su fecha de vigencia es el día actual en Santo Domingo. Solo considera vencimientos desde esa fecha; no aplica retroactivamente a deuda anterior ni a cargos heredados sin tipo verificable.

El job se ejecuta a las 10:00 en `America/Santo_Domingo`, con ejecución manual disponible. Se crea un cargo separado una sola vez por factura de origen y nunca se calcula mora sobre mora. La fecha de vencimiento de la mora es el día de emisión. Pagar o ajustar el cargo original después no cancela automáticamente una mora ya emitida; puede condonarse con el flujo auditado de ajustes.

## Caja, bancos y presupuesto

- Los ingresos por cuotas vienen de transacciones exitosas con fecha confirmada. La conciliación enlaza el pago y el movimiento, por lo que el movimiento importado no vuelve a contarse como otro ingreso.
- Otros ingresos y gastos se registran cuando el dinero ya se recibió o pagó. Se clasifican por categoría y moneda, con cuenta bancaria o caja y una referencia al soporte documental.
- Los movimientos importados pueden vincularse al registrar la operación o después. Deben coincidir en fecha, cuenta, moneda, importe y dirección, y no pueden estar utilizados por otro registro o comprobante.
- Las transferencias entre cuentas no afectan ingresos ni gastos. Cada lado puede enlazarse a su movimiento importado. No hay conversión automática entre monedas.
- El saldo inicial de cada cuenta representa el saldo al comienzo del día indicado y se define una sola vez. El saldo calculado suma movimientos importados desde ese día y operaciones bancarias manuales aún sin vincular. Antes de vincular una operación manual con su movimiento importado, ambos pueden aparecer en el cálculo; los pendientes de clasificación permiten revisar esa conciliación.
- Los reversos son nuevos registros negativos para el reporte de caja, fechados el día de la corrección. Un reverso de clasificación no inventa una devolución bancaria: el movimiento físico sigue formando parte del estado bancario y queda disponible para reclasificar.
- El presupuesto anual se divide por mes, categoría, tipo y moneda. La revisión protege contra sobrescribir cambios de otro administrador. La comparación toma partidas de meses completos del rango seleccionado; no prorratea meses parciales.

## Reportes y acceso

Los reportes muestran ingresos, egresos, resultado de caja, ejecución presupuestaria, saldo bancario al corte y cuentas por cobrar **actuales**, identificadas con su propia fecha. La cartera tiene tramos vigente, 1–30, 31–60, 61–90 y más de 90 días. Cada moneda conserva sus propios totales.

El historial por unidad es paginado y permite rangos anteriores a los doce meses de la pantalla original. Presenta saldo inicial/final del rango, cargos, aplicaciones y deuda actual. Los pagos heredados sin fecha verificable no se colocan en una fecha inventada: se señalan como pendientes de revisión. Lo mismo aplica a facturas pagadas antiguas sin transacción en el reporte de ingresos. Una factura histórica no clasificada como cuota mensual no impide generar una cuota nueva; revisar estos casos antes de activar el módulo.

Administradores autorizados consultan la continuidad de la unidad. Propietarios solo ven sus propias facturas y aplicaciones en unidades actualmente autorizadas; cambiar el titular no expone datos del anterior. Los endpoints administrativos requieren `finance.read`, `finance.create` o `finance.update`, además del alcance de organización y condominio. Propietarios no pueden emitir cargos ni modificar finanzas.

## API añadida

Todos los endpoints bajo `/api/finance` usan autenticación y el contrato `{ success, data, error, code }`:

| Grupo | Endpoints |
|---|---|
| Configuración | `GET options`; `GET/PUT condominiums/:id/settings` |
| Cargos | `POST charges` (tipo, unidades/importes, fechas, moneda, concepto y clave de operación) |
| Aplicaciones | `POST invoices/:id/adjustments`; `POST invoices/:id/credits`; `POST applications/:id/reversal` |
| Consultas | `GET credits`; `GET receivables`; `GET history` |
| Mora | `POST late-fees/run` |
| Caja | `GET/POST entries`; `POST entries/:id/reversal`; `POST entries/:id/link`; `GET movements` |
| Bancos | `GET accounts`; `PUT accounts/:id/opening-balance`; creación de cuentas por el endpoint bancario existente |
| Presupuesto/reportes | `GET/PUT budget`; `GET report` |

`receivables`, `history`, `entries` y `movements` admiten `page` y `limit` (máximo 200). Las consultas financieras usan `condominiumId`; el historial además requiere `unitNumber`. Presupuesto/reportes usan moneda y año o rango de fechas; el reporte presupuestario abarca un año por consulta. `receivables`, `history` y `report` admiten `format=csv`; el CSV de reportes contiene los ingresos/egresos del período y el de historial incluye todas sus páginas.

## Validación

- `node --test test/finance-rules.test.js` para saldos, moras, antigüedad, CSV y autorización.
- `FINANCE_TEST_MONGODB_URI` habilita `test/finance.integration.test.js`. Cada ejecución crea una base `finance_test_<aleatorio>` y elimina exclusivamente esa base al finalizar. Alternativamente, `FINANCE_TEST_LOCAL=1` usa el MongoDB de Docker local mediante la configuración de `builder.yml`; en Windows usa IPv6 para evitar otra instancia de MongoDB que pudiera escuchar en IPv4.
- `node node_modules/@angular/cli/bin/ng.js build --configuration development --output-path dist/finance-review`, desde `frontend`, compila sin disparar el `postbuild` que recrea contenedores locales.
- `node frontend/e2e/finance.cjs`, desde la raíz, prueba formularios administrativos, recuperación de errores, historial/exportación del propietario y presentación móvil con datos simulados. Las transacciones reales y aislamiento se verifican por separado en las pruebas de integración de MongoDB.

No se activa ningún condominio real ni se aplica la migración al entorno operativo como parte de las pruebas.
