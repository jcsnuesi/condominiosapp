# Comprobantes de transferencias y conciliación bancaria

## Regla de confianza

PaddleOCR extrae texto y propone campos. Su confianza mide reconocimiento de texto, no autenticidad del comprobante ni recepción de dinero. Un comprobante recibido o leído no debe completar una factura. La confirmación exige un abono del estado de cuenta de la cuenta receptora del condominio y la revisión de un administrador autorizado.

El estado de cuenta lo carga la administración, no el propietario. CSV y PDF son formatos de entrada; cualquier extracción PDF y cualquier campo corregido deben revisarse contra el archivo original antes de importar movimientos. No se presume una integración directa con el banco.

El flujo es agnóstico al banco: los nombres de bancos son texto libre, las cuentas se registran por condominio y los datos extraídos se revisan sin exigir una plantilla o un catálogo cerrado de entidades. Un formato desconocido requiere completar o corregir los datos, nunca suponer que el pago es válido.

## Reglas contables

Los cálculos se realizan en unidades monetarias menores, con moneda explícita. El importe original de la factura se conserva.

| Factura | Abono bancario confirmado | Importe aplicado | Pendiente | Balance a favor |
| --- | --- | --- | --- | --- |
| RD$5,000 | RD$3,000 | RD$3,000 | RD$2,000 | RD$0 |
| RD$5,000 | RD$5,000 | RD$5,000 | RD$0 | RD$0 |
| RD$5,000 | RD$6,000 | RD$5,000 | RD$0 | RD$1,000 |

Los pagos parciales acumulados reducen el saldo pendiente. El excedente se registra a favor del propietario en el mismo condominio y moneda, con trazabilidad al movimiento bancario. Repetir la confirmación o importar nuevamente el mismo movimiento no debe duplicar el pago ni el crédito.

Esta versión aplica cada movimiento a una factura y registra el excedente como crédito. El crédito no se aplica automáticamente a facturas futuras. La distribución de una transferencia entre varias facturas requiere una ampliación explícita del flujo de aplicación.

Una factura utiliza un solo flujo de pago: transferencia conciliada o pasarela. Un bloqueo persistente evita que una respuesta tardía de la pasarela sobrescriba un pago parcial bancario. Esta versión no ofrece cambio automático de flujo ni desbloqueo desde la interfaz después de iniciar una pasarela; ese caso requiere revisión antes de habilitar otro método.

## Separación de responsabilidades

- Angular: carga de comprobantes, revisión de extracción, importación de estados y confirmación administrativa.
- Node.js/MongoDB: permisos, almacenamiento privado, trabajos persistentes, movimientos, conciliación y contabilización atómica.
- Python/PaddleOCR: extracción de imágenes/PDF y normalización de campos; nunca modifica facturas ni saldos.
- Docker Compose: servicio OCR interno sin puerto público, caché de modelos persistente y originales privados almacenados en MongoDB.

## Verificación funcional

1. Subir un comprobante legible: los campos aparecen como extraídos y el pago continúa pendiente.
2. Subir uno ilegible: se solicita revisión sin inventar monto, moneda, fecha o referencia.
3. Importar CSV con codificación UTF-16 y cabecera de reporte: identificar la tabla de movimientos, revisar sus columnas y distinguir débitos de créditos.
4. Importar PDF: comparar los datos extraídos contra el original; resolver filas ambiguas antes de confirmar la importación.
5. Confirmar un abono parcial, uno exacto y uno con excedente: comprobar la tabla contable anterior.
6. Reintentar una confirmación y confirmar simultáneamente el mismo movimiento: debe contabilizarse una sola vez.
7. Subir el mismo comprobante e importar estados con períodos superpuestos: no generar créditos duplicados; las colisiones ambiguas necesitan revisión.
8. Intentar acceder a archivos, facturas o movimientos de otra organización, condominio o propietario: denegar acceso.
9. Intentar confirmar una transferencia mediante las rutas antiguas sin movimiento bancario: rechazarla.
10. Reiniciar el procesamiento OCR: recuperar los trabajos pendientes sin confirmar pagos ni perder los originales.

## Operación

Los logs del contenedor OCR registran `OCR request started`, `OCR extraction completed` y `OCR request finished` con un identificador local para relacionar los eventos, duración y estado HTTP. La finalización informa el número de líneas y campos detectados, sin valores financieros, texto del documento ni tokens. Los errores de autenticación y extracción también generan un evento final con su estado HTTP. `/health` no genera estos registros. Consultar con `docker compose -f builder.yml logs -f ocr-service`.

Para comprobar la comunicación autenticada y el procesamiento real del backend sin escribir en MongoDB, copiar un comprobante al contenedor backend y ejecutar `docker compose -f builder.yml exec -T backend node scripts/checkReceiptOcr.js /tmp/comprobante.jpeg`. El diagnóstico informa el estado de salud, el estado final del worker y los campos extraídos; no imprime credenciales. El archivo contiene datos financieros: eliminar la copia temporal al terminar.

La extracción admite fechas con meses en español y montos debajo de su etiqueta en columnas separadas del impuesto. Una referencia numérica sin etiqueta se admite en comprobantes que muestran «TRANSACCIÓN PROCESADA» y un único identificador independiente. Los pasos de navegación, como «Confirmación Completado», no son referencias. Si el nombre del banco no aparece en la imagen, se conserva vacío; el nombre del archivo no acredita el banco. Los comprobantes ya procesados conservan su extracción anterior hasta corregirse o cargarse nuevamente tras eliminar el registro pendiente.

El backend conecta a `http://ocr-service:2020` dentro de la red de Compose. Compose entrega el mismo `OCR_SERVICE_TOKEN` a ambos servicios y espera a que el OCR esté saludable antes de iniciar el backend. Payment Monitor actualiza automáticamente los comprobantes pendientes y el detalle abierto al terminar la extracción. `OCR_SERVICE_UNREACHABLE` identifica un fallo de conexión; `OCR_SERVICE_TIMEOUT` indica que se agotó el tiempo de espera.

Configurar `OCR_SERVICE_TOKEN` en el entorno de Compose o en un archivo `.env` en la raíz, tomando como referencia `.env.ocr.example`. Utilizar un valor aleatorio de al menos 32 caracteres, compartido entre backend y servicio OCR. El `.env` del backend por sí solo no proporciona variables a la interpolación de Compose. Sin token válido la extracción falla de forma explícita; no se confirma ningún pago.

Validar configuración con `docker compose -f builder.yml config --quiet`. Para construir los servicios: `docker compose -f builder.yml build backend ocr-service`. La activación posterior usa `docker compose -f builder.yml up -d backend ocr-service`. MongoDB debe funcionar como replica set para que la importación y la contabilización sean atómicas.

El frontend tiene un `postbuild` que recrea el contenedor frontend. Para validar compilación sin desplegar, ejecutar desde `frontend`: `node node_modules/@angular/cli/bin/ng.js build --configuration development --output-path dist/ocr-review`.

La primera carga de modelos OCR puede requerir acceso a Internet y más tiempo que las siguientes. Las dependencias y modelos se fijan en el servicio para evitar cambios de comportamiento inesperados. Debe conservarse una muestra anonimizada por banco para evaluar extracción; el formato PDF puede variar entre bancos y no garantiza extracción automática completa.

El backend admite originales de hasta 8 MiB y hasta 1000 movimientos revisados por importación. Los PDF admiten hasta 20 páginas en el servicio. El procesador conserva trabajos en MongoDB, usa una reserva temporal de cinco minutos y hasta tres intentos; los fallos quedan visibles y pueden reintentarse. Los archivos originales solo se descargan mediante una ruta autenticada.

Las sugerencias comparan cuenta receptora, monto, moneda y fechas dentro de cinco días. Una referencia ausente o distinta exige una justificación administrativa. No se considera que el nombre del banco emisor tenga que coincidir con el banco receptor. Los estados con movimientos ya importados se bloquean para revisión; se pueden quitar únicamente las filas verificadas como repetidas. Sin un identificador bancario estable no puede garantizarse distinguir automáticamente todos los movimientos idénticos.

Los abonos disponibles del mismo monto y moneda que quedan fuera del margen de fechas se muestran en «Movimientos importados descartados», con las razones de exclusión. La existencia de un movimiento importado no habilita por sí sola la confirmación. Si las fechas originales son correctas, debe identificarse el abono correspondiente; una nota por diferencia de referencia no anula la restricción de fecha.

Prueba de integración: definir `BANK_TEST_MONGODB_URI` apuntando a un replica set aislado y ejecutar desde `backend` `node --test test/bank-reconciliation.integration.test.js`. La prueba crea una base `ocr_test_*` aleatoria y elimina exclusivamente esa base al terminar. Sin esa variable, se omite la integración y las pruebas unitarias siguen disponibles.

La instalación de skills del agente es independiente de las dependencias de producción: `python-pro` y `fastapi-expert` ayudan al desarrollo; el contenedor instala sus propias bibliotecas.
