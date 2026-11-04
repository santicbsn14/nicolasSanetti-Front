/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import './Avisos.css'

// Aviso abajo de la pantalla (éxito o error) y diálogo de confirmación. Propios, sin librerías.

type TipoAviso = 'ok' | 'error'
interface Aviso {
  id: number
  texto: string
  tipo: TipoAviso
}

interface Pregunta {
  texto: string
  confirmar: string
  peligro: boolean
}

interface Avisos {
  avisar: (texto: string, tipo?: TipoAviso) => void
  confirmar: (texto: string, opciones?: { confirmar?: string; peligro?: boolean }) => Promise<boolean>
}

const AvisosContext = createContext<Avisos | null>(null)

export function AvisosProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [pregunta, setPregunta] = useState<Pregunta | null>(null)
  const resolver = useRef<((si: boolean) => void) | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const avisar = useCallback((texto: string, tipo: TipoAviso = 'ok') => {
    window.clearTimeout(timer.current)
    setAviso({ id: Date.now(), texto, tipo })
    timer.current = window.setTimeout(() => setAviso(null), tipo === 'error' ? 7000 : 5000)
  }, [])

  const confirmar = useCallback<Avisos['confirmar']>((texto, opciones = {}) => {
    setPregunta({ texto, confirmar: opciones.confirmar ?? 'Sí', peligro: opciones.peligro ?? false })
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const responder = (si: boolean) => {
    resolver.current?.(si)
    resolver.current = null
    setPregunta(null)
  }

  return (
    <AvisosContext.Provider value={{ avisar, confirmar }}>
      {children}

      <div className="adm-avisos" aria-live="polite">
        {aviso && (
          <div key={aviso.id} className={`adm-aviso adm-aviso--${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
            <span>{aviso.texto}</span>
            <button type="button" className="adm-aviso__cerrar" onClick={() => setAviso(null)} aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        )}
      </div>

      {pregunta && (
        <div className="adm-dialogo__fondo" onClick={() => responder(false)}>
          <div
            className="adm-dialogo"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="adm-dialogo-texto"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="adm-dialogo-texto" className="adm-dialogo__texto">
              {pregunta.texto}
            </p>
            <div className="adm-dialogo__botones">
              <button
                type="button"
                className={`adm-boton adm-boton--ancho ${pregunta.peligro ? 'adm-boton--peligro-lleno' : ''}`}
                onClick={() => responder(true)}
              >
                {pregunta.confirmar}
              </button>
              <button
                type="button"
                className="adm-boton adm-boton--secundario adm-boton--ancho"
                onClick={() => responder(false)}
                autoFocus
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </AvisosContext.Provider>
  )
}

export function useAvisos(): Avisos {
  const ctx = useContext(AvisosContext)
  if (!ctx) throw new Error('useAvisos tiene que usarse dentro de AvisosProvider')
  return ctx
}
