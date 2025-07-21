import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Turnos from './System-Turnos/Pages/Turnos'
import Home from './Home/Home'
import Historia from './HIstoria/Historia'
import Services from './Services/Services'
import NavbarTurnos from './System-Turnos/Layout/NavbarTurnos'
import Contacto from './Contacto/Contacto'
import AgendarTurno from './System-Turnos/Pages/AgendarTurno'
import DatosContacto from './System-Turnos/Layout/DatosContacto'
import SeleccionarProfesional from './System-Turnos/Layout/SeleccionarProfesional'
import { TurnoProvider } from './Contexts/TurnoContext'
import LoginProfesional from './System-Turnos/Pages/LoginProfessional'
import Dashboard from './System-Turnos/Pages/Dashboard'
import LayoutProfesional from './System-Turnos/Layout/Layout'
import MisHorarios from './System-Turnos/Pages/MisHorarios'
import GestionServicios from './System-Turnos/Pages/MisServicios'
import MisTurnos from './System-Turnos/Pages/MisTurnos'
import NotificationTemplatesConfig from './System-Turnos/Pages/Notifiaciones'
import CreateHairdresserForm from './System-Turnos/Creates/CrearPeluquero'
import CreateUserForm from './System-Turnos/Creates/CrearUsuario'
import { AuthProvider } from './Contexts/AuthContext'
import ProtectedRoute from './Contexts/ProtectedRoute'
import TurnoConfirmado from './System-Turnos/Pages/TurnoConfirmado'

function AppRoutes() {
  const location = useLocation()

  const isTurnosPage =  location.pathname.startsWith('/turnos');

  return (
    <>
        <TurnoProvider>
        <AuthProvider >
      {isTurnosPage ? <NavbarTurnos /> : <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/servicios' element={<Services />} />
        <Route path='/historia' element={<Historia />} />
        <Route path='/contacto' element={<Contacto />} />
        <Route path='/turnos' element={<Turnos />} />
        <Route path='/turnos/agendar-turno' element={<AgendarTurno />} />
        <Route path="/turnos/profesional" element={<SeleccionarProfesional />} />
        <Route path="/turnos/datos" element={<DatosContacto />} />
        <Route path="/turnos/confirmado" element={<TurnoConfirmado />} />
        <Route path="/turnos/login" element={<LoginProfesional />} />
        <Route element={<ProtectedRoute/>}>
        <Route path="/turnos/professional" element={<LayoutProfesional />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path='horarios' element={<MisHorarios/>}/>
        <Route path='turnos' element={<MisTurnos/>}/>
        <Route path='servicios' element={<GestionServicios/>}/>
        <Route path='notificaciones' element={<NotificationTemplatesConfig/>}/>
        <Route path='crearPeluquero' element={<CreateHairdresserForm/>}/>
        <Route path='crearUsuario' element={<CreateUserForm/>}/>
        </Route>
        </Route>
      </Routes>
      </AuthProvider>
      </TurnoProvider>
      <Footer />
    </>
  )
}

export default AppRoutes
