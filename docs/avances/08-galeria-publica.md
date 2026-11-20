# Avance 08 — Galería pública de trabajos (`/galeria`)

Rama `feat/admin`, **sin mergear a `development`**: la etapa 2 se mergea junta en el brief 10.
Código: commit `4104a73`.

## Qué se hizo

- **Página `/galeria`**:
  - Encabezado como el de la portada: `• Nuestros trabajos •`, `GALERÍA` y la bajada.
  - Chips de filtro por servicio, con la cantidad de fotos.
  - Grilla 4:5 con las destacadas primero y en 2×2.
  - Visor a pantalla completa con «Quiero este look» por WhatsApp.
  - Cierre «¿Te gustó algún trabajo?» + «Reservá tu turno».
- **Estados**:
  - Cargando: 8 recuadros con brillo.
  - Sin fotos: «Muy pronto vas a ver acá nuestros trabajos.» + «Reservá tu turno».
  - Error: «No pudimos cargar la galería.» + «Probar de nuevo».
- **Links**:
  - `GALERÍA` en la navbar, entre SERVICIOS e HISTORIA.
  - «Galería» en el footer, después de Servicios.
  - «Ver trabajos de {servicio} →» debajo de los precios de cada servicio, que abre `/galeria?servicio={slug}`.
- **Menú hamburguesa**: ahora **todos** los links lo cierran al tocarlos. Antes solo lo hacía «Reservá tu turno».
- **`src/lib/`**:
  - `useCdn: false`, con un comentario que explica el porqué.
  - `TRABAJOS_QUERY` y `TRABAJOS_POR_SERVICIO_QUERY` ordenan `destacado desc, orden asc, _createdAt desc`.
  - `PRODUCTOS_QUERY` no cambió.
- **Panel**: en `ProductoForm.tsx` y `TrabajoForm.tsx`, el aviso al guardar pasa a «Guardado. Ya está en la web». Nada más del panel.

## Archivos

| Archivo | Qué es |
|---|---|
| `src/Components/Galeria/Galeria.tsx` + `.css` | Página: carga, filtro y foto en la URL, estados, cierre, título |
| `src/Components/Galeria/FiltroServicios.tsx` + `.css` | Chips con cantidad |
| `src/Components/Galeria/GrillaTrabajos.tsx` + `.css` | Grilla y skeleton |
| `src/Components/Galeria/Visor.tsx` + `.css` | Lightbox |
| `src/Components/Galeria/galeria.utils.ts` | URLs de imagen (`srcSet`), `alt`, nombre del servicio, mensaje de WhatsApp |
| `src/Components/AppRoutes.tsx` | `lazy` + ruta `/galeria` con `Suspense` (bloque blanco de `100vh`) |
| `src/Components/Navbar/Navbar.tsx` + `.css` | Link GALERÍA, cierre del menú al tocar un link, tamaños para 769–1240 px |
| `src/Components/Footer/Footer.tsx` | Link Galería |
| `src/Components/Services/Services.tsx` + `.css` | `slug` por servicio y el link a la galería (el resto no se tocó) |
| `src/lib/sanity.ts`, `sanity.queries.ts` | `useCdn: false` y orden de los trabajos |
| `src/features/admin/pages/ProductoForm.tsx`, `TrabajoForm.tsx` | Texto del aviso al guardar |
| `docs/avances/08-material/` | Capturas |

## Chunks antes y después

| Archivo | Antes (`82381d1`) | Después (`4104a73`) |
|---|---|---|
| `index-*.js` | 436,91 kB (gzip 146,24) | **438,70 kB (gzip 146,83)**: +0,6 kB gzip por la ruta lazy y los links. Sin `@sanity/client`: la única aparición de «sanity» es el nombre de `Galeria-*.js` en el mapa de precarga |
| `index-*.css` | 17,50 kB | 18,0 kB (navbar, link de servicios y clases del hero que ya estaban) |
| `Galeria-*.js` | — | 138,96 kB (gzip 42,74), **con `@sanity/client` adentro** |
| `Galeria-*.css` | — | 7,2 kB |
| `sanity.types-*.js` | — | 4,6 kB, compartido con el panel: helpers de `tslib` (los usan Firebase y `@sanity/client`) + `SERVICIOS` |
| `AdminApp-*.js` | 211,66 kB | 211,21 kB |

La home no pide nada a Sanity ni el chunk de la galería (verificado en el navegador).

## Lighthouse (mobile, build de producción, `vite preview`)

Tres corridas sobre `/galeria` con datos reales:

| | Performance | Accessibility | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| 1 | 79 | 100 | 2,8 s | 4,4 s | 60 ms | 0 |
| 2 | 74 | 100 | 2,8 s | 4,5 s | 250 ms | 0 |
| 3 | 77 | 100 | 2,8 s | 4,7 s | 90 ms | 0 |
| **Mediana** | **77** | **100** | 2,8 s | 4,5 s | 90 ms | 0 |

Best Practices 100 y SEO 100 en la primera corrida.

- **Referencia**: `/contacto` en el mismo build da Performance 92 y LCP 2,5 s.
- **Por qué el LCP es más alto**: el elemento LCP es la bajada del encabezado, y llega en dos pasos. Primero baja `index-*.js` y recién después el chunk de la galería.
- **Una corrida descartada**: dio Performance 45 con TBT 3,4 s porque se corrió en paralelo con las pruebas de Playwright y la máquina estaba ocupada.

## Decisiones durante la implementación

- **Grilla con filas fijas**:
  - El alto de fila se calcula con el ancho del contenedor (`container-type: inline-size` + `cqi`), así mide justo lo que una foto 4:5.
  - Así una destacada (2 columnas × 2 filas) queda alineada con las demás, y `grid-auto-flow: dense` rellena los huecos.
  - Con `aspect-ratio` en cada foto, las destacadas quedaban unos px más altas que dos filas.
- **Chips**:
  - Se muestra la cantidad en cada uno («Corte y barbería 4»): queda prolijo.
  - Se ocultan los servicios sin fotos, **salvo el elegido**.
  - En celular van en grilla de 2 × 2 (por debajo de 600 px), con 44 px de alto.
- **`?servicio=` de un servicio sin fotos (por ejemplo `lavado-y-peinado` con los datos de hoy)**:
  - **Muestra el estado vacío** con el chip «Lavado y peinado 0» activo; **no** cae en «Todas».
  - Así, quien llega desde «Ver trabajos de lavado y peinado» ve «Muy pronto…» en vez de fotos de otro servicio.
  - Un valor que no existe (`?servicio=nada`) sí cae en «Todas».
- **Visor con `srcSet`** 800/1200/1600 (`fit=max`):
  - El brief pedía 1600 px. En el celular baja la de 800 o la de 1200; en compu, la de 1600.
  - La foto anterior y la siguiente se precargan con el mismo `srcSet`.
- **Miniatura mientras carga**:
  - La grilla anota la URL que eligió el navegador (`currentSrc`), y el visor la muestra hasta que llega la grande.
  - Si se entra directo con `?foto=`, no hay miniatura y se ve el fondo oscuro.
- **Historial**:
  - Abrir una foto hace `push` con `state.visorDesdeGrilla`.
  - Flechas y swipe hacen `replace`, conservando ese estado.
  - Cerrar hace `navigate(-1)` si se abrió desde la grilla, o `replace` sin `foto` si se entró con el link.
  - Un segundo Esc o un doble toque no hacen `navigate(-1)` dos veces.
- **Foco**:
  - Al abrir va al ✕.
  - Al cerrar vuelve a la foto de la grilla **que se estaba viendo**: si se pasó de foto, a esa.
  - Si la flecha con foco se deshabilita (primera o última foto), el foco pasa a la otra flecha.
- **Flechas en la primera y la última foto**: se ocultan, porque no hay vuelta circular.
- **Swipe**: mínimo 50 px de costado y al menos 1,5 veces más horizontal que vertical.
- **Visor**: va en `createPortal` a `body`, con `z-index: 100` (la navbar tiene 50 y WhatsApp 40).
- **Clases de la portada**:
  - El eyebrow, el título y los botones usan las clases `hero__*`, y `Galeria.tsx` importa `Hero.css` explícitamente.
  - No pesa de más: ese CSS ya está en el chunk principal.
- **Error de carga**: `@sanity/client` reintenta solo. Sin conexión, el aviso aparece a los ~4 s (1 pedido + 5 reintentos), así que no se tocó.
- **Link en Servicios**: texto en `#131313` con subrayado de 1 px (2 px al pasar el mouse), contorno de foco `#131313` y 44 px de alto.

## Desvíos respecto al brief

- **Navbar: el rango ajustado es 769–1240 px, no 769–1100.**
  - Con GALERÍA, el logo y los 6 links necesitan ~1170 px, así que entre 1100 y 1240 también se apretaba.
  - Ajustes:
    - 769–1240: logo 21 px, links 14 px, menos espacio.
    - 769–900: logo 16 px, links 12 px, sin los guiones separadores (como en el menú del celular).
    - `white-space: nowrap` en logo y links.
  - Verificado en un renglón y sin pisarse a 769, 900, 1024, 1100, 1240, 1280 y 1440.
  - A 1280, 1440 y en celular, la navbar se ve igual que antes salvo por el ítem nuevo.
- **`/servicios` a 1440**:
  - El texto de cada servicio sube ~32 px. Está centrado verticalmente en una caja de alto fijo (`height: 700px`, de antes) y el link nuevo le suma ~64 px de alto.
  - No se tocó ese CSS: el brief dice que solo se agregue el link.
- **Brillo del encabezado**: el mismo color que el del hero, pero centrado arriba (el hero lo tiene a la derecha, detrás del mosaico).
- **Capturas extra**:
  - `13`–`14`: datos reales.
  - `15`: navbar a 1280.

## Verificación

- **Herramientas**: `vite preview` (build de producción) y Playwright.
- **Datos**: Sanity real (1 trabajo, PRUEBA), y 12 trabajos simulados con `page.route` en el navegador de prueba. Los simulados usan los 2 assets que ya existen en el dataset. Nada de eso está en `src/` y no se tocó ningún documento de Sanity.
- **Pruebas**: 66 de regresión + 14 de los criterios, **todas OK**.

| Criterio | Resultado |
|---|---|
| `npm run build` / `npm run lint` | OK / 0 errores, 9 warnings (los mismos de antes, en `System-Turnos/`) |
| Chunk principal sin `@sanity/client` | OK (tabla de chunks) |
| Datos reales | `/galeria` muestra el trabajo PRUEBA; `?servicio=coloracion-y-mechas` lo muestra; `?servicio=lavado-y-peinado` → **estado vacío** con el chip activo (captura `14`) |
| Destacadas | Primeras y 2×2 a 1440; **0 celdas vacías** en la grilla (medido); recuadros 4:5 exactos; 2/3/4 columnas a 390/768/1440 |
| Visor | Flechas, ← → Esc, swipe con touch events (izquierda, derecha, el vertical no navega, sin vuelta circular), cerrar con ✕ / Esc / fondo. **1.º atrás cierra el visor y 2.º atrás sale de la página**. `?foto=mock-3` abre esa foto (4 / 12). `?foto=` inexistente se ignora. Foco, Tab atrapado, scroll bloqueado, tapa navbar y WhatsApp |
| «Quiero este look» | Sin descripción: «¡Hola Nico! Vi en la web un trabajo de coloración y mechas y me gustaría sacar turno.» · Con descripción: «… de coloración y mechas («Balayage miel sobre base castaña») y me gustaría sacar turno.» · Real: «… («PRUEBA») …» |
| Navbar | Un renglón a 1024, 1280 y 1440 (y a 769, 900, 1100, 1240). Menú hamburguesa: se cierra al tocar HISTORIA y GALERÍA |
| Resto de la web igual | Ver la tabla de abajo |
| Lighthouse mobile | Performance **77**, Accessibility **100** (mediana de 3) |

### Comparación antes/después de las rutas públicas

Build de `82381d1` (antes de este brief) contra el build actual. Página completa a 390 y 1440, con videos ocultos y animaciones apagadas, comparadas píxel a píxel.

| Ruta | 390 | 1440 |
|---|---|---|
| `/` | Solo el footer (+31 px por el link «Galería») | Navbar (ítem nuevo) + footer |
| `/historia` | Solo el footer | Navbar + footer |
| `/contacto` | Solo el footer | Navbar + footer |
| `/servicios` | Los 3 links nuevos (+~64 px cada uno, todo lo de abajo se corre) + footer | Navbar + el texto de cada servicio sube ~32 px (ver «Desvíos») + footer. Las imágenes, los precios y el mosaico de cuotas no cambian |

Fuera de esas zonas: 0 píxeles distintos.

## Material (`08-material/`)

| Captura | Qué muestra |
|---|---|
| `01-galeria-390` | Galería arriba (encabezado, chips, primera destacada) |
| `02-galeria-filtro-390` | Filtro «Coloración y mechas» |
| `03-visor-390` | Visor, foto sin descripción |
| `04-visor-descripcion-390` | Visor con descripción y «Quiero este look» |
| `05-vacia-390` | Estado vacío |
| `06-menu-abierto-390` | Menú hamburguesa abierto en la galería |
| `07-servicios-link-390` | Link «Ver trabajos de lavado y peinado →» |
| `08-galeria-1440` | Galería |
| `09-destacada-2x2-1440` | Las dos destacadas en 2×2 |
| `10-visor-1440` | Visor |
| `11-navbar-1440`, `12-navbar-1024`, `15-navbar-1280` | Navbar |
| `13-real-390`, `14-real-lavado-vacio-390` | Datos reales: `/galeria` y `?servicio=lavado-y-peinado` |

Todas en jpg calidad 80, de 14 a 168 KB.

## Cómo probarlo en local

1. `npm run build`
2. `npx vite preview --port 5173`. **Tiene que ser 5173 o 4173**: el CORS de Sanity solo acepta esos puertos de localhost. Con otro puerto, la galería muestra «No pudimos cargar la galería».
3. Abrir `http://localhost:5173/galeria`.
   - Con los datos de hoy se ve un solo trabajo (PRUEBA).
   - Probar `?servicio=coloracion-y-mechas`, `?servicio=lavado-y-peinado` y tocar la foto.
4. `npm run dev` también sirve, porque usa el 5173.

No hace falta la API local ni la contraseña del panel: la galería lee directo de Sanity.

## Pendientes

- **CORS de Sanity**: hoy acepta `localhost:3333/4173/5173`, `nicolas-sanetti-front.vercel.app` y los previews de rama de Vercel. **Si la web pasa a un dominio propio, hay que agregarlo** en sanity.io/manage → API → CORS origins.
- **Variables de Vercel**: confirmar que `VITE_SANITY_PROJECT_ID` y `VITE_SANITY_DATASET` estén en Production y Preview. `sanity.ts` tira error al importarse si faltan, y `/galeria` quedaría en blanco.
- **LCP de 4,5 s en mobile**: viene de la cadena `index` → chunk de la galería. Se podría bajar mostrando el encabezado en el `fallback` del `Suspense` o precargando el chunk desde la navbar. No se hizo porque el brief pide el chunk aparte.
- **Chunks lazy sin `ErrorBoundary`**: si un chunk lazy falla al bajar (por ejemplo, justo después de un deploy), la página queda en blanco. Pasa igual con `/admin`. Se puede sumar en el brief 10.
- **Celular real**: falta probar el swipe, la flecha «atrás» de Android y iOS en bajo consumo.
- **Datos de prueba en Sanity**: sigue solo el trabajo PRUEBA, que habrá que borrar cuando Nico cargue los suyos.
