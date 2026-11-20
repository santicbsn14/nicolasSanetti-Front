import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type Props = { children: ReactNode; fallback: ReactNode }

class LimiteDeError extends Component<{ children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false }

  static getDerivedStateFromError() {
    return { fallo: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('No se pudo cargar la página', error, info.componentStack)
  }

  render() {
    if (!this.state.fallo) return this.props.children
    return (
      <div className="carga-pagina-error" role="alert">
        <p>No pudimos cargar esta página.</p>
        <button
          type="button"
          className="hero__btn hero__btn--secundario carga-pagina-error__btn"
          onClick={() => window.location.reload()}
        >
          Recargar
        </button>
      </div>
    )
  }
}

// Envuelve una ruta lazy: Suspense mientras llega el chunk y, si la carga falla
// (por ejemplo, un chunk que ya no existe después de un deploy), un mensaje con
// «Recargar» en vez de la pantalla en blanco. La key por ruta reinicia el error al navegar.
function CargaPagina({ children, fallback }: Props) {
  const { pathname } = useLocation()
  return (
    <LimiteDeError key={pathname}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </LimiteDeError>
  )
}

export default CargaPagina
