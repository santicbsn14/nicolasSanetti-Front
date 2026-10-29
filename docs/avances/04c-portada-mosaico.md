# Avance 04c — Portada nueva: texto + mosaico con el video vertical completo

Rama `feat/videos` (sin mergear a `development`).

## Resumen

- Se reemplazó el hero de video a pantalla completa (brief 04b) por el componente nuevo `Hero`. Tiene el texto, los dos botones y un mosaico con el video vertical **entero en 9:16** entre dos fotos del fotógrafo.
- Hay una sola versión del video para todos los tamaños (`hero-vertical.mp4`). Se borraron `hero-desktop.*` y `hero-mobile.*`.
- `Hero.tsx` y `Hero.css` se copiaron **exactamente** del brief, sin cambios.
- **Punto 4 (`#root` a todo el ancho): se probó y se revirtió.** Rompe la portada de `/historia` (detalle abajo). `App.css` quedó como estaba.

## Video de salida

| | |
|---|---|
| Origen | `material-nico/video-portada.mp4` (1080×1920, 30 fps, 36,6 s, con audio) |
| Tramo | **0 → 35,0 s** (afuera solo el fundido a negro final) |
| Salida | `src/Components/Videos/hero-vertical.mp4`, 720×1280, 30 fps, 35,0 s |
| Encoder | `libx264 -preset slow -profile:v high -pix_fmt yuv420p -crf 26 -movflags +faststart -an` |
| CRF | **26** (el primero que se probó; no hizo falta subirlo) |
| Peso | **3,97 MB** (3.965.932 bytes, límite 4 MB) |
| Planos de Nico | Entran los dos: 0–2,9 s y 16,5–18,4 s |

Comando:

```
ffmpeg -i material-nico/video-portada.mp4 -t 35 -vf scale=720:1280 \
  -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -crf 26 \
  -movflags +faststart -an src/Components/Videos/hero-vertical.mp4
```

Hoja de contacto de 8 frames (uno cada 4,4 s): [`hoja-hero-vertical.jpg`](04c-material/hoja-hero-vertical.jpg).

## Archivos

| Archivo | Detalle | Peso |
|---|---|---|
| `src/Components/Videos/hero-vertical.mp4` | Video del hero (arriba) | 3,97 MB |
| `src/Components/Videos/hero-vertical.webp` | Poster: frame del segundo 1,0 (Nico con la modelo), 720×1280, q80 | 31 KB |
| `src/Components/Imagenes/hero-nico.webp` | `Nico WEB-15.jpg` (1365×2048) → 800×1200, q80 | 32 KB |
| `src/Components/Imagenes/hero-salon.webp` | `Nico WEB-1.jpg` (1365×2048) → 800×1200, q80 | 61 KB |
| `src/Components/Home/Hero.tsx` | Nuevo, contenido exacto del brief | |
| `src/Components/Home/Hero.css` | Nuevo, contenido exacto del brief | |
| `src/Components/Home/Home.tsx` | `<Hero />` en lugar de la `section.hero-section`. Se sacaron los imports de los videos viejos, `HERO_VIDEO`, `elegirHero` y los hooks; queda `import React from 'react'` | |
| `src/Components/Home/Home.css` | Se borró el bloque del hero viejo (`.hero-section`, `__video`, `__content`, `::before` y sus 5 media queries). Antes se verificó con grep que no se usaran en otro lado | |
| Borrados | `hero-desktop.mp4`, `hero-desktop.webp`, `hero-mobile.mp4`, `hero-mobile.webp` | |
| `docs/avances/04c-material/` | Capturas y hoja de contacto (ver abajo) | |

Las fotos tienen proporción 2:3, igual que la salida, así que el `crop` no recorta nada: es solo un escalado.

## Decisiones

- **Poster en el segundo 1,0:** es el primer plano del video (Nico con el spray y la modelo sentada), nítido. El video arranca en ese mismo plano, así que el paso del poster al video no salta.
- **Fotos con ffmpeg (`libwebp`)**, igual que en los briefs anteriores. No hay `cwebp` ni ImageMagick instalados.
- **Pruebas con el Chrome instalado** (`channel: 'chrome'`), como en el 04b: el Chromium de Playwright no decodifica H.264.

## Punto 4 — `#root` a todo el ancho: revertido

Se sacó `max-width: 1512px` de `#root` y se capturaron las 4 páginas a 1920×1080 antes y después (`antes-*-1920.jpg` / `despues-*-1920.jpg`; los `despues-*` muestran el estado **con el cambio**, que después se revirtió).

| Página | Resultado con `#root` a todo el ancho |
|---|---|
| `/` | Mejor: el Home queda centrado y se va la franja oscura a la derecha del carrusel y de las virtudes |
| `/servicios` | Mejor: igual que el Home, sin franja oscura a la derecha |
| `/contacto` | Mejor: el footer llega al borde |
| `/historia` | **Se rompe la portada.** La foto tiene `width: 1512px` fijo (`.port-historia-img`, `Historia.css:34`). Con `#root` a todo el ancho, la foto sigue en 1512 px pegada a la izquierda, la franja negra de precios pasa a ocupar los 1920 y el título "HISTORIA" queda centrado en la pantalla y no en la foto. Ver [`historia-portada-antes-despues.jpg`](04c-material/historia-portada-antes-despues.jpg) (arriba antes, abajo después) |

Como pide el brief, no se arregló: `#root` volvió a `max-width: 1512px` y `App.css` no tiene cambios en este commit.

**Consecuencia en la portada nueva:** en pantallas de más de 1512 px el Home sigue corrido a la izquierda y el degradado cálido del fondo termina en un borde suave a los 1512 px. Se ve en [`home-1920.jpg`](04c-material/home-1920.jpg). Para resolverlo haría falta un brief chico que haga dos cosas: sacar el `max-width` de `#root` y cambiar `width: 1512px` por `width: 100%` en `.port-historia-img`. Habría que revisar también que la foto de Historia no pierda mucho al estirarse a 1920 de ancho.

## Desvíos

- **Punto 4 revertido** (arriba).
- **Capturas de página completa a 1920:** las de Historia (antes y después) se bajaron a 1440 px de ancho para no pasar los 300 KB. El resto quedó en 1920 px, con calidad jpg más baja donde hizo falta. Las del Home a 4 tamaños son de la pantalla visible (no de la página completa), al 80.
- **El celular se probó con la emulación de iPhone 13 en Chrome**, no en un Safari real. Para el autoplay en iOS sigue estando el `video.muted = true` + `play()` del componente, igual que en el 04b.

## Verificación

| Prueba | Resultado |
|---|---|
| `npm run build` | OK |
| `npm run lint` | 0 errores; los 9 warnings son los de siempre (System-Turnos y otros), ninguno en Home/Hero |
| `/` a 1440, 1920, 768 e iPhone 13 (Chrome, `vite preview`) | Se pide **un solo `.mp4`** (`hero-vertical`). Reproduce, `muted`, `loop` |
| Video sin recorte | La caja del video mide exactamente 9:16 (ancho/alto = 0,5625) en los 4 tamaños: 281×500 (1440 y 1920), 304×540 (768), 204×363 (iPhone) |
| `prefers-reduced-motion: reduce` | No se pide ningún `.mp4`, el video queda pausado y se ve el poster |
| "Reservá tu turno" | `https://wa.me/5493364614298?text=…` con "¡Hola Nico! Quiero reservar un turno. ¿Qué disponibilidad tenés?" |
| "Ver servicios" | Navega a `/servicios` |
| `grep -rn "hero-desktop\|hero-mobile\|hero-section" src` | Sin resultados |

Capturas del Home con el video en el poster: [`home-1440.jpg`](04c-material/home-1440.jpg), [`home-1920.jpg`](04c-material/home-1920.jpg), [`home-768.jpg`](04c-material/home-768.jpg) y [`home-390.jpg`](04c-material/home-390.jpg).

## Cómo probarlo

Preview de Vercel: https://nicolas-sanetti-front-git-feat-videos-santicbsn14s-projects.vercel.app/

1. Abrir `/` en desktop: texto a la izquierda y tríptico escalonado a la derecha, con el video completo al medio.
2. Abrir en el celular: texto centrado arriba y debajo el mosaico (video a la izquierda, fotos apiladas a la derecha). El video tiene que arrancar solo.
3. Probar los dos botones.
4. En local: `npm run build && npx vite preview`.

## Pendiente

- Que Santiago y Nico revisen el preview. Recién con su OK se hace el paso final (merge a `development`).
- Decidir si se hace el brief chico de `#root` + Historia (punto 4).
