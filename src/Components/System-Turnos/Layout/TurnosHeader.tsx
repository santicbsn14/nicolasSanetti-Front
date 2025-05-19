// components/TurnosHeader.tsx
import React from 'react';
import Logo  from '../../Imagenes/logoPortTurnos.png'
import '../turnos.css';

const TurnosHeader = () => {
  return (
    <section className="turnos-header">
      <div className="turnos-header__content">
        <img
          src={Logo} // Reemplazá con la ruta correcta si cambia
          alt="Logo Nicolas Sanetti"
          className="turnos-header__logo"
        />
        <div className="turnos-header__text">
          <p className="turnos-header__line">🔥 ¿List@ para un cambio de look espectacular?</p>
          <p className="turnos-header__line">
            🕐 Horario: Lunes a Viernes de 9 a 20 hs. <br />
            Sábados de 9 a 15 hs
          </p>
          <p className="turnos-header__line">📣 ¡Reservá tu turno y transformá tu cabello!</p>
        </div>
      </div>
    </section>
  );
};

export default TurnosHeader;
