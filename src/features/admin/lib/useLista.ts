import { useCallback, useEffect, useRef, useState } from 'react'
import { mensaje } from './api'
import { mover } from './util'

interface Item {
  _id: string
  activo?: boolean | null
}

/** Carga una lista del back, con "Se ve en la web" al toque y reordenar con flechas */
export function useLista<T extends Item>(
  listar: () => Promise<T[]>,
  cambiarVisible: (id: string, activo: boolean) => Promise<unknown>,
  reordenar: (ids: string[]) => Promise<T[]>,
  avisar: (texto: string, tipo?: 'ok' | 'error') => void,
) {
  const [items, setItems] = useState<T[] | null>(null)
  const [error, setError] = useState('')
  const [ocupados, setOcupados] = useState<Set<string>>(new Set())
  const [reordenando, setReordenando] = useState(false)

  // Solo vale la respuesta del último pedido: una carga vieja que llega tarde no pisa cambios hechos después
  const ultimoPedido = useRef(0)
  const cargar = useCallback(async () => {
    const pedido = ++ultimoPedido.current
    setError('')
    setItems(null)
    try {
      const lista = await listar()
      if (pedido === ultimoPedido.current) setItems(lista)
    } catch (e) {
      if (pedido === ultimoPedido.current) setError(mensaje(e))
    }
  }, [listar])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const marcar = (id: string, si: boolean) =>
    setOcupados((prev) => {
      const s = new Set(prev)
      if (si) s.add(id)
      else s.delete(id)
      return s
    })

  const visible = async (id: string, activo: boolean) => {
    setItems((prev) => prev?.map((it) => (it._id === id ? { ...it, activo } : it)) ?? prev)
    marcar(id, true)
    try {
      await cambiarVisible(id, activo)
      avisar(activo ? 'Listo, ahora se ve en la web' : 'Listo, ya no se ve en la web')
    } catch (e) {
      setItems((prev) => prev?.map((it) => (it._id === id ? { ...it, activo: !activo } : it)) ?? prev)
      avisar(mensaje(e), 'error')
    } finally {
      marcar(id, false)
    }
  }

  const moverItem = async (i: number, delta: -1 | 1) => {
    if (!items) return
    const anterior = items
    const nueva = mover(items, i, delta)
    setItems(nueva)
    setReordenando(true)
    try {
      setItems(await reordenar(nueva.map((it) => it._id)))
    } catch (e) {
      setItems(anterior)
      avisar(mensaje(e), 'error')
    } finally {
      setReordenando(false)
    }
  }

  return { items, error, cargar, ocupados, visible, moverItem, reordenando }
}
