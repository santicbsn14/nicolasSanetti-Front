# Brief 10a — Ajustes previos a publicar

Rama `feat/admin` (desde `9571681`). Commit del código: `66f3fdc`. No se mergeó a `development` (va en el 10b).

## Qué se hizo

1. **Portada de Quiénes somos con WEB-14.** Dos recortes desde el original de `material-nico/`: uno de escritorio y otro de celular, con `<picture>`. Encima va una capa oscura en degradado para que «QUIÉNES SOMOS» se lea. Se borró `port-historia.webp`.
2. **«Confianza y evolución» con WEB-15.** Recorte nuevo con el mismo nombre de archivo (`historia-confianza.webp`). `hero-nico.webp` no se tocó.
3. **Recarga si falla una página después de un deploy.**
   - `vite:preloadError` en `main.tsx` recarga una vez.
   - Una guardia de 10 s en `sessionStorage` evita el bucle.
   - Si la carga sigue fallando, un error boundary muestra «No pudimos cargar esta página.» con «Recargar».
4. **Precarga en segundo plano** de Galería, Productos, ProductoDetalle y Pedido después de que carga la web.
   - El panel no se precarga.
   - Tampoco se precarga nada con ahorro de datos o con conexión 2g / slow-2g.
5. **Navbar blanca siempre en modo hamburguesa** (≤ 1359 px). La sombra sigue apareciendo recién con scroll. Escritorio quedó igual.

## Archivos

| Archivo | Cambio |
|---|---|
| `src/Components/Imagenes/port-nosotros.webp` | Nuevo. WEB-14 escritorio, 1365×459, **43 KB** |
| `src/Components/Imagenes/port-nosotros-celu.webp` | Nuevo. WEB-14 celular, 780×440, **22 KB** |
| `src/Components/Imagenes/historia-confianza.webp` | Reemplazado. WEB-15, 1318×904, **42 KB** (antes 69 KB, con WEB-14) |
| `src/Components/Imagenes/port-historia.webp` | Borrado |
| `src/Components/HIstoria/Historia.tsx` | `<picture>` con `<source media="(max-width: 768px)">` |
| `src/Components/HIstoria/Historia.css` | Capa oscura (`::after`), margen arriba de la portada en modo hamburguesa y posición del título en celular |
| `src/main.tsx` | Listener de `vite:preloadError` con guardia |
| `src/Components/CargaPagina.tsx` | Nuevo. Error boundary + `Suspense` para las rutas lazy (también cubre `/admin`) |
| `src/Components/AppRoutes.tsx` | Usa `CargaPagina`. Los `import()` quedan en funciones que se comparten con la precarga |
| `src/Utils/precarga.ts` | Nuevo. `precargarEnSegundoPlano()` |
| `src/App.css` | Estilo del mensaje de error |
| `src/Components/Navbar/Navbar.css` | Fondo blanco en ≤ 1359 px |
| `src/Components/Contacto/Contacto.css` | `padding-top: 88px` en ≤ 1359 px |

## Decisiones

- **Recortes de WEB-14** (original 1365×2048, sin agrandar):
  - **Escritorio**: franja de 1365×459 (2,97:1) que va del 13 % al 36 % del alto. No arranca en el 18 % porque ahí se cortaba la cabeza de la modelo. Con esta franja, a 1920 (donde `object-fit: cover` recorta arriba y abajo) siguen enteras las dos caras y la mano en el pelo. A 1512 se estira un 11 % (no hay más ancho en el original).
  - **Celular**: 1365×770 desde el 7 %, exportado a 780×440 (1,77:1, el doble de 390×220). Muestra las dos caras y hasta el pecho.
- **Recorte de WEB-15**: 1365×936 desde el 5 %, exportado a 1318×904. Entran la cara de la modelo, la mano de Nico en el pelo y la cabeza de Nico.
- **Capa oscura**: un degradado que va de transparente arriba a `rgba(0,0,0,0.3)` desde el 28 % para abajo. Con una capa pareja de 0,3, los links de la navbar de escritorio (que es transparente y tiene texto oscuro) se leían peor que antes. Así, la franja de la navbar queda con la foto tal cual.
- **Portada de Quiénes somos con la navbar blanca** (≤ 1359 px): la navbar ahora es opaca y tapaba la parte de arriba de la foto. A 768 tapaba los ojos de la modelo. Por eso, en ese rango la portada arranca debajo de la navbar: `margin-top: 64px` (67 px entre 481 y 768, que es lo que mide la navbar ahí).
  - El título queda en el centro de la foto.
  - En ≤ 480 px el título ocupa casi todo el ancho y en el centro tapaba las dos caras: va al 76 % del alto, sobre los hombros. Probado a 360 y 390.
- **Error boundary con `key` por ruta**: si falla una página y la persona navega a otra, el error se reinicia. «Recargar» hace `window.location.reload()`, porque `React.lazy` guarda el error y no vuelve a intentar solo.
- **Sin storage no se recarga**: si `sessionStorage` tira error, no hay forma de saber si ya se recargó. En ese caso no se recarga y se muestra el mensaje, así no hay riesgo de bucle.
- **Precarga**: espera al `load`, después `requestIdleCallback` (con `timeout` de 5 s) o `setTimeout` de 2 s.
  - Usa los mismos `import()` que los `lazy`.
  - Si se entra directo a `/admin`, no precarga las páginas públicas.
  - Efecto lateral bueno: si la persona ya tenía la web abierta cuando se publica una versión nueva, Galería y Productos ya están en memoria y abren igual, sin recargar (probado, ver abajo).

## Desvíos

- **Contacto**: con la navbar blanca, el título «Contacto» quedaba medio tapado en 390, 768 y 1024 (antes se veía «a través» de la navbar transparente). Se le sumó `padding-top: 88px` solo en ≤ 1359 px.
- **Lighthouse «navegando desde `/`»**: Lighthouse no puede medir una navegación interna de la SPA (solo mide cargas de documento). Por eso ese caso se midió con Playwright, con el mismo throttling que usa Lighthouse mobile (4G lenta: 150 ms y 1,6 Mbps; CPU ×4; 412×823). La métrica es el tiempo desde que se toca el link hasta que se ve la primera foto. Entrando directo sí es Lighthouse.

## Pendientes

- **Navbar de escritorio sobre la portada de Quiénes somos**: es transparente con texto oscuro. «GALERÍA» y «PRODUCTOS» caen sobre la hoja oscura de la foto y se leen mal (ver `04-quienes-somos-portada-1920.jpg`). Con la foto vieja ya pasaba con otros links. El brief pedía no tocar escritorio. Si se quiere arreglar, lo más simple es la misma regla que en celular: navbar blanca en `/quienes-somos` y `/servicios`, o en todo el sitio.
- Con un deploy a los pocos segundos de que alguien abrió la web, la precarga puede fallar y disparar la recarga (una vez, por la guardia). En la práctica es como entrar de nuevo.
- A 360 px, el punto dorado de «UN SUEÑO CON RULEROS» baja a otro renglón. Ya pasaba antes, no se tocó.

## Tamaños

| | Antes | Después |
|---|---|---|
| `index-*.js` | 443,04 kB (gzip 148,44) | 444,75 kB (gzip 149,19) |
| `index-*.css` | 19,31 kB | 19,84 kB |
| Portada Quiénes somos | 43 KB (`port-historia`, 1512×413) | 43 KB escritorio / 22 KB celular |
| Confianza y evolución | 69 KB | 42 KB |

El `index-*.js` suma 1,7 kB (0,75 kB gzip). Ahí entran el boundary, la precarga y el listener.

## Lighthouse y tiempos

Build de producción con `vite preview` y datos reales de Sanity: antes (`9571681`) en 4173 y después en 5173. Las corridas se alternaron antes/después para que las dos versiones midan en las mismas condiciones.

> **Ojo con los números**: la máquina estaba al ~76 % de CPU (VS Code, Chrome, etc.). Por eso el TBT saltó de 0,2 s a 5,7 s entre corridas de la misma versión, y los puntajes dieron más bajos y más dispersos que en el 08 y el 09 (77–78). Lo que vale es la comparación antes/después en la misma sesión.

**Navegando desde `/`** (Playwright, throttling mobile; espera 8 s en el inicio, abre el menú y toca el link; 5 corridas por versión; medianas):

| | Página lista, antes | Página lista, después | Primera foto, antes | Primera foto, después |
|---|---|---|---|---|
| `/galeria` | 1,65 s | 1,37 s | **2,78 s** | **1,91 s** |
| `/productos` | 1,65 s | 1,33 s | **2,88 s** | **2,05 s** |

Ahora la primera foto aparece unos **0,85 s antes**. Lo que queda es la consulta a Sanity y la descarga de la foto.

**Entrando directo** (Lighthouse mobile, 5 corridas por versión; medianas):

| | Performance | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| `/galeria` antes | 44 (44/52/43/69/43) | 2,5 s | 5,4 s | 3369 ms | 0 |
| `/galeria` después | 51 (40/51/44/63/58) | 2,3 s | 5,1 s | 1734 ms | 0 |
| `/productos` antes | 79 (42/79/79/80/53) | 2,2 s | 4,6 s | 167 ms | 0 |
| `/productos` después | 76 (70/78/76/78/55) | 2,2 s | 5,0 s | 179 ms | 0 |

Entrando directo no cambia nada: la precarga empieza después del `load`, y la página ya pidió su chunk antes. Las diferencias están dentro del ruido.

## Pruebas

| Criterio | Resultado |
|---|---|
| `npm run build` | OK |
| `npm run lint` | 0 errores. Los 9 warnings de siempre (`System-Turnos/`, `Contexts/`) |
| `npm test` | 7/7 |
| Imágenes huérfanas en `Imagenes/` | Ninguna (cada archivo tiene al menos un import) |
| Precarga (Network) | Al cargar `/` se pide solo `index-*.js`. A los pocos segundos, en segundo plano: `Galeria`, `sanity.queries`, `tslib`, `sanity.types`, `Productos` (×2), `useAviso`, `ProductoDetalle`, `Cantidad`, `Pedido`. **`AdminApp` no** |
| Precarga con `saveData` | No pide nada (7 s de espera) |
| Archivo borrado (`Galeria-*.js`, con `saveData` para que no esté precargado) | Al tocar «Galería»: **una** recarga sola (2 documentos), en `/galeria` aparece «No pudimos cargar esta página.». 12 s después siguen siendo 2 documentos: no hay bucle. Con el archivo de vuelta, «Recargar» muestra la galería |
| Archivo borrado después de la precarga | Galería abre igual (1 documento, sin recarga) |
| Navbar en modo hamburguesa | Fondo `rgb(255,255,255)` a 390, 768 y 1024 en las 7 páginas públicas |
| Contenido tapado a 390 / 768 / 1024 | Nada. El primer título de cada página empieza debajo de la navbar (64–67 px): Quiénes somos, Servicios, inicio, galería, productos, pedido y contacto |
| Escritorio igual | A 1440, `/`, `/servicios`, `/galeria`, `/productos`, `/contacto` y `/pedido` dan **idénticas píxel a píxel** contra el build de antes (página completa, videos enmascarados, Sanity simulado vacío). La navbar sigue transparente arriba |

## Material (`docs/avances/10a-material/`)

jpg calidad ~80, de 11 a 148 KB.

| Archivo | Qué muestra |
|---|---|
| `01-quienes-somos-portada-{390,768,1440}.jpg` | Portada nueva |
| `02-confianza-y-evolucion-{390,768,1440}.jpg` | Foto WEB-15 |
| `03-navbar-blanca-{inicio,servicios,galeria}-390.jpg` | Navbar blanca arriba de todo |
| `04-quienes-somos-portada-1920.jpg` | Portada a 1920×1080 |
| `05-recorte-web14-escritorio.jpg`, `05-recorte-web14-celular.jpg`, `05-recorte-web15-confianza.jpg` | Los recortes sueltos |
| `06-no-pudimos-cargar-390.jpg` | Pantalla de error con «Recargar» |

## Cómo probar

```
npm run build && npm run lint && npm test
npx vite preview
```

- Quiénes somos a 390, 768, 1024, 1440 y 1920.
- Recarga tras deploy:
  1. Con DevTools, activar «Disable cache» y abrir `/` en una pestaña nueva.
  2. **Antes de que pasen ~2 s** (si no, ya está precargado), borrar `dist/assets/Galeria-*.js`.
  3. Tocar «Galería»: recarga una vez y muestra el mensaje.
  4. Volver a correr `npm run build` y tocar «Recargar».
  - En la prueba automática, la precarga se apagó simulando `saveData` con un `addInitScript` de Playwright.
- Precarga: pestaña Network, filtro JS, cargar `/` y esperar ~3 s.
