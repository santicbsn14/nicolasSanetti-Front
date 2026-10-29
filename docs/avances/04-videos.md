# Avance 04 — Videos: hero a pantalla completa + video de Servicios

## Qué se hizo

- Paso 0 verificado: remote `santicbsn14/nicolasSanetti-Front`, se partió de `development` actualizada y todo va en la rama **`feat/videos`** (no se mergeó a `development`).
- Cinco videos comprimidos en `src/Components/Videos/` (H.264 High, `yuv420p`, 25 fps, `+faststart`, sin audio), cada uno con su poster `.webp`.
- Componente `VideoLazy` (`src/Components/Videos/VideoLazy.tsx` + `.css`): `<video muted loop playsInline preload="none">` que asigna el `src` y hace `play()` cuando entra en pantalla (IntersectionObserver, `rootMargin: '200px'`) y `pause()` al salir. Con `prefers-reduced-motion` no reproduce. Captura el rechazo de `play()`. `aria-hidden="true"` si no recibe `ariaLabel`.
- Hero del Home: el `background-image` pasó a ser un `<video>` de fondo (`object-fit: cover`, ocupa toda la sección) con poster. La versión desktop o mobile se decide una sola vez al montar con `matchMedia('(orientation: landscape) and (min-width: 769px)')`. `?hero=sillon` usa la opción 2; si no, Espacios. Está marcado con el comentario `// TEMPORAL`.
- Degradado arriba del hero (`::before`, 160px, `pointer-events: none`) para la legibilidad de la navbar. Es **claro**, no oscuro: ver Desvíos.
- Se sacaron `background-size`, `background-position`, `background-repeat` y `background-attachment` del CSS del hero. Las alturas quedaron iguales.
- Servicios: "Lavado y peinado" usa `VideoLazy` con `servicio-lavado.mp4` y su poster, con la misma clase `servicio-media`.
- Borrados `src/Components/Imagenes/Lavado.mp4` (el original sigue en `material-nico/`) y `port-NicoSanetti-.webp`, que quedó sin uso (verificado con `grep`).
- Material de revisión en [`04-material/`](04-material/): 5 hojas de contacto, 4 capturas del hero y 1 de Servicios.

## Tabla de videos de salida

Pesos en MB = 1.048.576 bytes, igual que en el avance 04a. El `Y` es el desplazamiento del recorte sobre la fuente de 1080×1920 (ver la tabla de abajo).

| Archivo | Fuente | Resolución | Recorte `Y` | Tramo (s de la fuente) | Duración | CRF final | Peso | Máx. | Poster |
|---|---|---|---|---|---|---|---|---|---|
| `hero-espacios-desktop.mp4` | Espacios | 1080×608 (sin escalar) | por plano, 150–950 | 0,00 → 21,76 (completo) | 21,76 s | 23 | **2,19 MB** | 6 MB | 25 KB |
| `hero-espacios-mobile.mp4` | Espacios | 720×1280 | sin recorte | 0,00 → 21,76 (completo) | 21,76 s | 26 | **1,87 MB** | 4 MB | 40 KB |
| `hero-sillon-desktop.mp4` | sillon 1 | 1080×608 (sin escalar) | por plano, 0–750 | 9,56 → 25,00 | 15,44 s | 23 | **1,70 MB** | 6 MB | 15 KB |
| `hero-sillon-mobile.mp4` | sillon 1 | 720×1280 | sin recorte | 9,56 → 25,00 | 15,44 s | 26 | **1,74 MB** | 4 MB | 38 KB |
| `servicio-lavado.mp4` | Sillon 2 | 1080×900 → 720×600 | por plano, 0–500 | 12,16 → 32,00 | 19,84 s | 26 | **1,22 MB** | 3 MB | 19 KB |

**Antes / después del video de Servicios:** `Lavado.mp4` pesaba 19,85 MB (1080×1920, con audio) y ahora pesa 1,22 MB (−94 %). El video que baja un visitante de desktop al entrar a `/` es de 2,19 MB.

### `Y` por plano

Cada fila es un plano (corte duro detectado con `select='gt(scene,0.25)'`). El `Y` cambia exactamente en el corte, así que el salto no se ve.

**Espacios (desktop, 608 de alto):**

| Plano (s) | Contenido | `Y` |
|---|---|---|
| 0,00–3,28 | Sillones de corte con espejos de pie | 950 |
| 3,28–4,64 | Sillón en primer plano | 900 |
| 4,64–5,92 | Mesas con revistas y flores | 500 |
| 5,92–7,24 | Lavacabezas | 450 |
| 7,24–8,44 | Araña, espejos redondos y lavado | 150 |
| 8,44–9,84 | Estantes de vidrio | 600 |
| 9,84–11,00 | Estantería con productos | 600 |
| 11,00–12,28 | Mano con Olaplex | 500 |
| 12,28–13,52 | Botellas L'Oréal | 550 |
| 13,52–14,84 | Mostrador con flores | 450 |
| 14,84–17,44 | Mano con la ducha del lavacabezas | 750 |
| 17,44–21,76 | Salón con araña, espejo, sillón negro y sillones de corte | 420 |

**sillon 1 (desktop, 608 de alto):**

| Plano (s) | Contenido | `Y` |
|---|---|---|
| 9,56–10,64 | Clienta en el lavacabezas | 250 |
| 10,64–11,48 | Ducha sobre la cabeza | 60 |
| 11,48–12,92 | Olaplex en la mesada | 550 |
| 12,92–14,08 | Manos en el pelo | 300 |
| 14,08–14,88 | Plano general, Nico lavando | 450 |
| 14,88–16,56 | Manos de Nico y cara de la clienta | 750 |
| 16,56–17,36 | Toallas | 400 |
| 17,36–18,24 | Café y revistas | 550 |
| 18,24–20,80 | Juego de té | 550 |
| 20,80–21,56 | Clienta tomando café | 0 |
| 21,56–22,80 | Nico peinando, frente al espejo | 220 |
| 22,80–25,00 | Nico peinando, otro ángulo | 160 |

**Sillon 2 (Servicios, 900 de alto, después escalado a 720×600):**

| Plano (s) | Contenido | `Y` |
|---|---|---|
| 12,16–13,44 | Clienta en el lavacabezas | 250 |
| 13,44–14,68 | Ducha sobre la cabeza | 0 |
| 14,68–15,56 | Olaplex | 400 |
| 15,56–17,36 | Manos en el pelo | 250 |
| 17,36–19,96 | Plano general, Nico lavando | 200 |
| 19,96–20,88 | Manos de Nico y cara de la clienta | 350 |
| 20,88–22,44 | Toallas | 500 |
| 22,44–23,84 | Café y revistas | 400 |
| 23,84–25,80 | Juego de té | 500 |
| 25,80–27,16 | Clienta tomando café | 0 |
| 27,16–28,68 | Nico peinando, frente al espejo | 100 |
| 28,68–32,00 | Nico peinando, otro ángulo | 0 |

## Archivos creados o modificados

| Archivo | Cambio |
|---|---|
| `src/Components/Videos/*.mp4` (5) | Nuevos: videos comprimidos |
| `src/Components/Videos/*.webp` (5) | Nuevos: posters, mismo tamaño que cada video |
| `src/Components/Videos/VideoLazy.tsx` | Nuevo: video que se carga al acercarse a la pantalla |
| `src/Components/Videos/VideoLazy.css` | Nuevo: `object-fit: cover`, ocupa el contenedor |
| `src/Components/Home/Home.tsx` | Hero con `<video>`, elección de versión y opción, `// TEMPORAL` |
| `src/Components/Home/Home.css` | Estilos del video, degradado `::before`, sin `background-*` del hero |
| `src/Components/Services/Services.tsx` | `VideoLazy` con `servicio-lavado.mp4` + poster |
| `src/Components/Imagenes/Lavado.mp4` | Borrado |
| `src/Components/Imagenes/port-NicoSanetti-.webp` | Borrado (sin uso) |
| `docs/avances/04-material/` | Hojas de contacto y capturas |
| `docs/avances/04-videos.md` | Este documento |

## Decisiones durante la implementación

- **Tramos:** se cortan siempre en un cambio de plano, así el loop no salta a mitad de una toma.
  - `sillon 1` arranca en 9,56 s: el plano de 8,04–9,56 tiene la cabeza de Nico arriba de todo y la de la clienta a la mitad, y no entran juntas en 608 px. Termina en 25,00 s, justo donde empieza el plano final repetido con `Sillon 2` (Nico con la clienta frente a las plantas).
  - `Sillon 2` va de 12,16 a 32,00 s: lavado, Olaplex, café y peinado, que es justo lo que nombra la sección "Lavado y peinado". Termina antes del mismo plano final repetido.
  - El loop une un plano de Nico peinando con el del lavacabezas, en los dos.
- **Pesos:** los cinco entraron con el CRF inicial (23 en desktop y 26 en el resto) y con mucho margen. No se bajó el CRF para aprovechar ese margen porque el brief dice partir de esos valores.
- **Posters:** un frame nítido de cada versión (Espacios a 19,0 s: araña, espejo y sillón; `sillon` a 24,86 s: Nico peinando; Servicios a 12,8 s: lavado). El primer frame elegido para `sillon` desktop (23,6 s) salió movido y se cambió. El más pesado ocupa 40 KB (máx. 120 KB).
- **`muted` en el hero:** además del atributo, se fija `video.muted = true` y se llama a `play()` al montar. React no siempre deja el atributo `muted` en el DOM, y sin él iOS bloquea el autoplay.
- **`prefers-reduced-motion` en el hero:** sin `autoPlay` y con `preload="none"`, así no se descarga el video y queda solo el poster.
- **Material de revisión:** las capturas del hero se tomaron pausando el video en el mismo frame del poster, para que sean comparables. Las hojas de contacto usan los frames al 10, 35, 65 y 90 % de cada video de salida, igual que en el 04a.

### Verificación (puppeteer sobre `vite preview`)

| Prueba | Resultado |
|---|---|
| `/` a 1440×900 | Reproduce `hero-espacios-desktop`. Único `.mp4` pedido |
| `/?hero=sillon` a 1440×900 | Reproduce `hero-sillon-desktop`. Único `.mp4` pedido |
| `/` y `/?hero=sillon` a 390×844 (mobile) | Reproducen `hero-espacios-mobile` y `hero-sillon-mobile` |
| `/` | El video de Servicios no se pide |
| `/servicios` con ventana de 400px de alto | No se pide con el borde a 260px. Se pide y reproduce con el borde a 150px (dentro de los 200px). Se pausa al salir |
| `prefers-reduced-motion: reduce` | Hero pausado en el poster, ningún `.mp4` pedido. En Servicios, el video ni siquiera recibe `src` |
| `npm run build` | Sin errores. Ningún `.mp4` de `dist/assets` pasa su máximo |

## Desvíos respecto al brief

- **Degradado claro en vez de oscuro.** El brief pide un degradado de `rgba(0,0,0,0.45)` a transparente asumiendo texto claro, pero la navbar del Home tiene texto **oscuro** (`#131313`) sobre fondo transparente: no existe ningún estilo `navbar--home`. Se compararon capturas de la navbar en 8 momentos de cada video con degradado oscuro, claro y sin degradado. Con el oscuro el texto desaparece en los planos oscuros (por ejemplo, el pelo mojado en `sillon` o el sillón negro en Espacios). Con el claro se lee en los 16 frames. Quedó `rgba(255,255,255,0.6)` → transparente, con los mismos 160px y `pointer-events: none`. Si en el futuro la navbar del Home pasa a texto blanco, hay que invertirlo.
- **Recorte con `Y` por plano en vez de un único `Y`.** El material tiene planos con las cabezas a alturas muy distintas, y con un solo `Y` siempre se cortaba alguna. `crop` de ffmpeg acepta una expresión según el tiempo (`if(lt(t,…),…)`), así que el `Y` cambia justo en cada corte duro, donde no se nota. Están todos documentados arriba.
- **Un límite en el recorte de `sillon 1` desktop.** En los dos últimos planos (21,56–25,00 s) Nico está parado y la clienta sentada, de espaldas. En 608px no entran enteros los dos. Se priorizó la cabeza de Nico completa, y de la clienta se ve la parte de arriba de la cabeza (de espaldas, sin cara). Se ve en el último frame de [`hoja-hero-sillon-desktop.jpg`](04-material/hoja-hero-sillon-desktop.jpg). En mobile no pasa porque no hay recorte.
- **Dos commits.** El brief pide un commit. Se hizo el de código con el mensaje indicado, y el avance va en un segundo commit, porque la URL del preview existe recién después del push.

## Pendientes o problemas

- **El preview está protegido por Vercel Authentication.** El alias de la rama redirige a `vercel.com/sso-api`. Santiago lo puede abrir con su sesión de Vercel. Para que lo vea Nico hay que generar un link para compartir (botón "Share" del deployment) o desactivar la protección de previews en *Settings → Deployment Protection*.
- **Elegir opción con Nico** y después dejar una sola: borrar la otra rama de `HERO_VIDEOS`, sus 4 archivos (mp4 + webp, desktop y mobile), el `?hero=` y el comentario `// TEMPORAL`.
- Hay margen de peso de sobra: si al verlo en pantallas grandes el hero desktop se ve blando, se puede bajar el CRF (por ejemplo a 20) y seguir lejos de los 6 MB.
- `AppRoutes.tsx` sigue con un cambio local sin commitear que no es de este brief (borra el comentario sobre los turnos ocultos). Quedó fuera del commit, igual que en el brief 03.

## Cómo probarlo

**Preview de Vercel** (rama `feat/videos`; requiere sesión, ver Pendientes):
- Opción 1, Espacios: <https://nicolas-sanetti-front-git-feat-videos-santicbsn14s-projects.vercel.app/>
- Opción 2, sillon: <https://nicolas-sanetti-front-git-feat-videos-santicbsn14s-projects.vercel.app/?hero=sillon>
- Deployment en el dashboard: <https://vercel.com/santicbsn14s-projects/nicolas-sanetti-front/FsK4YW5UffGkhzEWU4SKEinepRF5>

**Local:**
1. `git switch feat/videos`, `npm run build`, `npm run preview`.
2. Abrir `/` y `/?hero=sillon` en desktop y con el emulador de mobile (390×844). La versión se elige al cargar, así que después de cambiar el tamaño hay que recargar.
3. Pestaña Network, filtro `mp4`: al cargar `/` aparece un solo video. En `/servicios`, con la ventana baja, el video del lavado aparece recién al acercarse a la sección.
4. DevTools → Rendering → *Emulate CSS media feature prefers-reduced-motion: reduce*: se ven los posters y no se descarga ningún video.
5. Revisar la navbar sobre el video en las dos opciones, y las hojas de contacto en `docs/avances/04-material/`.
