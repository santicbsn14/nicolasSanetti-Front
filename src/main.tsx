import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'

// Después de un deploy, los chunks viejos de las páginas que se cargan aparte dejan de
// existir: quien tenía la web abierta toca un link y el import() falla. Vite avisa con
// este evento; recargamos para traer la versión nueva. Si ya recargamos por esto hace
// menos de 10 s, no insistimos (evita un bucle): el error sigue y lo muestra el error
// boundary de AppRoutes con el botón «Recargar».
const CLAVE_RECARGA = 'recarga-por-chunk'
window.addEventListener('vite:preloadError', (event) => {
  try {
    const ultima = Number(sessionStorage.getItem(CLAVE_RECARGA))
    if (ultima && Date.now() - ultima < 10_000) return
    sessionStorage.setItem(CLAVE_RECARGA, String(Date.now()))
  } catch {
    return // sin storage no hay guardia: mejor no recargar
  }
  event.preventDefault()
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
