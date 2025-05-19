import type {FC} from 'react'
import {  useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: FC = () => {
  const location = useLocation();
  const [navStyle, setNavStyle] = useState("");
  
  // Esta función determina el estilo de la navbar según la ruta actual
  useEffect(() => {
    // Determinar el estilo basado en la ruta
    switch(location.pathname) {
      case '/':
        setNavStyle("navbar--home");
        break;
      case '/servicios':
        setNavStyle("navbar--servicios");
        break;
      case '/historia':
        setNavStyle("navbar--historia");
        break;
      case '/contacto':
        setNavStyle("navbar--contacto");
        break;
      case '/turnos':
        setNavStyle("navbar--turnos");
        break;
      default:
        setNavStyle("");
        break;
    }
  }, [location.pathname]);

  return (
    <header className={`navbar ${navStyle}`}>
      <div className="navbar__container">
        <h1 className="navbar__logo">NICOLAS SANETTI COIFFEUR</h1>

        <nav>
          <ul className="navbar__menu">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'navbar__link active' : 'navbar__link'
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/servicios"
                className={({ isActive }) =>
                  isActive ? 'navbar__link active' : 'navbar__link'
                }
              >
                SERVICIOS
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/historia"
                className={({ isActive }) =>
                  isActive ? 'navbar__link active' : 'navbar__link'
                }
              >
                HISTORIA
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contacto"
                className={({ isActive }) =>
                  isActive ? 'navbar__link active' : 'navbar__link'
                }
              >
                CONTACTO
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/turnos"
                target='_blank'
                rel='noopener noreferrer'
                className={({ isActive }) =>
                  isActive ? 'navbar__link active' : 'navbar__link'
                }
              >
                TURNOS
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

