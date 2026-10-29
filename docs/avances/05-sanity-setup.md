# Brief 05 — Sanity: proyecto, schemas y cliente de lectura

## Qué se hizo
- Proyecto Sanity nuevo **"Nicolas Sanetti Coiffeur"** con dataset `production` público, y Studio (template `clean`, TypeScript) en `studio/`.
- Schemas `producto` y `trabajo` con textos en español, previews y orderings (por `orden` ascendente y por más recientes).
- Studio deployado en `https://nicolas-sanetti.sanity.studio`.
- CORS configurados sin credenciales.
- Cliente de lectura tipado en el front (`src/lib/`), con queries GROQ que filtran `activo == true`.
- Dos documentos de prueba importados y verificados por el CDN público y por el cliente del front.
- No hay cambios visibles en la web: nada importa `src/lib/` todavía.

## Datos del proyecto
| Dato | Valor |
|---|---|
| Project ID | `6j2h7mq3` |
| Organización | `ooVuYuIDu` (santicbsn14) |
| Dataset | `production` (aclMode `public`) |
| Studio | https://nicolas-sanetti.sanity.studio (appId `s7v6xrclshx5f78z5baoat6c`) |
| Manage | https://www.sanity.io/manage/project/6j2h7mq3 |
| API version | `2025-02-19` |

**CORS** (todos sin credenciales salvo el del Studio local, que lo creó la CLI):
- `http://localhost:3333` (credenciales: sí — Studio local, agregado por `sanity init`)
- `http://localhost:5173`
- `http://localhost:4173`
- `https://nicolas-sanetti-front.vercel.app`
- `https://*.vercel.app` — el comodín se acepta (la CLI pide `--yes` para confirmarlo)

**Documentos de prueba** (borrar cuando haya contenido real):
- `prueba-producto-shampoo` — producto "PRUEBA — Shampoo", slug `prueba-shampoo`, precio 15000, variante "500 ml" ($15000), imagen `Nico WEB-7.jpg`.
- `prueba-trabajo-coloracion` — trabajo `coloracion-y-mechas`, descripción "PRUEBA", imagen `Nico WEB-14.jpg`.

Para borrarlos: `cd studio && npx sanity documents delete prueba-producto-shampoo prueba-trabajo-coloracion`.

## Archivos creados o modificados
- `studio/` (nuevo): Studio completo. Propios del brief:
  - `studio/schemaTypes/producto.ts`, `studio/schemaTypes/trabajo.ts`, `studio/schemaTypes/index.ts`
  - `studio/sanity.cli.ts` (`studioHost: 'nicolas-sanetti'`, `deployment.appId`)
- `src/lib/sanity.ts` — `client` (CDN, sin token) y `urlFor(source)` (ya aplica `auto('format')`; se encadena `.width()`, etc.).
- `src/lib/sanity.types.ts` — `ServicioSlug`, `SERVICIOS`, `SanityImagen`, `Variante`, `Producto`, `ProductoResumen`, `Trabajo`.
- `src/lib/sanity.queries.ts` — `PRODUCTOS_QUERY`, `PRODUCTO_POR_SLUG_QUERY`, `TRABAJOS_QUERY`, `TRABAJOS_POR_SERVICIO_QUERY`.
- `package.json` / `package-lock.json` — `@sanity/client` ^8.10.1, `@sanity/image-url` ^2.1.1.
- `.env`, `.env.production` — `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`.
- `eslint.config.js` — `studio` en `ignores`.

## Decisiones durante la implementación
- `npm create sanity@latest` en modo no interactivo (`-y`) exige `--organization`; se usó la organización personal de Santiago, la misma de los otros proyectos. Se pasó `--no-git` para que no cree un repo dentro del repo.
- La CLI ya estaba logueada; no hizo falta login en el navegador.
- `trabajo.servicio` usa `layout: 'radio'` (son solo tres opciones). Los valores están en `studio/schemaTypes/trabajo.ts` (`SERVICIOS`) y duplicados en `src/lib/sanity.types.ts`: el front y el Studio no comparten código, así que hay que mantener ambos iguales.
- El preview de las variantes en el Studio muestra el precio (o "Sin precio"), igual que el del producto. Precios formateados con `toLocaleString('es-AR')`.
- `@sanity/image-url` v2: se usa el export nombrado `createImageUrlBuilder` (el default está deprecado).
- `urlFor` ya devuelve el builder con `auto('format')`, así nadie se olvida de pedirlo.
- Los tipos marcan los opcionales como `?: T | null`, porque las proyecciones GROQ devuelven `null` (no `undefined`) cuando el campo no existe.
- `PRODUCTOS_QUERY` devuelve la primera imagen como `imagen` (tipo `ProductoResumen`), y todas las queries devuelven `slug` ya aplanado (`slug.current`).
- Las imágenes de prueba son las de `docs/avances/04a-material/fotos/` (534×800, ya reducidas en el brief 04a), no los originales de `material-nico/`.

## Desvíos respecto al brief
- Ninguno funcional. Único detalle: el comodín de CORS necesitó `--yes`, pero quedó configurado.
- Se agregó el tipo `ProductoResumen` (no estaba pedido) para tipar el resultado del listado, que no trae todos los campos de `Producto`.

## Pendientes o problemas
- Borrar los dos documentos de prueba antes de publicar la galería/catálogo.
- `.env` y `.env.production` están versionados (ya lo estaban antes). El project ID no es secreto, así que está bien, pero **no** poner nunca un token ahí.
- El build sigue igual: JS `index-BZV8v4l5.js` 431.98 kB antes y después (mismo hash). Lint: 9 warnings preexistentes, 0 errores.
- `npm install` avisa vulnerabilidades en dependencias (preexistentes, no se tocaron).

## Cómo probarlo
1. Studio: entrar a https://nicolas-sanetti.sanity.studio → se ven "Producto" y "Trabajo" con los documentos de prueba.
2. CDN público sin token:
   ```
   curl "https://6j2h7mq3.apicdn.sanity.io/v2025-02-19/data/query/production?query=*%5B_type%20in%20%5B%22producto%22%2C%22trabajo%22%5D%5D%7B_id%2C_type%7D"
   ```
   Devuelve `prueba-producto-shampoo` y `prueba-trabajo-coloracion`.
3. Imagen: `https://cdn.sanity.io/images/6j2h7mq3/production/2ef559859da7993af36154c2f5e50996f3a6bd8e-534x800.jpg?w=600&auto=format` → 200, `image/webp` con un navegador (y `image/jpeg` si el cliente no acepta webp).
4. Cliente del front: se verificó con un script temporal fuera del repo, corrido con `npx vite-node` desde la raíz (carga `.env`), que ejecutó las cuatro queries (1 producto, el producto por slug con su variante, 1 trabajo, 1 trabajo en coloración y 0 en corte) y generó las URLs con `urlFor(...).width(600)`.
5. Studio local: `cd studio && npm install && npm run dev` → http://localhost:3333.
