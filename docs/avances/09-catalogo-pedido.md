# Avance 09 — Catálogo de productos con pedido por WhatsApp

Rama `feat/admin`, **sin mergear a `development`**: la etapa 2 se mergea junta en el brief 10.
Código: commit `c2cb3a5`.

## Qué se hizo

- **`/productos`** (listado):
  - Encabezado como la galería: `• Productos •`, `PRODUCTOS` y la bajada del brief.
  - Grilla de 2 / 3 / 4 columnas (máx. 1200 px).
  - Cada tarjeta tiene foto 1:1 recortada, nombre (máx. 2 renglones), precio y botón.
  - El precio sale como `$ 15.000`, `Desde $ 12.500` o «Consultar precio».
  - Botón: «Agregar» si el producto no tiene variantes, «Elegir» (va al detalle) si tiene.
  - Foto y nombre llevan al detalle.
  - Estados: cargando (skeleton), vacío («Muy pronto…» + «Consultanos por WhatsApp») y error («No pudimos cargar los productos.» + «Probar de nuevo»).
- **`/productos/:slug`** (detalle):
  - «← Volver a productos» arriba.
  - Foto principal entera (`fit('max')`) en un cuadrado con fondo `#f4efe5`.
  - Miniaturas y contador `1 / 3` si hay más de una foto. En celular se desliza, con el mismo umbral que el visor (50 px).
  - Nombre, precio (cambia al elegir variante) y descripción con sus saltos de línea.
  - Variantes como chips (`role="radiogroup"`, con flechas del teclado).
  - Cantidad con − / + de 48 px.
  - «Agregar al pedido» y «Consultar por WhatsApp».
  - Producto oculto o slug inexistente: «Este producto ya no está disponible.» + «Ver todos los productos».
- **Aviso «Agregado: {nombre}» + «Ver pedido»** (3 s) y **barra fija «Tu pedido · n productos»** con el total y «Ver pedido», en listado y detalle.
  - La barra respeta `safe-area-inset-bottom`.
  - Mientras se ve la barra, el botón de WhatsApp sube por encima.
- **`/pedido`**:
  - Al entrar, revalida contra Sanity: nombre, foto y precio frescos.
    - Si cambió un precio, avisa «Actualizamos el precio de {nombre}».
    - Lo que ya no está (producto oculto o borrado, o variante borrada) queda atenuado, con «Ya no está disponible» y «Quitar». No va en el mensaje.
  - Cada línea muestra cantidad −/+, «Quitar» y subtotal.
  - Total con «+ productos a consultar» cuando corresponde.
  - Datos del cliente: nombre (obligatorio), Retiro / Envío y comentario (300). Nombre y entrega se recuerdan.
  - «Enviar pedido por WhatsApp» abre una pestaña nueva y después muestra «¿Ya mandaste el mensaje? Podés vaciar el pedido.» + «Vaciar pedido».
  - Vacío: «Tu pedido está vacío.» + «Ver productos».
- **Navbar**:
  - El logo es link a `/`.
  - HOME solo en el menú hamburguesa.
  - Se agregó PRODUCTOS entre GALERÍA e HISTORIA.
  - Ícono `ShoppingBag` con el número, que lleva a `/pedido`. Solo aparece con algo en el pedido.
  - La barra de escritorio va **desde 1360 px** con la letra original de 16 px; por debajo, hamburguesa.
  - Se borraron las reglas del 08 que achicaban la letra (769–1240 y 769–900).
- **Footer**: «Productos» después de «Galería».

## Archivos

| Archivo | Qué |
|---|---|
| `src/features/pedido/items.ts` | Tipo `ItemPedido` y lógica pura: clave, sumar, tope 1–20, precio visible, subtotal, total, validar lo leído del storage |
| `src/features/pedido/carrito.ts` | Store (`useSyncExternalStore` + `localStorage` `nsc-pedido-v1` + evento `storage`). Exporta `agregar`, `cambiarCantidad`, `quitar`, `vaciar`, `useCarrito`, `actualizarItems` |
| `src/features/pedido/formato.ts` | `formatoPrecio` (`$ 15.000`) y `plural` |
| `src/features/pedido/mensaje.ts` | `armarMensajePedido` y el texto del total |
| `src/features/pedido/pedido.test.ts` | 7 tests (`npm test`) |
| `src/Components/Productos/Productos.tsx/.css` | Listado. El CSS es la base compartida: encabezado, avisos, skeleton y «volver» |
| `src/Components/Productos/ProductoDetalle.tsx/.css` | Detalle |
| `src/Components/Productos/Pedido.tsx/.css` | Pedido y revalidación |
| `src/Components/Productos/BarraPedido.tsx/.css`, `useAviso.ts` | Barra y aviso |
| `src/Components/Productos/Cantidad.tsx/.css` | Control − / + |
| `src/Components/Productos/productos.utils.ts` | Precios de tarjeta y variante, `ItemPedido` a partir de un producto, URLs de imágenes |
| `src/lib/sanity.queries.ts` | `PRODUCTOS_QUERY` suma `variantes[]{_key, nombre, precio}`. Nueva `PRODUCTOS_POR_IDS_QUERY` |
| `src/lib/sanity.types.ts` | `ProductoResumen` suma `variantes`. Nuevo `ProductoParaPedido` |
| `src/Components/AppRoutes.tsx` | 3 rutas lazy con el mismo `fallback` que la galería |
| `src/Components/Navbar/Navbar.tsx/.css`, `Footer/Footer.tsx` | Ver arriba |
| `package.json` | Script `"test": "node --test src/features/pedido/pedido.test.ts"` (sin dependencias nuevas) |

## Decisiones

- **Tests con el runner nativo de Node**: no hay Vitest y no se podían agregar dependencias.
  - Node 24 corre `.ts` directo (type stripping), así que `npm test` corre `node --test` sin compilar.
  - Por eso `items.ts`, `mensaje.ts` y `carrito.ts` se importan entre sí con extensión `.ts` (`allowImportingTsExtensions` ya estaba).
  - Los tests cubren:
    - el ejemplo del brief, que mezcla «consultar precio», variante y comentario;
    - todo con precio y sin comentario;
    - nada con precio (sin total);
    - mismo producto + misma variante suma, otra variante es otro ítem, tope 20;
    - total;
    - validación del storage.
  - Además, Playwright prueba lo mismo de punta a punta (ver Pruebas).
- **El precio se guarda en el ítem y se revalida en `/pedido`**. La barra del listado usa el precio guardado, que es el que se vio al agregar. En `/pedido` se actualiza con aviso.
- **Revalidación**:
  - Si un ítem sin variante es de un producto que ahora tiene variantes, sigue disponible. Se manda sin variante y Nico pregunta.
  - Si la consulta a Sanity falla, se deja mandar igual con el aviso «No pudimos revisar los precios…».
  - Mientras revisa, el botón dice «Revisando precios…» y está deshabilitado.
- **Variante sin precio**: usa el del producto, como dice la regla del brief. Por eso «Tintura en crema» (6500, 6500 y una variante sin precio) muestra `$ 6.500` y no «Desde».
- **«Desde $ X»** sale cuando las variantes tienen precios distintos o cuando alguna queda sin precio.
- **Con una sola variante, viene elegida.** No hay nada que elegir, y el producto PRUEBA real tiene una sola («500 ml»). Con 2 o más, el botón queda en «Elegí un tamaño o tono» hasta elegir. Ver Desvíos.
- **El aviso «Agregado»** dice el nombre con la variante: «Shampoo reparador (500 ml)».
  - En celular va por encima del botón de WhatsApp. Sin esto lo tapaba: los dos van abajo a la derecha.
- **Barra y botón de WhatsApp**:
  - Con la barra visible, el `body` lleva la clase `con-barra-pedido`.
  - Esa clase sube el botón (`bottom: 64 px + 16 px + safe-area`) y le da al body un `padding-bottom` del alto de la barra, para que no tape el final del footer.
  - La regla vive en el CSS de la barra (chunk lazy), así que `WhatsAppFloat` no se tocó.
- **Breakpoint de la navbar en 1360 px**:
  - Medido con Playwright a 1600 px, con el ícono visible: logo 405 + links 814 + ícono 44 + 2 espacios de 20 + padding 40 = **1343 px**.
  - Se suman ~17 px de la barra de scroll de Windows, que cuenta en el ancho de las media queries.
  - El espacio mínimo entre bloques bajó de 24 a 20 px para que entre en las laptops de 1366.
  - Los links, guiones y espacios entre links quedaron como estaban.
- **Hamburguesa**: ahora es un `<button>` con `aria-label` («Abrir menú» / «Cerrar menú»), `aria-expanded` y `aria-controls`. Antes era un `div`.
  - Entre 769 y 1359 px el logo queda en 26 px y el menú se despliega como en el celular.
- **Logo**: el `<h1>` se mantiene; adentro hay un `<Link>` que hereda color y tipografía.
- **Chunks**: Vite juntó `@sanity/client`, `urlFor` y las queries en un chunk compartido, `sanity.queries-*.js`, que usan la galería y las 3 páginas nuevas.
  - El CSS de la barra salió con el nombre `useAviso-*.css`. Rollup nombra el chunk compartido por el primer módulo; el nombre no importa.

## Desvíos

- **Variante única preseleccionada** (ver Decisiones). Si Santiago prefiere que siempre haya que tocarla, es borrar el ternario de `useState` en `Ficha` (`ProductoDetalle.tsx`).
- **Subtotal de un ítem «Consultar precio»**: en la lista del pedido no se muestra nada (el precio unitario ya dice «Consultar precio»). El brief pide «subtotal» por línea.
- **Script `test` en `package.json`**: no es dependencia, pero es una línea más en ese archivo.

## Pendientes

- **Mismo LCP que la galería (~4,5 s mobile)**: viene de la cadena `index` → chunk de la página → chunk de Sanity → consulta. Se podría precargar el chunk desde la navbar. No se hizo porque el brief pide chunks aparte.
- **Sin `ErrorBoundary` en las rutas lazy** (ya anotado en el 08). Sigue pendiente para el brief 10.
- **`categoria`** sigue sin usarse.
- **Fotos de prueba**: los productos simulados usan las 2 fotos del dataset (el salón y Nico), no envases. Con fotos reales de productos hay que mirar de nuevo el recorte 1:1 de las tarjetas. En el detalle la foto va entera.
- **Las navegaciones del mensaje** usan `window.open(…, 'noopener,noreferrer')`. Si un navegador bloqueara la pestaña, no hay plan B (no pasó en Chrome).

## Chunks antes y después

Build de producción (`npm run build`).

| Chunk | Antes (`13ca983`) | Después |
|---|---|---|
| `index-*.js` | 438,70 kB (gzip 146,83) | **443,10 kB (gzip 148,32)**: +1,5 kB gzip por el carrito, el ícono `ShoppingBag`, la navbar y las 3 rutas lazy. Sin `@sanity/client`: la única aparición de «sanity» es el nombre del chunk compartido en el mapa de precarga |
| `index-*.css` | 18,31 kB | 19,08 kB (navbar) |
| `sanity.queries-*.js` (compartido) | — (estaba dentro de `Galeria-*.js`) | 130,05 kB (gzip 39,36): `@sanity/client` + queries |
| `Galeria-*.js` | 138,96 kB | 9,57 kB (el cliente pasó al compartido) |
| `Productos-*.js` (2) | — | 3,52 + 1,79 kB |
| `ProductoDetalle-*.js` | — | 6,51 kB |
| `Pedido-*.js` | — | 7,70 kB |
| `useAviso-*.js` (barra) + `Cantidad-*.js` | — | 1,54 + 0,59 kB |
| CSS nuevos | — | 0,6 + 2,8 + 3,7 + 3,8 + 4,8 kB |
| `AdminApp-*.js` | 211,16 kB | 210,83 kB |

Verificado en el navegador: la home no pide nada a Sanity y solo baja `index-*.js`.

## Lighthouse (mobile, `/productos`, build de producción, `vite preview`, datos reales)

| Corrida | Performance | Accessibility | LCP | TBT | CLS |
|---|---|---|---|---|---|
| 1 | 78 | 100 | 4,5 s | 110 ms | 0 |
| 2 | 78 | 100 | 4,6 s | 50 ms | 0 |
| 3 | 78 | 100 | 4,6 s | 80 ms | 0 |

**Performance 78, Accessibility 100.** La galería del 08 dio 77 / 100, con el mismo patrón de LCP.

## Pruebas

| Criterio | Resultado |
|---|---|
| `npm run build` / `npm run lint` | OK. Lint: 0 errores, los mismos 9 warnings que había antes del brief (ninguno en archivos nuevos) |
| `index-*.js` sin `@sanity/client` | OK (tabla de chunks) |
| Datos reales: PRUEBA en `/productos` → detalle → agregar → `/pedido` | OK. Listado `PRUEBA — Shampoo $ 15.000`; detalle con «500 ml» elegida; en `/pedido` `1 × PRUEBA — Shampoo (500 ml) — $ 15.000`, total `$ 15.000`, sin «no disponible». Captura 16 |
| Variantes: no deja agregar sin elegir; misma variante suma; otra variante es otro ítem | OK (Playwright y `npm test`) |
| Sobrevive a recargar; dos pestañas | OK. Recargar mantiene los 6 ítems; la otra pestaña ve 9 en el ícono, baja a 8 al quitar y lo pierde al vaciar |
| Revalidación: `productoId` inexistente y precio cambiado | OK. «Producto borrado» (id inexistente) y «Tintura en crema (Rojo 6)» (variante borrada) salen atenuados y no van en el mensaje. Aceite de 7000 → 7800 con «Actualizamos el precio de Aceite capilar» |
| Mensaje de WhatsApp | OK en todos los casos. `npm test` (7 tests, runner de Node) + Playwright, que lee la URL de `window.open` |
| Navbar | OK. A 1440 y 1360: 16 px, un renglón (44 px de alto), sin HOME ni hamburguesa. A 1359: hamburguesa. Ícono solo con ítems. Logo → `/`. Sin scroll horizontal en 390 |
| Otras rutas iguales | OK, ver abajo |
| Lighthouse | 78 / 100 |

**Playwright**: 53 comprobaciones con datos simulados, todas OK. Usa `page.route` sobre `api.sanity.io/…/data/query` y responde según la query (listado, `$slug` o `$ids`) con 8 productos:

- con y sin variantes;
- uno con `mostrarPrecio: false`;
- uno sin precio;
- uno con 3 fotos y descripción larga;
- uno de una sola variante sin precio propio;
- uno de nombre muy largo.

Los scripts quedaron fuera del repo. Nada de eso está en `src/`.

**Comparación antes/después** de `/`, `/servicios`, `/galeria`, `/historia` y `/contacto` a 390 y 1440:

- Capturas de página completa del build `13ca983` contra el nuevo. Píxel a píxel, sin contar la navbar (primeros 90 px).
- **Arriba del footer: 0 píxeles distintos en las 10 capturas.**
- Todas las páginas miden 31 px más por el link «Productos» del footer, y las diferencias están solo en ese tramo.
- La navbar cambió a propósito: el logo es link, sin HOME, con PRODUCTOS y hamburguesa por debajo de 1360.

## Capturas (`docs/avances/09-material/`)

Datos simulados salvo la 16. jpg calidad 80, de 8 a 107 KB.

| Archivo | Qué |
|---|---|
| `01-listado-390.jpg` | Listado |
| `02-aviso-y-barra-390.jpg` | Aviso «Agregado» + barra; el botón de WhatsApp queda por encima |
| `03-detalle-sin-elegir-390.jpg` | Detalle con variantes, sin elegir |
| `04-detalle-elegida-390.jpg` | Variante elegida, cantidad 2 |
| `05-detalle-varias-fotos-390.jpg` | Detalle con 3 fotos, en la 2 después de deslizar |
| `06-pedido-items-390.jpg` | Pedido: aviso de precio, «Consultar precio» y 2 «Ya no está disponible» |
| `07-pedido-enviado-390.jpg` | Datos completos y «¿Ya mandaste el mensaje?» |
| `08-pedido-vacio-390.jpg` | Pedido vacío |
| `09-navbar-icono-390.jpg` | Navbar con el ícono al lado de la hamburguesa |
| `10-menu-abierto-390.jpg` | Menú con HOME y PRODUCTOS |
| `11-listado-1440.jpg` | Listado 4 columnas, aviso y barra |
| `12-detalle-1440.jpg` | Detalle |
| `13-pedido-1440.jpg` | Pedido |
| `14-navbar-1440.jpg` | Navbar |
| `15-navbar-1360.jpg` / `15-navbar-1359.jpg` | Justo en el corte y 1 px menos |
| `16-real-pedido-390.jpg` | Pedido con el producto PRUEBA real |

## Cómo probarlo en local

El CORS de Sanity solo acepta localhost:3333/4173/5173 y vercel.app.

```bash
npm run build
npx vite preview --port 5173 --strictPort   # o npm run dev (también usa 5173)
```

- `http://localhost:5173/productos`: sale el producto PRUEBA. Tocar «Elegir», después «Agregar al pedido», y abrir el ícono de la navbar o «Ver pedido».
- Para probar «Ya no está disponible»: en la consola,
  `const c = JSON.parse(localStorage['nsc-pedido-v1']); c.push({productoId:'x',slug:'x',nombre:'Borrado',precio:1,mostrarPrecio:true,imagen:null,cantidad:1}); localStorage['nsc-pedido-v1'] = JSON.stringify(c)`
  y recargar `/pedido`.
- Tests del mensaje: `npm test`.
