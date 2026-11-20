import type {FC} from 'react'
import {  useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { buildWaLink, MENSAJE_TURNO } from '../../features/whatsapp/whatsapp';
import { useCarrito } from '../../features/pedido/carrito';
import './Navbar.css';

const claseLink = ({ isActive }: { isActive: boolean }) => (isActive ? 'navbar__link active' : 'navbar__link');

const Navbar: FC = () => {
  const location = useLocation();
  const [navStyle, setNavStyle] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
  // Al scrollear, la navbar pasa a tener fondo blanco para que se lea sobre secciones oscuras
  const [scrolled, setScrolled] = useState(false);
  const { cantidadTotal } = useCarrito();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  const cerrarMenu = () => setMenuOpen(false);
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
      case '/quienes-somos':
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
        <h1 className="navbar__logo">
          <Link to="/" className="navbar__logo-link" onClick={cerrarMenu}>
            NICOLAS SANETTI COIFFEUR
          </Link>
        </h1>

        <nav aria-label="Principal">
          <ul id="navbar-menu" className={`navbar__menu ${menuOpen ? 'open' : ''}`}>
            {/* En escritorio el logo lleva al inicio: HOME queda solo en el menú del celular */}
            <li className="navbar__item--solo-menu">
              <NavLink to="/" end onClick={cerrarMenu} className={claseLink}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/servicios" onClick={cerrarMenu} className={claseLink}>
                SERVICIOS
              </NavLink>
            </li>
            <li>
              <NavLink to="/galeria" onClick={cerrarMenu} className={claseLink}>
                GALERÍA
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos" onClick={cerrarMenu} className={claseLink}>
                PRODUCTOS
              </NavLink>
            </li>
            <li>
              <NavLink to="/quienes-somos" onClick={cerrarMenu} className={claseLink}>
                NOSOTROS
              </NavLink>
            </li>
            <li>
              <NavLink to="/contacto" onClick={cerrarMenu} className={claseLink}>
                CONTACTO
              </NavLink>
            </li>
            <li>
              <a
                href={buildWaLink(MENSAJE_TURNO)}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar__link"
                onClick={cerrarMenu}
              >
                RESERVÁ TU TURNO
              </a>
            </li>
          </ul>
        </nav>

        <div className="navbar__acciones">
          {cantidadTotal > 0 && (
            <NavLink
              to="/pedido"
              className={({ isActive }) => `navbar__pedido${isActive ? ' navbar__pedido--activo' : ''}`}
              aria-label={`Ver tu pedido, ${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'}`}
              onClick={cerrarMenu}
            >
              <ShoppingBag size={24} strokeWidth={1.75} aria-hidden="true" />
              <span className="navbar__pedido-cantidad" aria-hidden="true">
                {cantidadTotal > 99 ? '99+' : cantidadTotal}
              </span>
            </NavLink>
          )}
          <button
            type="button"
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="navbar-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
