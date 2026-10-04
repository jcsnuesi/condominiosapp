# Presentación pública de CondominiosApp

La ruta exacta `/` carga de forma diferida `SaasLandingComponent`, fuera del layout protegido. `/landing` redirige a la misma página. Los enlaces por sección funcionan con el router de Angular y su navegación por hash.

Todos los accesos de creación llevan a `/auth/register`, que conserva la elección ADMIN / OWNER personal. Los residentes de organizaciones siguen recibiendo sus credenciales de su administración. El login incluye «Conocer CondominiosApp» para regresar a la presentación.

«Ir a mi cuenta» utiliza una sesión local vigente y su contexto de acceso: ADMIN con onboarding pendiente → `/onboarding`; OWNER sin organización → `/smart-home`; demás usuarios → `/start/:id`. Este cálculo solo decide el enlace; los guards y la API siguen validando los accesos.

## Compilación para revisión y publicación

Desde `frontend`, ejecutar:

```powershell
npx.cmd ng build --configuration production,release-review --output-path dist/saas-landing-production
```

El resultado usa configuración de producción, recursos con hash y API relativa `/api/`. El directorio completo `frontend/dist/saas-landing-production` es el paquete publicable. No ejecutar `npm run build` para revisar esta página: la configuración de desarrollo del proyecto escribe en `nginx/html` y el postbuild inicia Docker.

La compilación estándar de producción mantiene sus límites originales. Actualmente falla porque booking-area, create-property, inquiry, owner-profile, see-property y staff exceden el límite de 10 kB por hoja de estilos; la nueva página también lo excede. El paquete inicial de la aplicación completa mide aproximadamente 7,96 MB y excede el límite original de 5 MB. `release-review` permite hasta 22 kB por hoja y 9 MB iniciales, manteniendo las advertencias originales de 6 kB y 3 MB. Es una excepción explícita para generar el artefacto de revisión, no una corrección de esos presupuestos.

## Pruebas

Desde la raíz del repositorio, con Node 22 y Playwright/Chromium disponibles localmente:

```powershell
node --experimental-strip-types --test frontend/tests/saas-landing.test.cjs
```

La prueba sirve el paquete compilado en un puerto local temporal y cierra el servidor y Chromium al terminar. Comprueba la ruta pública y el alias, pestañas con teclado, preguntas frecuentes, menú móvil, enlace desde login, elección de ambas cuentas y destinos de sesiones sintéticas. Revisa anchuras de 1440, 1024, 768, 390 y 320 píxeles, ausencia de desplazamiento horizontal y visibilidad del botón principal antes de desplazarse. Las capturas quedan en `e2e-reports/saas-landing`.

Los datos de sesión son sintéticos y las respuestas de API de registro y verificación se simulan para comprobar los formularios completos; estas pruebas no crean usuarios reales, no envían correos ni verifican una entrega real de credenciales. Los flujos de API de registro y verificación se conservan sin cambios.

Validación realizada el 4 de octubre de 2026: compilación optimizada completada (hash `23e51081ad5d9c18`), dos pruebas aprobadas, sin errores de ejecución en Chromium y sin desbordamiento horizontal en las cinco anchuras. Se revisaron capturas de escritorio, tablet y móvil. Las combinaciones principales de texto/fondo tienen relaciones de contraste de 11,65:1 (texto), 5,24:1 (secundario), 6,08:1 (verde sobre pastel) y 18,88:1 (botón principal).

El ZIP `frontend/dist/condominiosapp-landing.zip` incluye `index.html`, recursos y `release-manifest.json` con hashes SHA-256. Los archivos servidos de `nginx/html` no se modificaron. La versión publicada y la entrega real de correos todavía deben comprobarse después de publicar.

## Comprobación al publicar

Publicar juntos `index.html` y todos los recursos de este paquete, preservando la configuración existente que sirve `/api/`. Antes de reemplazar archivos, conservar una copia del paquete anterior. Esta implementación no realiza la publicación.

Después de publicar, comparar los nombres con hash de los scripts referenciados en el `index.html` servido con los del paquete entregado. Si se incluye `release-manifest.json`, comparar también sus hashes SHA-256 con los archivos servidos. Revisar caché del navegador/proxy si continúa apareciendo la pantalla anterior.

Abrir la plataforma sin cookies debe mostrar «Tu condominio, organizado en un solo lugar»; `/landing` debe mostrar la misma página. Revisar registro ADMIN y OWNER personal, login y destinos con sesiones reales en el entorno publicado. La captura anterior no constituye evidencia de esta versión.
