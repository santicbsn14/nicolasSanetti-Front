import { useTurno } from "../../Contexts/TurnoContext";
import '../Css/TurnoResumen.css';

const TurnoResumen = () => {
  const { turno } = useTurno();

  return (
    <div className="turno-resumen-box">
      <h4 className="turno-resumen-titulo">Información de tus servicios</h4>
      <hr className="turno-resumen-separador" />
      <div className="turno-resumen-detalles">
        {turno.service && (
          <div>
            <strong>Servicio:</strong> {turno.service.title}
          </div>
        )}
        {turno.selectedDate && (
          <div>
            <strong>Fecha:</strong> {turno.selectedDate}
          </div>
        )}
        {turno.selectedTime && (
          <div>
            <strong>Hora:</strong> {turno.selectedTime}
          </div>
        )}
        {turno.selectedProfessional && (
  <div>
    <strong>Profesional:</strong> {turno.selectedProfessional.name}
  </div>
)}
      </div>
    </div>
  );
};

export default TurnoResumen;
