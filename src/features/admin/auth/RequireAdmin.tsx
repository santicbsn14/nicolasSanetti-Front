import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSesion } from './AdminAuthContext'
import Cargando from '../components/Cargando'
import SinPermiso from '../pages/SinPermiso'

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { estado } = useSesion()
  const location = useLocation()

  if (estado === 'cargando') return <Cargando pantallaCompleta />
  if (estado === 'sin-sesion') return <Navigate to="/admin/login" replace state={{ desde: location.pathname }} />
  if (estado === 'sin-permiso') return <SinPermiso />
  return <>{children}</>
}
