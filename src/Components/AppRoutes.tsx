import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Home from './Home/Home'
import Historia from './HIstoria/Historia'
import Services from './Services/Services'
import Contacto from './Contacto/Contacto'
import WhatsAppFloat from '../features/whatsapp/WhatsAppFloat'

// El sistema de turnos online se ocultó (ver tag v1-con-turnos): los componentes
// siguen en System-Turnos/ y Contexts/ pero no se rutean. La reserva es por WhatsApp.
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/servicios' element={<Services />} />
        <Route path='/historia' element={<Historia />} />
        <Route path='/contacto' element={<Contacto />} />
        <Route path="/turnos/*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

export default AppRoutes
