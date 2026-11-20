# Avance 07 — Panel `/admin` para Nico (productos y galería)

Rama `feat/admin`, **sin mergear a `development`**: se mergea cuando el back esté deployado (brief 10).

## Qué se hizo

- Panel en `/admin` con login, inicio, ABM de productos y ABM de galería de trabajos. Habla con el back local (`VITE_API_URL`) y se probó contra Sanity real.
- Se carga aparte (`lazy`): **Firebase y todo `src/features/admin/` quedan en `AdminApp-*.js`**, que solo se pide al entrar a `/admin`. En `/admin/*` no se muestran la navbar, el footer ni el botón de WhatsApp.
- Las fotos se achican en el celular antes de subirse: 1600 px en el lado más largo, WebP calidad 0,8, o JPEG 0,85 si el navegador no genera WebP.
- `public/robots.txt` con `Disallow: /admin`. Además el panel agrega `<meta name="robots" content="noindex">` mientras está abierto.
- No se tocaron `System-Turnos/`, `Contexts/`, `Services-Api/`, la web pública (salvo `AppRoutes.tsx`) ni el back. No se agregaron dependencias: los íconos son de `lucide-react`, que ya estaba.

## Mapa de pantallas y rutas

| Ruta | Pantalla | Qué tiene |
|---|---|---|
| `/admin/login` | Login | Email, contraseña con botón para mostrarla, «Ingresar», «Me olvidé la contraseña». Errores de Firebase en castellano. Al abrir, hace un `GET /api/health` en segundo plano para despertar Render |
| `/admin` | Inicio | «Hola, Nico», tarjetas **Productos** y **Galería de trabajos**, link «Ver la web» (pestaña nueva), «Salir» arriba |
| `/admin/productos` | Productos | «+ Agregar producto», filas con foto, nombre, precio («$ 15.000» / «Sin precio» / «Precio oculto»), interruptor «Se ve en la web» y ▲ ▼. Vacía: «Todavía no cargaste productos» |
| `/admin/productos/nuevo` y `/admin/productos/:id` | Producto | Fotos (1 a 6, «Quitar» / «Poner primera»), Nombre, Precio + «Mostrar el precio en la web», Descripción (contador hasta 600), «¿Tiene tamaños o tonos?» plegable, «Se ve en la web», «Guardar» fijo abajo, «Eliminar producto» con confirmación |
| `/admin/galeria` | Galería | «+ Agregar foto», filtro Todas · Lavado y peinado · Corte y barbería · Coloración y mechas, filas con foto, servicio, descripción, marca «Destacada», interruptor y ▲ ▼ (solo con «Todas»; con filtro: «Para cambiar el orden, elegí «Todas»») |
| `/admin/galeria/nueva` y `/admin/galeria/:id` | Trabajo | Foto («Elegir foto» / «Cambiar foto»), Servicio (tres botones grandes), Descripción (hasta 140), «Destacar», «Se ve en la web», «Guardar», «Eliminar foto» |
| cualquier otra `/admin/...` | — | Redirige a `/admin` |

Si no hay sesión, cualquier ruta protegida lleva al login y, después de ingresar, vuelve a donde estaba. Si la cuenta no tiene el permiso de admin, aparece «Esta cuenta no tiene permiso para usar el panel» con «Salir».

## Archivos

| Archivo | Qué es |
|---|---|
| `src/Components/AppRoutes.tsx` | `lazy` de `AdminApp`, ruta `/admin/*` con `Suspense`, sin Navbar/Footer/WhatsApp en `/admin` |
| `src/vite-env.d.ts` | Tipos de las variables `VITE_*` (Firebase, Sanity, API) |
| `.env.development` (nuevo) / `.env.production` | `VITE_API_URL` (local / Render) |
| `public/robots.txt` (nuevo) | `Disallow: /admin` |
| `src/features/admin/AdminApp.tsx` | Rutas internas, proveedores, título y `noindex` |
| `src/features/admin/admin.css` | Base del panel: colores, botones, campos, pie fijo. Todo bajo `.adm` |
| `src/features/admin/lib/firebase.ts` | Firebase Auth propia (app con nombre `admin`), persistencia local |
| `src/features/admin/lib/api.ts` | `fetch` con `Bearer`, errores traducidos, una función por endpoint |
| `src/features/admin/lib/comprimirImagen.ts` | Achicar y comprimir fotos |
| `src/features/admin/lib/useFotos.ts` | Lista de fotos con compresión, subida e indicador por foto |
| `src/features/admin/lib/useLista.ts` | Carga de listas, «Se ve en la web» al toque y reordenar |
| `src/features/admin/lib/tipos.ts`, `util.ts` | Tipos de la API; precio, servicio, miniaturas, aviso de «servidor despertando», aviso al cerrar con cambios |
| `src/features/admin/auth/` | `AdminAuthContext` (estados cargando / sin sesión / sin permiso / admin, `salir()`) y `RequireAdmin` |
| `src/features/admin/components/` | `BarraSuperior`, `Avisos` (aviso abajo + diálogo de confirmación), `Interruptor`, `Cargando`, `FilaLista`, `GrillaFotos`, CSS de listas y formularios |
| `src/features/admin/pages/` | `Login`, `SinPermiso`, `Inicio`, `Productos`, `ProductoForm`, `Galeria`, `TrabajoForm`, cada una con su CSS |
| `docs/avances/07-material/` | Capturas |

## Decisiones durante la implementación

- **Aviso y confirmación propios** (`Avisos.tsx`): un solo proveedor para los dos, así el aviso «Guardado…» sobrevive al volver a la lista. La confirmación es un panel abajo de la pantalla (en compu, centrado) con «Sí, eliminar» en rojo y «Cancelar». No se usa `window.confirm`, que en el celular se ve raro y no se puede capturar.
- **«Se ve en la web» cambia al toque**: se ve el cambio enseguida y, si el back falla, vuelve atrás con el error. Muestra «Listo, ahora se ve en la web» o «Listo, ya no se ve en la web».
- **Solo cuenta la respuesta del último pedido** al cargar listas y formularios. Lo encontró la prueba de punta a punta: en desarrollo React pide la lista dos veces y, si la segunda respuesta llegaba después de tocar el interruptor, lo volvía al valor viejo. El siguiente toque mandaba entonces el mismo valor otra vez. En producción podía pasar con una carga lenta, por ejemplo tras «Probar de nuevo».
- **Texto alternativo de las fotos**: no se le pide a Nico. Para productos se manda el nombre del producto; para trabajos, la descripción o el nombre del servicio.
- **Crear vs. editar**: al crear, los opcionales vacíos no se mandan. Al editar se mandan en `null` para borrarlos (precio, descripción, variantes). El precio de una variante se omite si está vacío, porque el back no acepta `null` ahí.
- **Variantes**: las filas vacías se descartan al guardar. Una fila con precio y sin nombre da el error «Cada tamaño o tono necesita un nombre». Abrir la sección agrega una fila vacía, pero eso no cuenta como «cambio sin guardar».
- **Cambios sin guardar**: «Volver» pregunta «Tenés cambios sin guardar. ¿Salir igual?» («Salir sin guardar» / «Cancelar»). Cerrar o recargar la pestaña muestra el aviso del navegador.
- **Servidor lento**: los estados de carga, el login y el «Guardar» muestran «El servidor se está despertando, puede tardar hasta un minuto…» si tardan más de 5 s.
- **Ingreso**: si no se escribió el email, «Me olvidé la contraseña» pide escribirlo primero. Si Firebase dice que el usuario no existe, se muestra igual «Te mandamos un mail…», para no revelar qué emails tienen cuenta.
- **Filtro de galería en dos renglones** en el celular (no desplazable de costado), así se ven siempre las cuatro opciones.
- **Firebase con nombre de app propio (`admin`)**, para no chocar con la inicialización vieja de `Services-Api/Auth.tsx` si algún día se cargan las dos.
- **CSS**: los resets del panel usan `:where(.adm)`, con especificidad cero, para que no pisen las clases de cada componente. Con `.adm button` el texto de los botones negros salía invisible.

## Desvíos respecto al brief

- **Captura «productos sin datos»**: en Sanity está el producto PRUEBA del brief 05, que no se borra. Para la captura se simuló la respuesta vacía del back (`page.route`), solo en el navegador de prueba.
- **Captura «producto con fotos y variantes»** (`08`): es la pantalla de edición de un producto de prueba creado por la API (con las fotos de los PRUEBA del 05), sacada con la ventana alta para que «Guardar» quede abajo. La pantalla de alta con fotos ya subidas se probó en la prueba de punta a punta.
- Se sumó la captura `14-galeria-destacada-390.jpg` (marca «Destacada»).

## Verificación

| Prueba | Resultado |
|---|---|
| `npm run build` | OK |
| `npm run lint` | 0 errores, 9 warnings (los mismos de antes, en archivos que no se tocaron) |
| Chunk principal | `index-*.js` **435,13 kB → 436,91 kB** (gzip 145,41 → 146,24). Los +1,8 kB son el `lazy`/`Suspense` y el helper de precarga de Vite. **0 apariciones de `firebase`** en el chunk principal |
| Chunk del panel | `AdminApp-*.js` 211,66 kB (gzip 47,37) + `AdminApp-*.css` 14,8 kB, con Firebase adentro. `index.html` no lo precarga. Al abrir `/` en el navegador no se pide nada de `features/admin` ni de Firebase |
| Rutas públicas igual que en `development` | Comparación píxel a píxel de `/`, `/servicios`, `/historia` y `/contacto` a 390 y 1440 (página completa, videos frenados), build de `development` contra build de `feat/admin`: **0 píxeles distintos en las 8** |
| Login con error | «Email o contraseña incorrectos» |
| Sin permiso | Usuario temporal creado con la REST API de Firebase (`accounts:signUp`): ve «Esta cuenta no tiene permiso para usar el panel», el back le responde 403 y «Salir» vuelve al login. **Se borró** (`accounts:delete`) y se verificó que ya no puede ingresar |
| Foto grande | Foto de 4800×3600 → subida como **1600×1200 WebP** (asset `…-1600x1200-webp`). La foto real de 534×800 no se agrandó |
| Punta a punta: productos | Producto con 2 fotos (`04a-material/fotos/Nico WEB-1.jpg` + la de 4800×3600) y variante «250 ml» $12.500 → creado y visible en el CDN. Editado (nombre y «Poner primera») → OK. Oculto → desaparece del CDN. Mostrado → vuelve. Reordenado (▲) → orden nuevo, se mantiene al recargar. Eliminado con confirmación → sale del CDN |
| Punta a punta: galería | Trabajo «Corte y barbería» creado. Filtro «Corte y barbería» muestra solo ese, sin flechas y con la nota. «Coloración y mechas» muestra solo el PRUEBA del 05. Destacado → `destacado: true` en el CDN y marca «Destacada». Eliminado → sale del CDN |
| Al final | En Sanity quedan solo `prueba-producto-shampoo` y `prueba-trabajo-coloracion`, 0 borradores y 2 assets, igual que antes: el back borra las fotos que quedan sin usar |
| Recargar en `/admin/productos` | Mantiene la sesión |
| Cambios sin guardar | Sin cambios, «Volver» sale directo. Con cambios, pregunta. «Cancelar» se queda con lo escrito. «Salir sin guardar» vuelve a la lista |

Las pruebas se hicieron con Playwright (Chromium, 390×844 con pantalla táctil) contra el Vite de desarrollo y el back local, con la cuenta admin de Santiago. La contraseña se pasó como variable de entorno y no quedó en ningún archivo.

## Capturas (`docs/avances/07-material/`)

390×844: `01-login`, `02-login-error`, `03-sin-permiso`, `04-inicio`, `05-productos-vacio`, `06-productos`, `07-producto-nuevo`, `08-producto-fotos-variantes` (página completa), `09-confirmar-eliminar`, `10-galeria-filtro`, `11-trabajo-nuevo`, `14-galeria-destacada`. 1440×900: `12-inicio-1440`, `13-productos-1440`. Todas en JPG calidad 80, entre 29 y 190 KB.

## Pendientes o problemas

- **El CDN de Sanity tardó entre 0 s y unos 2 minutos** en reflejar los cambios (una vez, unos 4 minutos). El aviso dice «Puede tardar hasta un minuto», como pide el brief. Si Nico se queja, conviene cambiarlo por «unos minutos».
- **La flecha «atrás» del celular o del navegador no pregunta** por cambios sin guardar. La app usa `BrowserRouter`, y bloquear esa navegación (`useBlocker`) necesita el router de datos de React Router. Sí preguntan el «Volver» del panel y el cierre o recarga de la pestaña.
- **Una vez, el clic en ▲ no generó el pedido** en la prueba larga. No se pudo reproducir: anduvo en la prueba aislada y en la corrida completa siguiente. Queda anotado por si aparece.
- El primer intento de login con la cuenta admin dio «credenciales inválidas» y un rato después la misma contraseña anduvo. Parece del lado de Firebase; el panel mostró bien el error.
- Las variables de Firebase están solo en `.env`, que Vite carga en todos los modos, incluido el build de producción. Si en Vercel se configuran variables aparte, hay que sumar las de Firebase y `VITE_API_URL`.
- `categoria` no se muestra ni se manda, como pide el brief.
- Hay un `stash@{0}` con un cambio ajeno al 07 (ver «Retomado»).

## Retomado (brief 07-R)

El brief 07 se había corrido en otra sesión que quedó frenada. Diagnóstico al retomar:

- Remote `santicbsn14/nicolasSanetti-Front`. La rama local `feat/admin` existía pero **estaba en el mismo commit que `development`** (`5405812`): sin commits del 07, sin stash, sin archivos nuevos.
- API local: `200 {"status":"ok"}`.
- Único cambio sin commitear: el comentario sobre el sistema de turnos borrado en `AppRoutes.tsx`, **ajeno al 07**. Se guardó en `stash@{0}` («ajeno al 07: comentario borrado en AppRoutes») y no entró en ningún commit. El comentario sigue en el archivo.

| Punto del brief 07 | Estado al retomar | Qué se hizo en esta sesión |
|---|---|---|
| 1. Configuración (`VITE_API_URL`, `firebase.ts`, `api.ts`, `comprimirImagen.ts`, `robots.txt`) | Falta (no existía `src/features/admin/`) | Hecho completo |
| 2. Ruteo lazy `/admin/*` sin Navbar/Footer/WhatsApp | Falta | Hecho |
| 3. Sesión (`AdminAuthContext`, `RequireAdmin`, ping a health) | Falta | Hecho |
| 4. Pantallas (login, inicio, productos, producto, galería, trabajo) | Falta | Hechas |
| 5. Estilo | Falta | Hecho |
| 6. Capturas | Falta | 14 capturas |
| Criterios: build, lint, chunk sin Firebase | Falta | Verificados |
| Criterios: punta a punta, sin permiso, 1600 px, recarga, rutas públicas | Falta | Verificados (ver tabla de verificación) |
