import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../../features/pedido/carrito'
import { formatoPrecio, plural } from '../../features/pedido/formato'
import { calcularTotal } from '../../features/pedido/items'
import type { Aviso } from './useAviso'
import './BarraPedido.css'

const DURACION_AVISO = 3000

// Mientras se ve la barra, el body lleva esta clase: sube el botón flotante de WhatsApp
// y deja lugar abajo para que la barra no tape el final del footer.
const CLASE_BODY = 'con-barra-pedido'

// Barra fija «Tu pedido» + aviso «Agregado: …» (listado y detalle de productos)
function BarraPedido({ aviso }: { aviso: Aviso | null }) {
  const { items, cantidadTotal } = useCarrito()
  const [visible, setVisible] = useState<Aviso | null>(null)
  const hayBarra = cantidadTotal > 0

  useEffect(() => {
    if (!aviso) return
    setVisible(aviso)
    const t = window.setTimeout(() => setVisible(null), DURACION_AVISO)
    return () => window.clearTimeout(t)
  }, [aviso])

  useEffect(() => {
    if (!hayBarra) return
    document.body.classList.add(CLASE_BODY)
    return () => document.body.classList.remove(CLASE_BODY)
  }, [hayBarra])

  const { total, hayPrecio, hayConsultar } = calcularTotal(items)

  return (
    <>
      <div className="pedido-aviso-zona" role="status" aria-live="polite">
        {visible && (
          <div key={visible.id} className={`pedido-aviso${hayBarra ? ' pedido-aviso--sobre-barra' : ''}`}>
            <span className="pedido-aviso__texto">
              Agregado: <strong>{visible.nombre}</strong>
            </span>
            <Link to="/pedido" className="pedido-aviso__link">
              Ver pedido
            </Link>
          </div>
        )}
      </div>

      {hayBarra && (
        <div className="pedido-barra">
          <div className="pedido-barra__interior">
            <p className="pedido-barra__texto">
              <span className="pedido-barra__titulo">
                Tu pedido · {plural(cantidadTotal, 'producto', 'productos')}
              </span>
              {hayPrecio && (
                <span className="pedido-barra__total">
                  {formatoPrecio(total)}
                  {hayConsultar && <span className="pedido-barra__mas"> + a consultar</span>}
                </span>
              )}
            </p>
            <Link to="/pedido" className="pedido-barra__btn">
              Ver pedido
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default BarraPedido
