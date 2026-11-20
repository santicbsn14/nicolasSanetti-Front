type Conexion = { saveData?: boolean; effectiveType?: string }

// Pide en segundo plano el código de páginas que se cargan aparte, para que al entrar
// ya esté en caché. Espera a que termine de cargar la web y a que el navegador esté libre.
// No hace nada con ahorro de datos o conexión 2g.
export function precargarEnSegundoPlano(cargadores: Array<() => Promise<unknown>>) {
  const conexion = (navigator as Navigator & { connection?: Conexion }).connection
  if (conexion?.saveData || /(^|-)2g$/.test(conexion?.effectiveType ?? '')) return

  const precargar = () => cargadores.forEach((cargar) => cargar().catch(() => {}))
  const cuandoEsteLibre = () =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(precargar, { timeout: 5000 })
      : setTimeout(precargar, 2000)

  if (document.readyState === 'complete') cuandoEsteLibre()
  else window.addEventListener('load', cuandoEsteLibre, { once: true })
}
