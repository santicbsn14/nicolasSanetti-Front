import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Turnos from './System-Turnos/Pages/Turnos'
import Home from './Home/Home'
import Historia from './HIstoria/Historia'
import Services from './Services/Services'
import NavbarTurnos from './System-Turnos/Layout/NavbarTurnos'

function AppRoutes() {
  const location = useLocation()

  const isTurnosPage = location.pathname !== '/turnos'

  return (
    <>
      {!isTurnosPage ? <NavbarTurnos /> : <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/servicios' element={<Services />} />
        <Route path='/historia' element={<Historia />} />
        <Route path='/turnos' element={<Turnos />} />
      </Routes>
      <Footer />
    </>
  )
}

export default AppRoutes
