import { CANTIDAD_MAX, CANTIDAD_MIN } from '../../features/pedido/items'
import './Cantidad.css'

interface Props {
  valor: number
  onCambiar: (n: number) => void
  // Para los lectores de pantalla: «Cantidad de Shampoo (500 ml)»
  etiqueta: string
  chico?: boolean
  deshabilitado?: boolean
}

// − / + de 48 px (40 px en la lista del pedido en celular)
function Cantidad({ valor, onCambiar, etiqueta, chico, deshabilitado }: Props) {
  return (
    <div className={`cantidad${chico ? ' cantidad--chica' : ''}`} role="group" aria-label={etiqueta}>
      <button
        type="button"
        className="cantidad__btn"
        aria-label="Restar uno"
        disabled={deshabilitado || valor <= CANTIDAD_MIN}
        onClick={() => onCambiar(valor - 1)}
      >
        −
      </button>
      <output className="cantidad__valor" aria-live="polite">
        {valor}
      </output>
      <button
        type="button"
        className="cantidad__btn"
        aria-label="Sumar uno"
        disabled={deshabilitado || valor >= CANTIDAD_MAX}
        onClick={() => onCambiar(valor + 1)}
      >
        +
      </button>
    </div>
  )
}

export default Cantidad
