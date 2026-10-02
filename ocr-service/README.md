# Servicio interno de extracción bancaria

PaddleOCR extrae evidencia, **nunca confirma pagos**. No tiene credenciales de base de datos. El backend conserva originales, controla permisos, revisión humana y conciliación.

## Arranque

Definir `OCR_SERVICE_TOKEN` (secreto aleatorio de al menos 32 caracteres) en el entorno de Compose o su archivo `.env` sin incorporarlo a Git. Ambos servicios reciben el mismo valor. Sin este secreto el OCR rechaza toda extracción. El servicio también admite `OCR_SERVICE_TOKEN_FILE` para despliegues con Docker secrets.

Desde la raíz: `docker compose -f builder.yml build ocr-service` y `docker compose -f builder.yml up -d ocr-service backend`. No se publica un puerto del OCR en el host. `/health` indica disponibilidad HTTP, no disponibilidad de modelos. La primera extracción descarga modelos españoles en el volumen `ocr-models`; requiere salida a los servidores oficiales de modelos. Precalentar con un comprobante sintético antes de admitir tráfico. Si tarda más de 150 segundos, reintentar tras revisar conectividad/cache.

## Contrato

`POST /extract` cuerpo binario PNG, JPEG o PDF con Content-Type correcto y cabecera `X-OCR-Token`. Respuesta: `fields` (`amount` decimal textual, `currency`, `date` ISO, `reference`, `bank`; campos ausentes/ambiguos son null), `text`, `lines` (texto/confianza/polígono/página), `engine`, `version`, `requiresReview:true`. La confianza describe reconocimiento, nunca autenticidad. Un banco único es una mención, no prueba de cuenta receptora; múltiples bancos dejan bank null.

`POST /statement` admite `text/csv` o `application/pdf`. Devuelve `rows` (`sourceRow,date,amount,currency,reference,description,direction`), `warnings`, `text`, `requiresReview:true`. CSV soporta UTF-8/UTF-16/Windows-1252, preámbulo y columnas Fecha, Descripción, Débito/Crédito o Monto/Importe, Referencia y Moneda. No infiere moneda ni abonos desde una columna Monto sin dirección. PDF devuelve texto y geometría; las filas son sugerencias conservadoras y pueden estar vacías. Es obligatoria la revisión/corrección de dirección y columnas contra el documento antes de importar movimientos. No contabilizar filas PDF o advertencias de CSV automáticamente.

Límites: 10 MB, 20 páginas, 20 megapíxeles/página, 10000 movimientos CSV, una extracción simultánea. Timeout de carga 30 s y proceso aislado 150 s. 401 autenticación, 413 tamaño, 415 tipo, 422 extracción inválida, 503 ocupado/configuración, 504 timeout. Se elimina el archivo temporal al terminar o cancelar. El proceso hijo no registra contenido financiero.

No existe una lista cerrada de bancos: el nombre se toma de etiquetas genéricas `Banco:`, `Banco emisor:` o `Banco receptor:`. Los CSV desconocidos devuelven `rawRows:string[][]` incluyendo preámbulo y encabezado, `headers:[]` y advertencias para seleccionar encabezado/mapear columnas en la aplicación. Las fechas con barras se interpretan día/mes/año; los documentos con otra convención deben corregirse durante la revisión. Un valor como `1,234` es ambiguo y queda sin normalizar.

PDF: las páginas con texto se leen directamente con pdfplumber sin renderizar ni cargar PaddleOCR. Solo las páginas sin texto utilizan OCR. Se reconstruyen filas por coordenadas cuando hay encabezados explícitos de fecha/día, débitos y créditos en cada página. La columna balance no se usa como monto. Un día aislado se completa solo si el texto contiene un único mes y año en español; los valores ambiguos se omiten. Las referencias conservan sus ceros iniciales. Para aplicar cambios al extractor hay que reconstruir el servicio de extracción y reprocesar los estados ya extraídos.

## Verificación

`cd ocr-service; python -m unittest discover -s tests` prueba normalización sin descargar modelos. Dependencias de desarrollo: `pip install pytest pytest-cov mypy black ruff httpx`. Ejecutar pytest, mypy, black y ruff antes de integrar. La imagen usa Python 3.11; Python 3.13 no es objetivo de PaddleOCR fijado.

Fuentes de compatibilidad: https://pypi.org/project/paddleocr/3.2.0/ (soporte PaddlePaddle 3.1.1) y https://paddlepaddle.github.io/PaddleOCR/main/en/quick_start.html (API predict, rec_texts/rec_scores/rec_polys).

Verificado durante implementación: imagen CPU construida; inferencia de imagen sintética con PaddleOCR real bajo usuario sin privilegios, raíz de solo lectura y volumen de modelos; 11 pruebas API/normalización con 95% de cobertura conjunta (el proceso de inferencia se verifica mediante `smoke.py`, no está incluido en ese porcentaje), mypy estricto y ruff sin errores. `smoke.py` usa únicamente comprobantes sintéticos y debe montarse en `/app` al ejecutar la imagen de prueba.
