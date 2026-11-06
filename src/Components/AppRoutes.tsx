import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Home from './Home/Home'
import Historia from './HIstoria/Historia'
import Services from './Services/Services'
import Contacto from './Contacto/Contacto'
import WhatsAppFloat from '../features/whatsapp/WhatsAppFloat'

// Panel de Nico: chunk aparte (incluye Firebase), solo se pide al entrar a /admin
const AdminApp = lazy(() => import('../features/admin/AdminApp'))
// Galería: chunk aparte (incluye @sanity/client), solo se pide al entrar a /galeria
const Galeria = lazy(() => import('./Galeria/Galeria'))

// El sistema de turnos online se ocultó (ver tag v1-con-turnos): los componentes
// siguen en System-Turnos/ y Contexts/ pero no se rutean. La reserva es por WhatsApp.
function AppRoutes() {
  const { pathname } = useLocation()
  const esAdmin = pathname === '/admin' || pathname.startsWith('/admin/')

  return (
    <>
      {!esAdmin && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/servicios' element={<Services />} />
        <Route
          path='/galeria'
          element={
            // Mientras llega el chunk: un bloque blanco del alto de la pantalla (el footer no salta)
            <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }} />}>
              <Galeria />
            </Suspense>
          }
        />
        <Route path='/historia' element={<Historia />} />
        <Route path='/contacto' element={<Contacto />} />
        <Route path="/turnos/*" element={<Navigate to="/" replace />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<p style={{ padding: 32, textAlign: 'center', color: '#131313' }}>Cargando panel…</p>}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
      {!esAdmin && <Footer />}
      {!esAdmin && <WhatsAppFloat />}
    </>
  )
}

export default AppRoutes
