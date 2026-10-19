# Avance 01 — Ocultar turnos + reserva por WhatsApp

## Qué se hizo

- Tag `v1-con-turnos` creado sobre `154e3de` (estado previo a este brief) y pusheado a `origin`.
- Helper único de WhatsApp en `src/features/whatsapp/whatsapp.ts`: `WHATSAPP_NUMBER` (con `// TODO: confirmar con Nico`), `MENSAJE_TURNO` y `buildWaLink(mensaje)`.
- Botón flotante `WhatsAppFloat` abajo a la derecha, con la estética de la marca: fondo `#131313`, ícono blanco, borde blanco semitransparente, 56px (48px en mobile), sombra suave, leve escala en hover y `env(safe-area-inset-bottom)`.
- `AppRoutes.tsx`: se sacaron todas las rutas `/turnos/*`, sus imports, `TurnoProvider`, `AuthProvider`, `ProtectedRoute`, `NavbarTurnos` y la lógica `isTurnosPage`. Ahora siempre se muestra `<Navbar />`. Cualquier `/turnos/*` redirige a `/` con `replace`. El botón flotante se renderiza junto al `<Footer />`.
- Navbar: "TURNOS" pasa a ser "RESERVÁ TU TURNO" y abre WhatsApp en pestaña nueva. En mobile cierra el menú al tocarlo. Se sacó el `case '/turnos'` del switch.
- Footer: "Turnos" pasa a ser "Reservá tu turno" (WhatsApp). El teléfono es link a WhatsApp. Los íconos de Facebook e Instagram ahora son links con `aria-label`.
- Contacto: la sección `cta-turnos` invita a escribir por WhatsApp con el botón "Reservá por WhatsApp". Se sacó "o completar el formulario" y el import de `Link`.

### Tamaño del bundle (`vite build`)

| | Antes (tag `v1-con-turnos`) | Después | Diferencia |
|---|---|---|---|
| JS | 1.344,46 kB (gzip 395,45 kB) | **431,76 kB (gzip 144,42 kB)** | −68 % (gzip −63 %) |
| CSS | 66,26 kB (gzip 11,89 kB) | 15,48 kB (gzip 3,59 kB) | −77 % |

Firebase, axios y todo el sistema de turnos quedaron fuera del bundle: el JS ya no contiene `firebaseapp`/`identitytoolkit`. Además desapareció el warning de Vite por chunks de más de 500 kB.

## Archivos creados o modificados

| Archivo | Cambio |
|---|---|
| `src/features/whatsapp/whatsapp.ts` | Nuevo: número, mensaje y `buildWaLink` |
| `src/features/whatsapp/WhatsAppFloat.tsx` | Nuevo: botón flotante |
| `src/features/whatsapp/WhatsAppFloat.css` | Nuevo: estilos del botón |
| `src/Components/AppRoutes.tsx` | Sin rutas de turnos, redirect `/turnos/*` → `/`, `<WhatsAppFloat />` |
| `src/Components/Navbar/Navbar.tsx` | Link a WhatsApp, cierra menú en mobile, sin `case '/turnos'` |
| `src/Components/Footer/Footer.tsx` | Reservá tu turno, teléfono y redes como links |
| `src/Components/Footer/Footer.css` | Color blanco para los links nuevos (teléfono y redes) |
| `src/Components/Contacto/Contacto.tsx` | CTA por WhatsApp, texto sin "formulario", sin `Link` |
| `docs/avances/01-ocultar-turnos-whatsapp.md` | Este archivo |

No se tocó nada en `System-Turnos/`, `Contexts/`, `Services-Api/` ni `MockService/`, ni en `package.json`.

## Decisiones durante la implementación

- **`z-index` del botón flotante: 40.** La navbar es `position: fixed` con `z-index: 50` y forma su propio contexto de apilamiento, así que el menú mobile abierto queda a nivel 50 frente al resto de la página. El contenido llega como mucho a `z-index: 10` (Home). Con 40, el botón queda por encima del contenido y por debajo del menú.
- **El botón flotante es un `<a>`, no un `<button>`**, porque navega a una URL externa.
- **Teléfono del footer → WhatsApp con `MENSAJE_TURNO`.** El brief pedía "link a WhatsApp" sin aclarar el mensaje. Se usó el mismo de turno para tener un único mensaje.
- **CSS del footer:** no hay estilo global para `a` (el de `index.css` está comentado), así que los links nuevos se verían en azul. Se agregó `color: #fff` para `.footer-social a` y `.footer-contact-link`, igual que el `style` inline que ya tenía la dirección. "Reservá tu turno" usa `footer-link`, como sus hermanos.
- **Verificación del CSS:** como el CSS bajó mucho, se revisó que ninguna clase usada por las páginas públicas (Home, Servicios, Historia, Contacto, Navbar, Footer) estuviera definida solo en el CSS de turnos, y que ese CSS no tuviera selectores globales (`body`, `a`, etc.). No hay ninguna. `ReactToastify.css` solo afecta a `.Toastify`. Toda la baja de CSS corresponde a turnos.

## Desvíos respecto al brief

- **Ubicación del repo:** en disco el front está en `Nicolas-Sanetti-Front/NicolasSanetti-Front/`. La carpeta de arriba (`Nicolas-Sanetti-Front/`) no es un repo, y git desde ahí resuelve a un repo en `C:\Users\Admin` con remote `portfolio-proyect-two` (inexistente). Se trabajó solo en `NicolasSanetti-Front/` (remote `santicbsn14/nicolasSanetti-Front`, rama `development`).
- Se tocó `Footer.css` (el brief lo permitía "si hace falta") solo para el color de los links nuevos.

## Pendientes o problemas

- **Confirmar el número de WhatsApp con Nico** (`TODO` en `whatsapp.ts`).
- **Detalle previo, no tocado:** los links del menú del footer (Home, Servicios, Historia y ahora Reservá tu turno) se ven con el azul y subrayado por defecto del navegador, porque `.footer-link` no tiene estilos. Ya pasaba antes de este brief. Conviene darles estilo en un brief de UI.
- **Detalle previo, no tocado:** el CSS existente `.footer-social i` apunta a etiquetas `<i>`, pero FontAwesome renderiza `<svg class="i">`, así que esa regla nunca aplicó.
- Dependencias que ya no se usan en el bundle (`firebase`, `axios`, `react-toastify`, etc.): se sacan en el brief 03.

## Cómo probarlo

```bash
npm run build
npx vite preview
grep -rn "/turnos" src --include=*.tsx | grep -v System-Turnos | grep -v Contexts
# → solo AppRoutes.tsx: <Route path="/turnos/*" element={<Navigate to="/" replace />} />
```

En el navegador:

1. Entrar a `/turnos`, `/turnos/login` y `/turnos/professional/dashboard`: todas redirigen a `/`.
2. Navbar desktop: "RESERVÁ TU TURNO" abre WhatsApp en pestaña nueva con el mensaje.
3. Navbar mobile (≤768px): abrir la hamburguesa y tocar "RESERVÁ TU TURNO": abre WhatsApp y el menú se cierra.
4. Footer: "Reservá tu turno" y el teléfono abren WhatsApp. Facebook e Instagram abren las redes.
5. `/contacto`: "Reservá por WhatsApp" abre WhatsApp.
6. Botón flotante: abre WhatsApp. A 375px queda en la esquina inferior derecha (48px) sin tapar contenido, y con el menú abierto no se superpone.

Verificado con Chrome headless (por CDP) contra `vite preview`. Las redirecciones, los 5 links (`target="_blank"`, `rel="noopener noreferrer"` y el `href` `https://wa.me/5493364614298?text=%C2%A1Hola%20Nico!%20Quiero%20reservar%20un%20turno.%20%C2%BFQu%C3%A9%20disponibilidad%20ten%C3%A9s%3F`), el cierre del menú mobile y las capturas a 375px de Home, Servicios, Historia y Contacto dieron OK.
