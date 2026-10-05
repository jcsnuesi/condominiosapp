# Landing basada en la referencia

Implementación: 5 de octubre de 2026.

Skills aplicadas: frontend-design, web-design-guidelines (Vercel), Playwright e imagegen.
Guías revisadas: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

## Decisiones visuales

- Fondo: azul hielo `#edf4fa`; texto principal: `#102b3d`; titular secundario: `#326d93`; acción principal: `#073b58`; texto de apoyo: `#53616c`.
- Manrope 700 para titulares, Inter para cuerpo y controles; fuentes locales.
- Móvil: marca y menú, titular de cuatro líneas, descripción, acciones y teléfono sobre la escena residencial.
- Desktop: texto a la izquierda y teléfono a la derecha sobre una fotografía continua.
- El teléfono es una ilustración HTML/CSS accesible, sin controles simulados que aparenten funcionar. La demo interactiva continúa debajo de la portada.
- Foco visible, menú con Escape, tabs con flechas, enlace para saltar al contenido y reducción de movimiento conservados.

## Imágenes

Generadas con la herramienta integrada image_gen; exportadas a WebP con calidad 83. Son escenas ilustrativas, no propiedades reales. Los originales permanecen en el directorio generated_images de Codex; las copias utilizadas se guardan junto a este archivo.

Desktop: `residencial-azul-1536.webp` y `residencial-azul-720.webp`.
Móvil: `residencial-azul-movil-480.webp` y `residencial-azul-movil-780.webp`.

Prompt desktop:

> Use case: photorealistic-natural. Create a landscape architectural photograph background asset for a condominium management website. Wide 1536x1024 composition. Contemporary white angular mid-rise residential condominium buildings with large clear glass balcony railings on left and right, lush tropical palms and green plants along a quiet landscaped courtyard at bottom. Blue sky with soft light clouds dominates upper half and center, cool clean daylight, white concrete, blue glass, no beige terracotta or sunset. Right building rises higher into upper right edge, left buildings occupy only lower third. View looking slightly upward from courtyard, realistic refined modern Caribbean residential architecture. Keep center mostly open sky and a garden walkway below for a phone mockup to be layered separately in CSS. No phone, no people, no text, no lettering, no logos. Bright fresh understated photography, believable geometry, greenery concentrated bottom edges.

Prompt móvil:

> Use case: photorealistic-natural. Generate a vertical portrait 1024x1536 architectural photograph for the mobile hero background of a condominium website. Cool clean daytime sunlight, pale soft blue sky with delicate clouds fills upper 55 percent. Contemporary brilliant white condominium buildings, three floors, blue glass balcony rails. Right-hand white building appears on far right rising from middle of image around 40 percent height, left-hand white buildings appear bottom left from 63 percent height. Bright green tropical palms, garden, paved path at very bottom. Central lower area open so a phone mockup will later be overlaid by code. Slight upward looking realistic architectural photograph, clean sharp modern Caribbean residences. No text, no logos, no phone, no people, no illustrations, no orange or beige, no sunset. Preserve landscape both edges in this vertical composition; sky behind the upper area for website headline.

## Verificación

Pruebas existentes: `frontend/tests/saas-landing.test.cjs`. Cubren los anchos 320, 360, 390, 768, 1024 y 1440 px, desbordamiento, navegación, teclado, demo, carga de assets, registro y destinos de cuenta. Capturas en `e2e-reports/saas-landing/`.

Resultado: 2 pruebas aprobadas, sin errores de navegador ni assets rotos. Build development aprobado; build optimizado con `production,release-review` aprobado. El perfil production estándar sigue fallando por presupuestos CSS preexistentes en booking-area, create-property, home, inquiry, owner-profile, see-property y staff. No se modificaron esos módulos ni los presupuestos. Los estilos del landing quedan por debajo del límite de error de 10 kB por archivo, con advertencias sobre el umbral de 6 kB.
