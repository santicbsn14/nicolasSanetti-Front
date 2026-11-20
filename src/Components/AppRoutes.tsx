import { lazy, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Home from './Home/Home'
import Historia from './HIstoria/Historia'
import Services from './Services/Services'
import Contacto from './Contacto/Contacto'
import WhatsAppFloat from '../features/whatsapp/WhatsAppFloat'
import CargaPagina from './CargaPagina'
import { precargarEnSegundoPlano } from '../Utils/precarga'

// Panel de Nico: chunk aparte (incluye Firebase), solo se pide al entrar a /admin
const AdminApp = lazy(() => import('../features/admin/AdminApp'))
// Galería: chunk aparte (incluye @sanity/client), solo se pide al entrar a /galeria
const cargarGaleria = () => import('./Galeria/Galeria')
const Galeria = lazy(cargarGaleria)
// Catálogo y pedido: chunks aparte (comparten @sanity/client con la galería)
const cargarProductos = () => import('./Productos/Productos')
const cargarProductoDetalle = () => import('./Productos/ProductoDetalle')
const cargarPedido = () => import('./Productos/Pedido')
const Productos = lazy(cargarProductos)
const ProductoDetalle = lazy(cargarProductoDetalle)
const Pedido = lazy(cargarPedido)

// Mientras llega el chunk: un bloque blanco del alto de la pantalla (el footer no salta)
const cargandoPagina = <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }} />

// El sistema de turnos online se ocultó (ver tag v1-con-turnos): los componentes
// siguen en System-Turnos/ y Contexts/ pero no se rutean. La reserva es por WhatsApp.
function AppRoutes() {
  const { pathname } = useLocation()
  const esAdmin = pathname === '/admin' || pathname.startsWith('/admin/')

  // Con la web ya cargada, se pide en segundo plano el código de las páginas públicas
  // que van aparte, así al tocar el link aparecen enseguida. El panel no se precarga,
  // y si se entra directo al panel tampoco se precargan las públicas.
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return
    precargarEnSegundoPlano([cargarGaleria, cargarProductos, cargarProductoDetalle, cargarPedido])
  }, [])

  return (
    <>
      {!esAdmin && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/servicios' element={<Services />} />
        <Route
          path='/galeria'
          element={
            <CargaPagina fallback={cargandoPagina}>
              <Galeria />
            </CargaPagina>
          }
        />
        <Route
          path='/productos'
          element={
            <CargaPagina fallback={cargandoPagina}>
              <Productos />
            </CargaPagina>
          }
        />
        <Route
          path='/productos/:slug'
          element={
            <CargaPagina fallback={cargandoPagina}>
              <ProductoDetalle />
            </CargaPagina>
          }
        />
        <Route
          path='/pedido'
          element={
            <CargaPagina fallback={cargandoPagina}>
              <Pedido />
            </CargaPagina>
          }
        />
        <Route path='/quienes-somos' element={<Historia />} />
        <Route path='/historia' element={<Navigate to="/quienes-somos" replace />} />
        <Route path='/contacto' element={<Contacto />} />
        <Route path="/turnos/*" element={<Navigate to="/" replace />} />
        <Route
          path="/admin/*"
          element={
            <CargaPagina fallback={<p style={{ padding: 32, textAlign: 'center', color: '#131313' }}>Cargando panel…</p>}>
              <AdminApp />
            </CargaPagina>
          }
        />
      </Routes>
      {!esAdmin && <Footer />}
      {!esAdmin && <WhatsAppFloat />}
    </>
  )
}

export default AppRoutes
