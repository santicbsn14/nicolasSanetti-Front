# Avance 04b — Hero con el video elegido por Nico + cierre de videos

## Qué se hizo

- Paso 0 verificado: remote `santicbsn14/nicolasSanetti-Front`, rama `feat/videos` al día con su remoto, y `origin/development` mergeada (trajo los briefs 03 y 05) **sin conflictos**. El cambio local de `src/Components/AppRoutes.tsx` quedó fuera de los commits.
- Video elegido por Nico: `material-nico/video-portada.mp4`. Es el mismo archivo que `material-nico/VideoLindo.mp4` (comparados byte a byte).
- Dos videos nuevos para el hero (`hero-desktop` y `hero-mobile`), con sus posters, en `src/Components/Videos/`.
- `Home.tsx`: una sola fuente `HERO_VIDEO = { desktop, mobile }`; se sacaron las opciones de prueba, la lectura de `?hero=` y el comentario `// TEMPORAL`. La elección desktop/mobile al montar, `prefers-reduced-motion` y el `muted` forzado para iOS quedaron igual.
- `Home.css`: una sola línea nueva, `object-position: center 20%` en el video del hero (ver Desvíos).
- Borrados los 8 archivos de las opciones de prueba (`hero-espacios-*` y `hero-sillon-*`, `.mp4` y `.webp`). Los originales siguen en `material-nico/`.
- Servicios, `servicio-lavado.mp4`, su poster y `VideoLazy`: sin tocar.
- Material de revisión en [`04b-material/`](04b-material/).

## Datos del original

| Dato | Valor |
|---|---|
| Archivo | `material-nico/video-portada.mp4` (= `VideoLindo.mp4`) |
| Resolución como se ve | 1080×1920, **vertical** (sin rotación en los metadatos) |
| Duración | 36,60 s |
| fps | 30 |
| Códec | H.264 Main, `yuv420p` |
| Peso | 42,84 MB (9,8 Mb/s) |
| Audio | AAC estéreo, 48 kHz (se descarta) |

Hoja de contacto de 8 frames: [`04b-material/hoja-original.jpg`](04b-material/hoja-original.jpg).

Es una producción de moda: una modelo posando con luces de colores (violeta, amarillo, azul, verde, celeste), y dos planos de Nico peinándola. **Tiene destellos negros a propósito** (efecto estroboscópico) en 2,90–3,73 s, 11,80–12,47 s, 13,77–14,60 s, 18,13–18,40 s y 19,40–20,23 s, y **termina con un fundido a negro** que empieza a los 35,0 s.

## Tabla de salidas

Pesos en MB = 1.048.576 bytes, como en los avances 04 y 04a.

| Archivo | Resolución | Recorte | Tramo (s del original) | Duración | fps | CRF final | Peso | Máx. | Poster |
|---|---|---|---|---|---|---|---|---|---|
| `hero-desktop.mp4` | 1080×608 (sin escalar) | 16:9 al ancho completo, `Y` por plano (100–280) | 20,23 → 35,27 | 15,07 s | 30 | 20 | **2,63 MB** | 6 MB | 16,5 KB |
| `hero-mobile.mp4` | 720×1280 | sin recorte (escalado) | 20,23 → 35,27 | 15,07 s | 30 | 26 | **1,43 MB** | 4 MB | 25,6 KB |

Los dos: H.264 High, `yuv420p`, `-preset slow`, `+faststart`, sin audio. Entraron con el CRF inicial, sin subirlo.

**Antes / después:** el original pesa 42,84 MB; lo que baja un visitante de desktop al entrar a `/` es 2,63 MB, y en celular 1,43 MB.

### `Y` por plano (desktop, 608 de alto sobre 1920)

Los planos salen de `select='gt(scene,0.08)'` y `blackdetect`. El `Y` cambia exactamente en el corte.

| Plano (s del original) | Contenido | `Y` |
|---|---|---|
| 20,23–21,73 | Modelo con las manos en la cintura, fondo violeta | 200 |
| 21,73–23,87 | Baile a contraluz, violeta y rojo (luz baja, pero no negro) | 150 |
| 23,87–25,77 | De espaldas, levanta los brazos | 280 |
| 25,77–27,60 | Gira la cabeza hacia atrás, colita | 150 |
| 27,60–31,63 | De frente, fondo verde con plantas | 280 |
| 31,63–35,27 | Primer plano, fondo celeste, toca el rodete | 100 |

Hojas de contacto de 4 frames (10, 35, 65 y 90 %) de cada salida: [`hoja-hero-desktop.jpg`](04b-material/hoja-hero-desktop.jpg) y [`hoja-hero-mobile.jpg`](04b-material/hoja-hero-mobile.jpg). Además se revisó el desktop con frames al principio, al medio y al final de cada plano: ninguna cabeza cortada.

## Archivos

| Archivo | Cambio |
|---|---|
| `src/Components/Videos/hero-desktop.mp4` + `.webp` | Nuevos |
| `src/Components/Videos/hero-mobile.mp4` + `.webp` | Nuevos |
| `src/Components/Videos/hero-espacios-desktop/mobile` (`.mp4` y `.webp`) | Borrados (4) |
| `src/Components/Videos/hero-sillon-desktop/mobile` (`.mp4` y `.webp`) | Borrados (4) |
| `src/Components/Home/Home.tsx` | Una sola fuente de video; sin `?hero=` ni `// TEMPORAL` |
| `src/Components/Home/Home.css` | `object-position: center 20%` en `.hero-section__video` |
| `docs/avances/04b-material/` | Hoja del original, hojas de las salidas y 2 capturas |
| `docs/avances/04b-cierre-videos.md` | Este documento |

## Decisiones

- **Tramo 20,23 → 35,27 s.** El video dura 36,6 s, pero la primera mitad tiene destellos negros cada pocos segundos. El único tramo largo sin negros va de 20,23 s (después del último destello) a 35,0 s (donde empieza el fundido final): son 14,77 s, apenas menos que el mínimo de 15. Para llegar se tomaron 0,27 s del arranque del fundido: ahí la imagen se oscurece solo un ~15 % (luminancia media de 70 a ~56), casi no se nota. Además es el tramo con los planos más lindos (verde y celeste) y no tiene ningún plano de Nico: los dos planos de Nico peinando están en la parte con destellos (0–2,9 s y 16,5–18,4 s).
- **Loop:** termina en el primer plano celeste y vuelve al plano violeta de la modelo con las manos en la cintura; es un corte de plano, como los del resto del video.
- **30 fps:** se dejó la cadencia del original (el mínimo es 25); no se convirtió.
- **Primer intento descartado:** la detección de planos con el umbral del brief 04 (`scene > 0.25`) no veía los destellos ni los cortes dentro de algunas tomas. El primer tramo elegido (3,73 → 19,40 s) tenía cinco destellos negros; se vio en la hoja de control y se rehízo con un umbral más fino y `blackdetect`.
- **Posters:** el mismo instante en las dos versiones (8,9 s de la salida = 29,1 s del original): plano verde, de frente, nítido.
- **Verificación con Chrome:** el Chromium de Playwright no decodifica H.264, así que las pruebas se hicieron con el Chrome instalado (`channel: 'chrome'`).

## Desvíos

- **`object-position: center 20%` en el video del hero** (el brief pedía no cambiar estilos salvo el degradado). Con `object-fit: cover` centrado, el recorte cortaba las cabezas. El video es vertical y las caras están en la parte de arriba del cuadro.
  - **En celular:** el hero mide 390×422 (casi cuadrado), así que se ve solo la franja del medio del video. Cuatro de los seis planos quedaban con la cara cortada arriba o tapada por la navbar. Lo mismo pasaba en tablet vertical (768 × 600).
  - **El arreglo:** correr el recorte hacia arriba. No cambia el layout ni las alturas.
  - **Verificado** con capturas de los 6 planos a 390, 768, 1440 y 1920: todas las caras completas, debajo de la navbar.
- **Duración:** 15,07 s, con 0,27 s del arranque del fundido final (explicado en Decisiones).
- **Degradado de la navbar:** no hizo falta tocarlo. Se revisó la navbar sobre los 6 planos a 1440, incluido el más oscuro (el baile a contraluz), y se lee en todos.

## Pendientes

- **Que Santiago revise el preview** y, si le gusta, hacer el "Paso final" del brief (merge a `development`).
- **Observación, no es de este brief:** en pantallas de 1920 de ancho toda la web (`#root`) mide 1512 px y queda una franja blanca a la derecha, también detrás del hero. Pasa igual en producción (`nicolas-sanetti-front.vercel.app`), así que no lo trae esta rama.
- **Si se quiere un plano de Nico en el hero**, habría que pedir una versión del video sin los destellos negros: los dos planos de Nico quedan del lado de los destellos.

## Verificación

| Prueba | Resultado |
|---|---|
| `npm run build` | Sin errores |
| `grep -rn "hero=" src` y `grep -rn "TEMPORAL" src` | Sin resultados |
| `grep` de `hero-espacios`, `hero-sillon`, `heroEspacios`, `heroSillon` en `src` | Sin resultados |
| `/` a 1440×900 (Chrome, `vite preview`) | Reproduce `hero-desktop` (1080×608), `muted`. Único `.mp4` pedido |
| `/` a 390×844 (mobile) | Reproduce `hero-mobile` (720×1280), `muted`. Único `.mp4` pedido |
| `/` | No se pide el video de Servicios. Sin errores de consola |
| Navbar sobre los 6 planos a 1440 | Se lee en todos |
| Caras en los 6 planos a 390, 768, 1440 y 1920 | Completas (con `object-position`) |

Capturas del Home (pausadas en el mismo frame del poster, como en el 04): [`home-1440.png`](04b-material/home-1440.png) y [`home-390.png`](04b-material/home-390.png).

## Cómo probarlo

- Preview de la rama: `https://nicolas-sanetti-front-git-feat-videos-santicbsn14s-projects.vercel.app/`. Tiene la protección de Vercel: hay que entrar logueado.
- Mirar el hero en compu y en el celular. En el celular conviene mirar un loop entero (15 s) para ver que no se corte ninguna cara.
- En local: `npm run build` y `npx vite preview`.
