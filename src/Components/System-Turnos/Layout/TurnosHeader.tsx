// components/TurnosHeader.tsx
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
  <div className="turnos-header__line">
    <span className="emoji">🔥</span>
    <p>¿List@ para un cambio de look espectacular?</p>
  </div>
  <div className="turnos-header__line">
    <span className="emoji">🕐</span>
    <p>
      Horario: Lunes a Viernes de 9 a 20 hs. <br />
      Sábados de 9 a 15 hs
    </p>
  </div>
  <div className="turnos-header__line">
    <span className="emoji">📣</span>
    <p>¡Reservá tu turno y transformá tu cabello!</p>
  </div>
</div>

      </div>
    </section>
  );
};

export default TurnosHeader;
