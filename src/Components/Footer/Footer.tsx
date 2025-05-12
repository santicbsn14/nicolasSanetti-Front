import type {FC} from 'react'
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFacebook, faInstagram} from  '@fortawesome/free-brands-svg-icons'
const Footer : FC = () =>{
    return(
        <section className="footer">
  <div className="footer-container">
    <div className="footer-brand">
      <h2>NICOLAS SANETTI COIFFEUR</h2>
      <p>
        Experiencia en corte de cabellos de los mejor que vas a poder encontrar en San Nicolás
      </p>
    </div>
    <div className="footer-column">
      <h3>Menú</h3>
      <ul>
        <li>Home</li>
        <li>Servicios</li>
        <li>Historia</li>
        <li>Turnos</li>
      </ul>
    </div>
    <div className="footer-column">
      <h3>Contacto</h3>
      <ul>
        <li>+54 9 336 430-8505</li>
        <li> <a href="https://maps.app.goo.gl/F4AXqCMSaPpFeBdz9" style={{color:'white'}} target="_blank" rel="noopener noreferrer">Colón 153, B2900 San Nicolás de Los Arroyos, Provincia de Buenos Aires</a></li>
      </ul>
    </div>
    <div className="footer-column">
      <h3>Seguime</h3>
      <div className="footer-social">
        <FontAwesomeIcon className='i' icon={faFacebook} />
        <FontAwesomeIcon className='i' icon={faInstagram} />
      </div>
    </div>
  </div>
</section>

    )
}
export default Footer