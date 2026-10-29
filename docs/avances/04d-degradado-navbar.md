# Avance 04d — Degradado de "virtudes" en mobile + navbar legible al scrollear

Rama `feat/videos` (sin mergear a `development`).

## Resumen

- **Degradado de virtudes:** los dos brillos pasaron de `::before`/`::after` (60% de ancho, `circle`) a capas del mismo `background` con elipses relativas a la sección. En celular ya no hay franjas verticales con bordes duros. En desktop se ve casi igual que antes.
- **Navbar:** cuando se scrollea más de 10 px, toma la clase `navbar--scrolled` y pasa a fondo blanco con una sombra suave. Arriba de todo sigue transparente, como antes.
- El código es el del brief, sin cambios.

## Archivos

| Archivo | Cambio |
|---|---|
| `src/Components/Home/Home.css` | Nueva regla `.virtudes-section` (la primera del archivo); borradas `.virtudes-section::before` y `::after`. Los media queries de `padding` y `.virtudes-grid` siguen igual |
| `src/Components/Navbar/Navbar.tsx` | Contenido del brief: estado `scrolled`, listener de `scroll` (`passive`) y clase `navbar--scrolled` en el `<header>`. Se comparó con `diff` contra el texto del brief: solo difiere en una línea en blanco al final, que ya estaba en el archivo |
| `src/Components/Navbar/Navbar.css` | `transition` con `box-shadow` y la regla nueva `.navbar--scrolled` justo después de `.navbar` |
| `docs/avances/04d-material/` | Capturas (ver abajo) |

Se revisó que ninguna regla con `navbar--home`, `--servicios`, `--historia` o `--contacto` le ponga fondo a la navbar, así que nada pisa `navbar--scrolled`.

## Desvíos

- **La rama `feat/videos` se volvió a crear.** Este brief daba por hecho que el 04c todavía no estaba mergeado, pero Santiago ya había confirmado el paso final: `feat/videos` estaba mergeada a `development` (`6faf336`) y borrada, en local y en GitHub. Se recreó desde `development` y se pusheó con el mismo nombre, así que el preview de Vercel vuelve a la misma URL. Por eso **el "paso final" de este brief es solo el merge del 04d**: los briefs 04, 04b y 04c ya están en `development`.
- **Capturas de "solo la sección":** en las de después se ocultaron la navbar fija y el botón flotante de WhatsApp, que tapaban parte de la sección. Las de antes (`antes-virtudes-*`) se sacaron sin ocultarlos.
- Se sumaron capturas de antes (`antes-*`) para comparar, y dos del menú hamburguesa abierto.

## Verificación

| Prueba | Resultado |
|---|---|
| `npm run build` | OK |
| `npm run lint` | 0 errores; los mismos 9 warnings de siempre, ninguno en Navbar ni Home |
| Virtudes a 390, 768 y 1440 | Sin franjas ni bordes duros en ningún ancho. En 1440, brillo arriba a la izquierda y abajo a la derecha, igual que antes |
| Navbar arriba de todo en `/`, `/servicios`, `/historia`, `/contacto` (1440) | Clase sin `navbar--scrolled`, fondo `rgba(0,0,0,0)`, sin sombra: igual que antes |
| Navbar scrolleada sobre virtudes (390 y 1440) | `navbar--scrolled`, fondo `#fff`, sombra `0 2px 12px rgba(0,0,0,.08)`. Se lee el logo y el menú |
| Menú hamburguesa a 390, sin scroll y con scroll | Cerrado → abre (visible) → cierra, en los dos casos |

Probado con Chrome (Playwright, `channel: 'chrome'`) sobre `vite preview`.

## Capturas (`04d-material/`)

- Sección sola: `virtudes-390.jpg`, `virtudes-768.jpg`, `virtudes-1440.jpg` (antes: `antes-virtudes-*`).
- Scrolleada hasta la sección oscura: `scroll-virtudes-390.jpg`, `scroll-virtudes-1440.jpg` (antes: `antes-scroll-virtudes-*`).
- Arriba de todo a 1440: `arriba-home-1440.jpg`, `arriba-servicios-1440.jpg`, `arriba-historia-1440.jpg`, `arriba-contacto-1440.jpg`.
- Menú abierto: `menu-abierto-390.jpg`, `menu-abierto-scroll-390.jpg`.

## Cómo probarlo

Preview: https://nicolas-sanetti-front-git-feat-videos-santicbsn14s-projects.vercel.app/

1. En el celular, bajar hasta la sección oscura: el degradado tiene que ser parejo, sin franjas.
2. Al empezar a scrollear, la navbar pasa a blanco con sombra. Al volver arriba, otra vez transparente.
3. Abrir y cerrar el menú hamburguesa, arriba de todo y scrolleado.

## Pendiente

- Que Santiago revise el preview. Con su OK, mergear `feat/videos` a `development` (solo trae este brief).
