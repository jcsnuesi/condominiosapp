# Imágenes de la landing

Creación: 4 de octubre de 2026. Las tres escenas fueron generadas con la herramienta integrada OpenAI ImageGen para esta implementación. Son imágenes ilustrativas: no representan clientes, residentes ni propiedades reales de CondominiosApp. No proceden de un banco de fotografías ni requieren una licencia de stock de terceros. Su uso está sujeto a los términos de OpenAI aplicables a la cuenta que las generó; no se afirma exclusividad.

| Asset | Uso | Versiones | Tamaño aproximado |
| --- | --- | --- | --- |
| `residencial` | Hero y cierre; edificios y jardín tropical | 720 y 1280 px | 100 y 261 KiB |
| `comunidad` | Vecinos coordinando una actividad | 640 y 960 px | 46 y 76 KiB |
| `hogar` | Vivienda conectada con lámpara y sensor | 640 y 960 px | 51 y 101 KiB |

Originales: 1536 × 1024 px, conservados en el directorio de imágenes generadas de la sesión. Copias optimizadas en WebP, calidad 82, reducción Lanczos, proporción 3:2. El código aplica recortes con `object-fit: cover`, declara dimensiones y ofrece `srcset`/`sizes`. El hero tiene `fetchpriority="high"` y no utiliza carga diferida; las imágenes inferiores sí.

## Prompts finales

+1. Use case: photorealistic-natural. Asset: wide landing hero photograph, 1536x1024. Contemporary mid-rise residential condominium in Santo Domingo, Dominican Republic, three to five stories with believable warm white concrete architecture, balconies, shade pergolas, lush tropical courtyard, palms, broad-leaf plants, welcoming pedestrian pathway. Human-scale, attainable architecture, no luxury resort or skyscrapers. Natural late afternoon sun, soft shadows, rich leafy greens, warm ivory, subtle terracotta. Editorial architectural photography, real materials, carefully correct geometry, wide composition. No text, signs, logos or watermarks.
2. Use case: photorealistic-natural. Asset: landscape community lifestyle photograph, 1536x1024. Three adult Dominican/Latin American neighbors of diverse brown skin tones casually planning a gathering around a small wooden table in an open shaded condominium common-area terrace, one notebook on table, relaxed candid conversation, natural hands, no looking at camera. Tropical courtyard greenery and warm white mid-rise apartment balconies in background. Simple everyday clothing, linen and cotton, warm late afternoon sunlight, gentle shadows, leafy green and ivory palette with a small terracotta accent. Real editorial photography, not corporate stock posing. No text, logos, watermarks.
3. Use case: photorealistic-natural. Asset: landscape smart home photograph, 1536x1024. A lived-in contemporary Dominican apartment living room, warm white walls, wooden console, subtle small smart home sensor near the entry doorway and a tasteful small connected table lamp switched on, plants, comfortable linen sofa, balcony opening to tropical vegetation. Show the actual home environment, no invented screen UI, no futuristic holograms. Natural late afternoon light, soft shadows, leafy greens, warm ivory, understated terracotta cushion, editorial interiors photography. Believable device forms, clean geometry. No text, logos, watermarks.

## Tipografías

Manrope 600 y 700: descargadas de la API oficial de Google Fonts y alojadas aquí en TTF. Licencia SIL Open Font License 1.1, incluida en `Manrope-OFL.txt`. Fuentes: https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&display=swap y https://github.com/google/fonts/tree/main/ofl/manrope.

Inter regular y semibold: reutilizadas de los assets existentes del proyecto, sin nuevas dependencias externas.
