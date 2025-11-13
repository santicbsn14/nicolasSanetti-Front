import React from 'react';
import { Link } from 'react-router-dom';
import './Contacto.css';

const Contacto: React.FC = () => {
  return (
    <div className="contacto-container">
      <section className="contacto-content">
        <h1 className="contacto-title">Contacto</h1>

        <div className="contacto-info">
          <ul>
            <li><span>📍</span> Dirección: Colón 153, San Nicolas, Buenos Aires</li>
            <li><span>📞</span> Teléfono: (341) 123-4567</li>
            <li><span>🕒</span> Horario: Lunes a Viernes de 9 a 20 hs / Sábados de 9 a 15 hs</li>
            <li>
              <span>📱</span> Redes:
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a> /
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
            </li>
          </ul>
        </div>

        <p className="contacto-text">
          Si tenés alguna consulta o querés saber más sobre nuestros servicios, no dudes en escribirnos. Estamos para ayudarte.
        </p>
        <p className="contacto-text">
          Podés encontrarnos en nuestras redes sociales o completar el formulario. ¡Te responderemos lo antes posible!
        </p>
      </section>

      <section className="cta-turnos">
        <h2 className="cta-title">¿Querés reservar tu turno?</h2>
        <p className="cta-text">
          Agendá tu cita online de forma rápida y simple, y viví la experiencia Sanetti.
        </p>
        <Link to="/turnos" className="cta-link">
          Ir a turnos
        </Link>
      </section>
    </div>
  );
};

export default Contacto;
