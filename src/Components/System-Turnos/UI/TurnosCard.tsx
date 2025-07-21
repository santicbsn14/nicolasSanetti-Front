// components/Turnos/ServicioCard.tsx
import {type  FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTurno } from '../../Contexts/TurnoContext';

interface ServicioCardProps {
  _id: string;
  titulo: string;
  descripcion: string;
  precio: number; // cambiamos a number como corresponde
  duracion: number;
}


const ServicioCard: FC<ServicioCardProps> = ({
  _id,
  titulo,
  descripcion,
  precio,
  duracion,
}) => {
  const navigate = useNavigate();
  const { setTurno } = useTurno();

  const handleAgendar = () => {
    // 1️⃣ Guardar el servicio seleccionado en el contexto
setTurno((prev) => ({
  ...prev,
  service: {
    _id,                 // ✅ incluimos el ID
    title: titulo,
    price: precio,
    duration: duracion
  }
}));

    // 2️⃣ Navegar al paso de fecha/hora
    navigate('/turnos/agendar-turno');
  };

  return (
    <div className="card-servicio">
      <h3 className="card-servicio__titulo">{titulo}</h3>
      <p className="card-servicio__descripcion">{descripcion}</p>

      <div className="card-servicio__footer">
        <span className="card-servicio__precio">
          <small>DESDE</small> ${precio}
        </span>

        {/* Ya no usamos <Link>; así nos aseguramos de setear el contexto primero */}
        <button className="card-servicio__boton" onClick={handleAgendar}>
          Agendar servicio
        </button>
      </div>
    </div>
  );
};

export default ServicioCard;
