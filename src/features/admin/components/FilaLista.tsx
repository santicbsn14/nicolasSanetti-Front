import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, ImageOff } from 'lucide-react'
import Interruptor from './Interruptor'
import { miniatura } from '../lib/util'
import './Lista.css'

interface Props {
  a: string
  foto: string | null
  titulo: string
  detalle: ReactNode
  marca?: string
  visible: boolean
  onVisible: (v: boolean) => void
  ocupado: boolean
  flechas?: { subir: (() => void) | null; bajar: (() => void) | null; deshabilitadas: boolean }
}

/** Fila de las listas de productos y galería: foto, textos, interruptor y flechas de orden */
export default function FilaLista({ a, foto, titulo, detalle, marca, visible, onVisible, ocupado, flechas }: Props) {
  return (
    <li className={`adm-fila adm-tarjeta ${visible ? '' : 'adm-fila--oculta'}`}>
      <div className="adm-fila__arriba">
        <Link to={a} className="adm-fila__abrir">
          {foto ? (
            <img className="adm-fila__foto" src={miniatura(foto, 160)} alt="" loading="lazy" width={72} height={72} />
          ) : (
            <span className="adm-fila__foto adm-fila__foto--vacia" aria-hidden="true">
              <ImageOff size={24} />
            </span>
          )}
          <span className="adm-fila__textos">
            <span className="adm-fila__titulo">{titulo}</span>
            <span className="adm-fila__detalle">{detalle}</span>
            {marca && <span className="adm-fila__marca">{marca}</span>}
          </span>
        </Link>
        {flechas && (
          <div className="adm-fila__flechas">
            <button
              type="button"
              className="adm-fila__flecha"
              aria-label={`Subir «${titulo}»`}
              onClick={flechas.subir ?? undefined}
              disabled={!flechas.subir || flechas.deshabilitadas}
            >
              <ChevronUp size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="adm-fila__flecha"
              aria-label={`Bajar «${titulo}»`}
              onClick={flechas.bajar ?? undefined}
              disabled={!flechas.bajar || flechas.deshabilitadas}
            >
              <ChevronDown size={24} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <div className="adm-fila__abajo">
        <Interruptor compacto texto="Se ve en la web" activo={visible} onChange={onVisible} deshabilitado={ocupado} />
      </div>
    </li>
  )
}
