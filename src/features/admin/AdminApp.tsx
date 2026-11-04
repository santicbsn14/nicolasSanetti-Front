// Panel /admin. Se carga lazy desde AppRoutes: ni Firebase ni nada de esta carpeta entra en el bundle de la web pública.
import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from './auth/AdminAuthContext'
import RequireAdmin from './auth/RequireAdmin'
import { AvisosProvider } from './components/Avisos'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import ProductoForm from './pages/ProductoForm'
import Galeria from './pages/Galeria'
import TrabajoForm from './pages/TrabajoForm'
import './admin.css'

const protegida = (pagina: ReactNode) => <RequireAdmin>{pagina}</RequireAdmin>

export default function AdminApp() {
  useEffect(() => {
    const tituloAnterior = document.title
    document.title = 'Panel · Nicolás Sanetti Coiffeur'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => {
      document.title = tituloAnterior
      robots.remove()
    }
  }, [])

  return (
    <div className="adm">
      <AdminAuthProvider>
        <AvisosProvider>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route index element={protegida(<Inicio />)} />
            <Route path="productos" element={protegida(<Productos />)} />
            <Route path="productos/nuevo" element={protegida(<ProductoForm />)} />
            <Route path="productos/:id" element={protegida(<ProductoForm />)} />
            <Route path="galeria" element={protegida(<Galeria />)} />
            <Route path="galeria/nueva" element={protegida(<TrabajoForm />)} />
            <Route path="galeria/:id" element={protegida(<TrabajoForm />)} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AvisosProvider>
      </AdminAuthProvider>
    </div>
  )
}
