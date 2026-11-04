import { useRef } from 'react'
import { Camera } from 'lucide-react'
import type { Foto } from '../lib/useFotos'
import { miniatura } from '../lib/util'
import './GrillaFotos.css'

interface Props {
  fotos: Foto[]
  maximo: number
  onAgregar: (archivos: File[]) => void
  onQuitar: (clave: string) => void
  onPonerPrimera: (clave: string) => void
}

export default function GrillaFotos({ fotos, maximo, onAgregar, onQuitar, onPonerPrimera }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const lleno = fotos.length >= maximo

  return (
    <div className="adm-fotos">
      {fotos.length > 0 && (
        <ul className="adm-fotos__grilla">
          {fotos.map((f, i) => (
            <li key={f.clave} className={`adm-fotos__item ${i === 0 ? 'adm-fotos__item--primera' : ''}`}>
              <div className="adm-fotos__marco">
                <img src={f.url.startsWith('blob:') ? f.url : miniatura(f.url, 400)} alt={`Foto ${i + 1}`} />
                {i === 0 && <span className="adm-fotos__etiqueta">Primera</span>}
                {f.subiendo && (
                  <span className="adm-fotos__subiendo" role="status">
                    <span className="adm-ruedita adm-ruedita--chica" aria-hidden="true" />
                    Subiendo…
                  </span>
                )}
              </div>
              {!f.subiendo && (
                <div className="adm-fotos__acciones">
                  {i > 0 && (
                    <button type="button" className="adm-fotos__accion" onClick={() => onPonerPrimera(f.clave)}>
                      Poner primera
                    </button>
                  )}
                  <button type="button" className="adm-fotos__accion adm-fotos__accion--quitar" onClick={() => onQuitar(f.clave)}>
                    Quitar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        id="adm-fotos-input"
        type="file"
        accept="image/*"
        multiple
        className="adm-sr"
        tabIndex={-1}
        onChange={(e) => {
          const archivos = Array.from(e.target.files ?? [])
          e.target.value = ''
          if (archivos.length) onAgregar(archivos)
        }}
      />
      <button
        type="button"
        className="adm-boton adm-boton--secundario adm-boton--ancho"
        onClick={() => input.current?.click()}
        disabled={lleno}
      >
        <Camera size={22} aria-hidden="true" />
        {lleno ? `Ya cargaste ${maximo} fotos` : fotos.length ? 'Agregar más fotos' : 'Agregar fotos'}
      </button>
    </div>
  )
}
