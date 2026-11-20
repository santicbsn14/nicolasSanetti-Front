import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '../lib/firebase'

export type EstadoSesion = 'cargando' | 'sin-sesion' | 'sin-permiso' | 'admin'

interface Sesion {
  estado: EstadoSesion
  usuario: User | null
  salir: () => Promise<void>
}

const AdminAuthContext = createContext<Sesion | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoSesion>('cargando')
  const [usuario, setUsuario] = useState<User | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUsuario(null)
        setEstado('sin-sesion')
        return
      }
      setEstado('cargando')
      try {
        const token = await u.getIdTokenResult()
        setUsuario(u)
        setEstado(token.claims.admin === true ? 'admin' : 'sin-permiso')
      } catch {
        setUsuario(null)
        setEstado('sin-sesion')
      }
    })
  }, [])

  const salir = () => signOut(auth)

  return <AdminAuthContext.Provider value={{ estado, usuario, salir }}>{children}</AdminAuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSesion(): Sesion {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useSesion tiene que usarse dentro de AdminAuthProvider')
  return ctx
}
