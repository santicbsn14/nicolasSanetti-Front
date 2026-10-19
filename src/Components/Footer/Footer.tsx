import type { FC } from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { NavLink } from 'react-router-dom';
import { buildWaLink, MENSAJE_TURNO } from '../../features/whatsapp/whatsapp';

const Footer: FC = () => {
  return (
    <section className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>NICOLAS SANETTI COIFFEUR</h2>
        </div>

        <div className="footer-column">
          <h3>Menú</h3>
          <ul>
            <li><NavLink to="/" className="footer-link">Home</NavLink></li>
            <li><NavLink to="/servicios" className="footer-link">Servicios</NavLink></li>
            <li><NavLink to="/historia" className="footer-link">Historia</NavLink></li>
            <li>
              <a
                href={buildWaLink(MENSAJE_TURNO)}
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Reservá tu turno
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>
          <ul>
            <li>
              <a
                href={buildWaLink(MENSAJE_TURNO)}
                className="footer-contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                +54 9 336 461-4298
              </a>
            </li>
            <li>
              <a
                href="https://maps.app.goo.gl/F4AXqCMSaPpFeBdz9"
                style={{ color: 'white' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Colón 153, B2900 San Nicolás de Los Arroyos, Provincia de Buenos Aires
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Seguime</h3>
          <div className="footer-social">
            <a
              href="https://www.facebook.com/NicolasSanettiCoiffeur"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Nicolás Sanetti Coiffeur"
            >
              <FontAwesomeIcon className="i" icon={faFacebook} />
            </a>
            <a
              href="https://www.instagram.com/nicolassanetticoiffeur/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Nicolás Sanetti Coiffeur"
            >
              <FontAwesomeIcon className="i" icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
