import type {FC} from 'react'
import {  useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { buildWaLink, MENSAJE_TURNO } from '../../features/whatsapp/whatsapp';
import './Navbar.css';

const Navbar: FC = () => {
  const location = useLocation();
  const [navStyle, setNavStyle] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
  // Al scrollear, la navbar pasa a tener fondo blanco para que se lea sobre secciones oscuras
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
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
      default:
        setNavStyle("");
        break;
    }
  }, [location.pathname]);

  return (
    <header className={`navbar ${navStyle} ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <h1 className="navbar__logo">NICOLAS SANETTI COIFFEUR</h1>

        <nav>
          <ul className={`navbar__menu ${menuOpen ? 'open' : ''}`}>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link'}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/servicios" className={({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link'}>
                SERVICIOS
              </NavLink>
            </li>
            <li>
              <NavLink to="/historia" className={({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link'}>
                HISTORIA
              </NavLink>
            </li>
            <li>
              <NavLink to="/contacto" className={({ isActive }) => isActive ? 'navbar__link active' : 'navbar__link'}>
                CONTACTO
              </NavLink>
            </li>
            <li>
              <a
                href={buildWaLink(MENSAJE_TURNO)}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar__link"
                onClick={() => setMenuOpen(false)}
              >
                RESERVÁ TU TURNO
              </a>
            </li>
          </ul>
        </nav>
                <div className={`navbar__hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

