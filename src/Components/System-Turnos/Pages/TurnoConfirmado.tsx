import { useTurno } from "../../Contexts/TurnoContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/TurnoConfirmado.css"; // Estilo separado

const TurnoConfirmado = () => {
  const { turno } = useTurno();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir si alguien entra directo
    if (!turno.service || !turno.selectedDate || !turno.selectedTime) {
      navigate("/");
    }
  }, [turno, navigate]);

  const fecha = new Date(turno.selectedDate || "");
  const diaSemana = fecha.toLocaleDateString("es-AR", { weekday: "long" });
  const dia = fecha.getDate();
  const mes = fecha.toLocaleDateString("es-AR", { month: "long" });

  return (
    <div className="turno-confirmado-wrapper">
      <h2>✔️</h2>
      <h3>
        ¡Gracias {turno.contactData?.name} por agendar en NICOLAS SANETTI COIFFEUR ✨!
      </h3>

      <div className="turno-info-box">
        <div>
          <strong>📋 Servicio</strong>
          <p>{turno.service?.title}</p>
        </div>
        <div>
          <strong>📅 Fecha y hora</strong>
          <p>{`${capitalizar(diaSemana)} ${dia} ${capitalizar(mes)} - ${turno.selectedTime}`}</p>
        </div>
        <div>
          <strong>⏱ Duración</strong>
          <p>{turno.service?.duration} Minutos</p>
        </div>
        <div>
          <strong>📍 Ubicación</strong>
          <p>
            NICOLAS SANETTI COIFFEUR ✨, Colon 153, San Nicolas de los Arroyos, Buenos Aires, Argentina
          </p>
        </div>
        <div>
          <strong>💲 Precio</strong>
          <p>${turno.service?.price?.toLocaleString("es-AR")}</p>
        </div>
      </div>
    </div>
  );
};

const capitalizar = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default TurnoConfirmado;
