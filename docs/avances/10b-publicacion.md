# Brief 10b — Publicar la etapa 2

Producción (`development` en Vercel): **https://nicolas-sanetti-front.vercel.app**
Back real (Render): **https://nicolas-sanetti-system-misc.onrender.com**

## Commits y tags

| | |
|---|---|
| `df118b6` (`feat/admin`) | `fix: navbar blanca en escritorio` |
| `f412409` (`development`) | `merge: etapa 2 — panel, galería, catálogo y ajustes (briefs 02, 07–10)` (sin conflictos) |
| `28feba7` (`development`) | `fix: URL del back de Render` (`.env.production`) |
| Tag `v1-antes-etapa2` | `origin/development` antes del merge (respaldo) |
| Tag `v2-etapa2` | `28feba7`, lo publicado |

`feat/admin` no se borró.

## Qué se hizo

### 1. Navbar blanca también en escritorio (`df118b6`)

- `.navbar` va con fondo blanco en todos los anchos. La sombra sigue apareciendo recién con scroll (`.navbar--scrolled`). Se sacó el bloque `@media (max-width: 1359px)` que lo hacía solo en modo hamburguesa, que además estaba duplicado.
- Quiénes somos: la portada arranca debajo de la navbar en todos los anchos. En escritorio son `margin-top: 59px` (lo que mide la navbar ahí); en modo hamburguesa sigue en 64/67 px.
- Servicios: `margin-top: 59px` solo desde 1360 px. En modo hamburguesa la foto sigue debajo de la navbar como en el 10a, donde solo tapa el techo; el brief pedía que en celular siga igual.
- Contacto: en escritorio el título quedaba tapado (empezaba en y = 32, con navbar de 59 px). Se aplicó `padding-top: 88px` en todos los anchos, que antes era solo hamburguesa.

Mediciones con Playwright (build local, `top` del primer elemento):

| Página | 1360 / 1440 / 1920, antes | Después |
|---|---|---|
| Servicios (foto / título) | 0 / 206 | 59 / 265 |
| Quiénes somos (foto / título) | 0 / 206 | 59 / 265 |
| Contacto (título) | 32 (tapado) | 88 |
| Inicio, Galería, Productos, Pedido | 343–349, 176, 176, 120 | sin cambios |

A 390, 768 y 1024 los valores dieron idénticos antes y después.

### 2. Merge a producción

Tag de respaldo, merge `--no-ff` sin conflictos, build, lint (0 errores, los 9 warnings de siempre) y test (7/7). Vercel publicó en ~20 s (`index-DKo-tnYN.js`).

### 3. URL del back (`28feba7`)

El panel de producción apuntaba a `https://nicolas-sanetti-system.onrender.com`. Ese es **otro servicio de Render con una versión vieja del back**, anterior al brief 06: tiene `/api/health`, pero no las rutas `/api/admin/*`. El back real, con las variables de Sanity y `CORS_ORIGINS`, es `https://nicolas-sanetti-system-misc.onrender.com` (lo encontró Santiago).

Se cambió `VITE_API_URL` en `.env.production`. Los `Services-Api/*.ts` del sistema de turnos no se tocaron porque no se usan. Vercel publicó `index-UG351UTC.js`: la URL vive en el chunk `AdminApp-Dk4vr4lY.js`, que tiene la `-misc` y ninguna referencia a la vieja.

## Verificaciones

| Verificación | Resultado |
|---|---|
| `/`, `/servicios`, `/galeria`, `/productos`, `/quienes-somos`, `/contacto`, `/pedido`, `/admin/login` a 390 y 1440 | 200, sin errores de consola ni pedidos fallidos |
| `curl -I /historia` | `308`, `location: /quienes-somos` |
| PRUEBA en `/galeria` y `/productos` | Se ven (en `/galeria` a 390 la foto sin texto, porque el epígrafe es de escritorio). Sanity se lee bien desde producción |
| Login con email y contraseña inventados | «Email o contraseña incorrectos» (Firebase responde `400` desde producción, que es lo esperado) |
| Pedido de despertar | `GET -misc/api/health` → 200, con `access-control-allow-origin` de producción |
| `-misc` `/api/health` | 200 |
| `-misc` `OPTIONS /api/admin/productos`, origin producción | 204 con `access-control-allow-origin: https://nicolas-sanetti-front.vercel.app` |
| `-misc` `GET /api/admin/productos` sin token, origin producción | **401** `{"message":"No autenticado"}` con el mismo header |
| Viejo (`nicolas-sanetti-system`) `GET /api/admin/productos` | 404 `Not found`: no tiene las rutas de admin |

## Qué pasó con el preview («No hay conexión con el servidor»)

Fueron dos cosas:

1. **URL equivocada:** el front apuntaba al servicio viejo, donde `/api/admin/*` no existe (404). Era el problema principal y afectaba igual a producción.
2. **CORS del preview:** ni el servicio viejo ni el `-misc` devuelven `access-control-allow-origin` para `https://nicolas-sanetti-front-git-feat-admin-santicbsn14s-projects.vercel.app` (`OPTIONS` 204 y `GET` 401, pero sin el header). O sea, el `CORS_ORIGINS` del `-misc` no tiene esa URL exacta. A producción no le afecta.

## Paso 4 (pendiente)

Al cerrar este avance (24/11/2026), `/galeria` y `/productos` todavía muestran los PRUEBA. Falta que Santiago:

1. Entre a https://nicolas-sanetti-front.vercel.app/admin con su usuario.
2. Borre «PRUEBA» en **Productos** y la única foto en **Galería de trabajos**.
3. Confirme que `/galeria` y `/productos` muestran «Muy pronto…».

Esa es la prueba de punta a punta de login, claim de admin, CORS y escritura en Sanity desde producción. Todavía no se hizo.

## Pendientes

- **Paso 4**, ver arriba.
- **Dominio propio** (brief 10c). Cuando esté, sumarlo a `CORS_ORIGINS` del `-misc`.
- **Horarios**: confirmarlos con Nico en `src/features/contacto/datos.ts`.
- **Acceso de Nico al panel**: en el back, `node scripts/set-admin.mjs <email>`. Crea el usuario si no existe, le da `admin` y devuelve un link para que defina su contraseña.
- **Servicio viejo de Render** (`nicolas-sanetti-system`): ya no lo usa nadie. Conviene suspenderlo o borrarlo para no confundirlo de nuevo.
- **CORS del preview**: si se quiere usar el panel desde previews, agregar la URL exacta del preview (sin `/` al final) a `CORS_ORIGINS` del `-misc`.
- **Copia local de `development`**: `Navbar.css`, `Historia.css` y `Contacto.css` aparecieron modificados sin commitear con el contenido de antes de `df118b6`, probablemente por OneDrive. No se commitearon. Para descartarlos: `git restore src/Components`.
