import { useEffect, useState, type FC } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './NavbarTurnos.css';
import logo from '../../Imagenes/logoPortTurnos.png';
import { useAuth } from '../../Contexts/AuthContext';


const NavbarTurnos: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mongoUser } = useAuth()
  const isProfessional = location.pathname.startsWith('/turnos/professional');

  const isTurnoPath = [
    '/turnos/agendar-turno',
    '/turnos/profesional',
    '/turnos/datos',
  ].includes(location.pathname);

  const handleExit = () => {
    navigate('/turnos');
  };
  // En tu componente, agrega este estado al inicio
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Función para alternar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/turnos/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(errorMessage)
    }
  };

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // 1) Verificamos que target NO sea null y sea un Element
    if (event.target instanceof Element) {
      // 2) Ahora sí podemos usar closest()
      if (!event.target.closest('.navbar__user')) {
        setIsDropdownOpen(false);
      }
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);

  const getInitials = (firstname?: string, lastname?: string): string => {
    const first = firstname?.trim().charAt(0).toUpperCase() || '';
    const last = lastname?.trim().charAt(0).toUpperCase() || '';
    return `${first}${last}`;
  };

  if (isProfessional) {
    // Navbar para profesional con sesión iniciada
    return (
      <header className="navbar-turnos">
        <div className="navbar-turnos__logo-section">
          <h1 className="navbar-turnos__titulo">NICOLAS SANETTI COIFFEUR</h1>
        </div>

        <div className="navbar__user">
          <div
            className="navbar__avatar initials"
            onClick={toggleDropdown}
            style={{ cursor: 'pointer' }}
          >
            {getInitials(mongoUser?.firstname, mongoUser?.lastname)}
          </div>

          <span
            className="navbar__username"
            onClick={toggleDropdown}
            style={{ cursor: 'pointer' }}
          >
            {mongoUser?.firstname} {mongoUser?.lastname}
          </span>

{isDropdownOpen && (
  <div className="navbar__dropdown">
    <button onClick={handleLogout}>Cerrar sesión</button>

    {mongoUser?.role?.name === 'Admin' && (
      <>
        <button
          onClick={() => {
            navigate('/turnos/professional/crearUsuario');
            setIsDropdownOpen(false);
          }}
        >
          Crear Usuario
        </button>

        <button
          onClick={() => {
            navigate('/turnos/professional/crearPeluquero');
            setIsDropdownOpen(false);
          }}
        >
          Crear peluquero
        </button>
      </>
    )}
  </div>
)}

        </div>
      </header>
    );
  }

  // Navbar para el resto de las rutas de turnos
  return (
    <header className="navbar-turnos">
      {isTurnoPath ? (
        <div className="navbar-turnos__logo-section">
          <img src={logo} alt="Logo" className="navbar-turnos__logo" />
          <h1 className="navbar-turnos__titulo">NICOLAS SANETTI COIFFEUR</h1>
        </div>
      ) : (
        <h1 className="navbar-turnos__titulo">NICOLAS SANETTI COIFFEUR</h1>
      )}

      {isTurnoPath ? (
        <button className="navbar-turnos__close" onClick={handleExit} aria-label="Cerrar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#aaa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (
        <NavLink to="/turnos/login">
          <button className="navbar-turnos__login">INICIAR SESIÓN</button>
        </NavLink>
      )}

    </header>
  );
};

export default NavbarTurnos;
