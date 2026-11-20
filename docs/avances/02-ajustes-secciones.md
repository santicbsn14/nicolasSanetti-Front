# Avance 02 — Ajustes de secciones (Quiénes somos, horarios, servicios sin precios y detalles)

Rama `feat/admin`, **sin mergear a `development`**: se publica todo junto en el brief 10.
Código: commit `e2afe72`.

## Qué se hizo

- **Historia → Quiénes somos**
  - Ruta nueva `/quienes-somos`, con el mismo componente `HIstoria/Historia.tsx`.
  - `/historia` redirige:
    - En Vercel, con un 301 en `vercel.json` (`redirects`, antes del `rewrites`).
    - En la app (links internos viejos, `npm run dev`, `vite preview`), con `<Navigate to="/quienes-somos" replace />`.
  - Título sobre la portada: «QUIÉNES SOMOS». `document.title`: «Quiénes somos | Nicolás Sanetti Coiffeur». `alt` de la portada: «Portada de Quiénes somos».
  - En la navbar (barra y hamburguesa) dice **NOSOTROS**. En el footer dice «Quiénes somos». Ya no queda ningún link a `/historia` en `src/`.
  - Sin el mosaico de cuotas (y sin su CSS).
  - «Confianza y evolución» con foto nueva: un recorte de **Nico WEB-14** (ver Decisiones).
- **Horarios**
  - `src/features/contacto/datos.ts` tiene `HORARIO`, `HORARIO_CORTO` y `AVISO_TURNO`. Contacto y Footer los leen de ahí.
  - Contacto: «Horario: Lunes a sábado de 9:30 a 20 hs · Domingos cerrado» y abajo, en chico, «Te recomendamos sacar turno antes de venir.».
  - Footer, columna Contacto: «Lun. a sáb. 9:30 a 20 hs», debajo de la dirección y con el mismo estilo.
- **Servicios sin precios**
  - Sin el mosaico de cuotas (y sin su CSS, que estaba duplicado).
  - Cada servicio muestra sus prestaciones solo con el nombre y la línea fina abajo. Ahora es una `<ul>`.
  - Botón «Consultá precios por WhatsApp» (`<a target="_blank" rel="noopener noreferrer">`). Arma el mensaje «¡Hola Nico! Quería consultar el precio de {servicio en minúscula}.».
  - Al lado va el link «Ver trabajos de … →» del brief 08. En celular quedan uno debajo del otro (`flex-wrap`).
  - `.servicio-texto` sin `height: 700px`: la columna mide lo que mide el texto y se centra con la foto.
  - Se sacaron `valor` y `desde` de los datos (ahora `prestaciones` es una lista de nombres).
  - `alt` de la portada: «Portada de Servicios».
- **Ancho completo en pantallas grandes**
  - `#root` sin `max-width: 1512px`.
  - `.port-historia-img` con `width: 100%`.
  - Revisado a 1920 px: `/`, `/servicios`, `/galeria`, `/productos`, `/quienes-somos`, `/contacto` y `/pedido`. Todas usan los 1920 px y no hay scroll horizontal.
  - Las secciones que ya tenían su propio `max-width` quedan centradas: productos (1200), contacto (700), servicios (1300) y el texto de Quiénes somos.
- **Pedido: solo retiro en el salón**
  - Se sacó «¿Cómo lo querés recibir?». En su lugar va un recuadro: «Lo retirás en el salón: Colón 153, San Nicolás. Te avisamos por WhatsApp cuando esté listo.».
  - El mensaje ya no lleva la línea `Entrega: …`.
  - Se sacaron `Entrega`, `ENTREGAS` y `textoEntrega` de `mensaje.ts`. Los tests se actualizaron y verifican que el mensaje no diga «Entrega».
  - `localStorage` (`nsc-pedido-cliente-v1`) solo guarda `{ nombre }`. Si un navegador tiene guardado `{ nombre, entrega: 'envio' }` de antes, `entrega` se ignora y se pisa al escribir el nombre (probado).
  - «Enviar pedido por WhatsApp» es un `<a href target="_blank" rel="noopener noreferrer">`, sin `window.open`:
    - Con el nombre vacío, `preventDefault`: no navega, muestra el error y pone el foco en el campo.
    - Mientras revisa precios o si no hay nada disponible, queda con `aria-disabled` y gris.
    - Al tocarlo con nombre, abre WhatsApp y aparece «¿Ya mandaste el mensaje? Podés vaciar el pedido.».
  - No había otros `window.open` hacia WhatsApp en el front público.
- **WhatsApp**: se sacó el `// TODO: confirmar con Nico` de `whatsapp.ts`.

## Archivos

- `vercel.json`: redirect 301.
- `src/App.css`: `#root` sin `max-width`.
- `src/Components/AppRoutes.tsx`: `/quienes-somos` y el `Navigate` desde `/historia`.
- `src/Components/Navbar/Navbar.tsx`: NOSOTROS, link y `case` del estilo.
- `src/Components/Footer/Footer.tsx`: link «Quiénes somos» y horario.
- `src/Components/Contacto/Contacto.tsx` y `Contacto.css`: horario y aviso de turno.
- `src/features/contacto/datos.ts` (nuevo).
- `src/Components/HIstoria/Historia.tsx` y `Historia.css`: título, `document.title`, sin mosaico, foto nueva, portada en celular.
- `src/Components/Imagenes/historia-confianza.webp` (nuevo). Se borró `historiaCinco_.webp`.
- `src/Components/Services/Services.tsx` y `Services.css`.
- `src/Components/Services/ServicioItem.tsx`: borrado (ver Decisiones).
- `src/Components/Productos/Pedido.tsx` y `Pedido.css`.
- `src/features/pedido/mensaje.ts` y `pedido.test.ts`.
- `src/features/whatsapp/whatsapp.ts`.

## Decisiones

- **Recorte de WEB-14.** Sale del original de `material-nico/` (1365×2048), no de la copia de `04a-material`.
  - Franja de 1365×936 desde y = 230: entran las caras de Nico y de la modelo, la mano de Nico en el pelo y el spray.
  - Exportado a 1318×904 (proporción 659×452), WebP calidad 80, sin metadatos: **69 KB**.
  - En la carpeta del material, suelto: `09-recorte-web14.jpg`.
- **Portada de Quiénes somos en celular.** Hasta 768 px la portada medía ~106 px de alto, quedaba debajo de la navbar fija (64 px) y el título se tapaba con el logo. Ya pasaba antes con «HISTORIA».
  - «QUIÉNES SOMOS» no entraba a 390 px y se partía en dos renglones fuera de la foto.
  - Arreglo, solo para `.port-historia` y hasta 768 px: portada de 220 px de alto (`object-fit: cover`) y título en un renglón con `clamp(1.75rem, 8vw, 2.4rem)`, corrido 24 px hacia abajo por la navbar.
  - Probado a 360, 390 y 768: el título queda entero por debajo de la navbar.
  - Servicios no se tocó (su `.titulo-overlay` tiene sus propias reglas).
- **El título sigue siendo un `<div>`**, como estaba. Pasarlo a `<h1>` cambia estilos (hay reglas globales de `.titulo-overlay` en dos CSS) y la navbar ya usa un `h1` para el logo. Queda para un brief de SEO si hace falta.
- **Navbar.** NOSOTROS mide 14 px más que HISTORIA. A 1360 la barra termina en x = 1297 (antes, 1290) y a 1440 en 1337: un solo renglón en los dos anchos, sin scroll horizontal. A 1359 sigue la hamburguesa.
- **Servicios.** «Consultá precios por WhatsApp» es un botón con borde (la acción principal) y «Ver trabajos de …» sigue como link subrayado. En la misma línea si entran, y uno debajo del otro en celular.
- **`ServicioItem.tsx` se borró.** No lo importaba nadie y era el único «A consultar…» que quedaba en `src/`.
- **Pedido.** El `<form>` queda, pero `onSubmit` solo hace `preventDefault`: Enter en el nombre no hace nada. Sin `window.open`, no se puede abrir WhatsApp desde un submit sin que lo bloqueen. Para enviar hay que tocar el link.
  - El link también tiene `onAuxClick`: con el nombre vacío, ni siquiera el clic del medio abre WhatsApp.

## Desvíos

- **`port-historia.webp` (1512×413) no tiene una versión más grande.** La original de antes del brief 03 (`port-services.png` en `cd1941b~1`, que es la que usaba Historia; también la del tag `v1-con-turnos`) mide lo mismo: 1512×413.
  - A 1920 se estira un 27 % y se ve un poco blanda pero aceptable (`08-1920-quienes-somos-despues.jpg`).
  - Si Nico tiene esa foto en más resolución, conviene reexportarla a 2048 px.
- La portada de Quiénes somos en celular cambió de alto (ver Decisiones). El brief pedía que el título «entre bien a 390 px», y sin este cambio no entraba.

## Pendientes

- **Probar el 301 en el preview de Vercel** (Santiago). Los previews tienen Deployment Protection, así que desde acá no se puede.
  ```
  curl -I https://nicolas-sanetti-front-git-feat-admin-santicbsn14s-projects.vercel.app/historia
  ```
  Tiene que dar `308` o `301` con `location: /quienes-somos`. Vercel usa 308 para `permanent: true`, y Google lo trata igual que un 301. Con la protección activa hay que hacerlo con sesión iniciada o con el bypass token.
- Que Nico vea la foto nueva de «Confianza y evolución» en el preview (no respondió sobre cuál usar).
- Portada de Quiénes somos en más resolución, si existe.
- Ya estaba antes: en celular, el logo de la navbar (texto oscuro, fondo transparente) se lee mal sobre la foto de la portada.

## Cómo probar

```
npm run build && npm run lint && npm test
npx vite preview --port 5173
```

- `npm run build`: OK.
- `npm run lint`: 0 errores. Los 9 warnings son los de siempre, en `System-Turnos/` y `Contexts/`.
- `npm test`: 7/7.
- `grep -rn "/historia\|A consultar\|mosaico-precios\|cuotas sin" src`: solo queda la ruta del `Navigate`.

Verificado con Playwright (Chrome) contra `vite preview`: build nuevo en 5173 y el de `a2e35cd` en 4173.

- `/historia` → `/quienes-somos`, con el título de la pestaña nuevo.
- Los tres «Consultá precios por WhatsApp» arman «¡Hola Nico! Quería consultar el precio de lavado y peinado. / corte y barbería. / coloración y mechas.».
- Contacto y footer muestran el horario nuevo. 0 links a `/historia`.
- Navbar: un renglón a 1360 y 1440, hamburguesa a 1359.
- A 1920, `#root` mide 1920 en las 7 páginas (antes, 1512) y `scrollWidth` es 1920.
- Pedido:
  - Sin nombre: 0 pestañas nuevas, se ve el error y la URL no cambia.
  - Con nombre: se abre `api.whatsapp.com` y aparece «¿Ya mandaste…?».
  - Mensaje: `…Total: $ 30.000\n\nNombre: Juan\nComentario: Paso el sábado`, sin «Entrega».
  - Con `{ entrega: 'envio' }` viejo en `localStorage` no se rompe nada.
- **Antes/después del resto de las páginas.** `/`, `/galeria` y `/productos` a 390 y 1440, con navbar, footer y botón de WhatsApp ocultos y videos enmascarados: las 6 capturas dan **idénticas píxel a píxel**.
  - En una primera corrida, `/` a 1440 dio distinto: un párrafo justificado cortaba distinto porque la fuente cargó a destiempo.
  - Medido con `document.fonts.ready`, ese párrafo tiene el mismo ancho y alto en las dos versiones, y en la segunda corrida la captura dio idéntica.
- Servicios a 768, 1024, 1366, 1440 y 1920: sin scroll horizontal. El texto mide lo que necesita (403 a 639 px de alto) y queda centrado con la foto de 500 px.

## Material (`docs/avances/02-material/`)

Todas las capturas a 390×844 y 1440×900, jpg calidad 80, de 15 a 172 KB.

| Archivo | Qué muestra |
|---|---|
| `01-quienes-somos-arriba-{390,1440}.jpg` | Título nuevo, sin mosaico |
| `02-confianza-y-evolucion-{390,1440}.jpg` | Foto nueva |
| `03-servicio-sin-precios-{390,1440}.jpg` | Corte y barbería: lista sin precios y los dos links |
| `04-contacto-horario-{390,1440}.jpg` | Horario nuevo |
| `05-footer-{390,1440}.jpg` | Horario y «Quiénes somos» |
| `06-pedido-retiro-{390,1440}.jpg` | Texto de retiro, sin la pregunta |
| `07-navbar-nosotros-{390,1440}.jpg` | Menú abierto (390) y barra (1440) |
| `08-1920-{home,servicios,quienes-somos}-{antes,despues}.jpg` | A 1920×1080, antes y después del arreglo de `#root` |
| `09-recorte-web14.jpg` | El recorte de WEB-14 suelto |
