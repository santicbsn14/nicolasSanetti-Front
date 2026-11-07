import { useState } from 'react'

export interface Aviso {
  id: number // cambia en cada «Agregar», así el aviso se reinicia aunque sea el mismo producto
  nombre: string
}

// Aviso «Agregado: …» del listado y el detalle (lo muestra BarraPedido)
export function useAviso() {
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const avisar = (nombre: string) => setAviso((a) => ({ id: (a?.id ?? 0) + 1, nombre }))
  return [aviso, avisar] as const
}
