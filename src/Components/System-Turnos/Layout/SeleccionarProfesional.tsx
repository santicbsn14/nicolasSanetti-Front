import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Css/AgendarTurno.css";
import TurnoResumen from "../UI/TurnoResumen";
import { useTurno } from "../../Contexts/TurnoContext";
import { getHairdressers, type Hairdresser } from "../../../Services-Api/Hairdresser";
import type { IUser } from "../../../Services-Api/Users";

interface ProfessionalData {
  id: string;
  name: string;
  rating?: number;
  isAuto: boolean;
}

const SeleccionarProfesional: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { turno, setTurno } = useTurno();
  const appointmentData = location.state || {};

  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para generar iniciales
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // Función para generar color de fondo basado en el nombre
  const getAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
      "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
    ];
    return colors[name.length % colors.length];
  };

 const transformHairdresser = (hairdresser: Hairdresser): ProfessionalData => {
    const user = hairdresser.user_id as IUser;
    return {
      id: hairdresser._id ?? "",
      name: `${user.firstname} ${user.lastname}`,
      isAuto: false,
    };
  };

  const fetchHairdressers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data: Hairdresser[] = await getHairdressers();
      const available = data.filter(h => h.state === "Disponible");
      const list = available.map(transformHairdresser);
      setProfessionals(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los profesionales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHairdressers();
  }, []);

  const handleBack = () => navigate("/turnos/agendar-turno");

  const handleNext = () => {
    if (!selectedProfessional) return;

    const pro = professionals.find(p => p.id === selectedProfessional);
    
    setTurno({
      ...turno,
      selectedProfessional:pro,
    });
    navigate("/turnos/datos");
  };

  if (loading) return <div>Cargando profesionales…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="agendar-wrapper">
      <div className="agendar-box">
        <div className="agendar-header">
          <strong>Selecciona el/los profesionales para tus servicios</strong>
        </div>

        <hr className="agendar-divider" />

        <div className="agendar-steps-row">
          <div className="step completed-step">
            <span className="step-number">✓</span> Fecha y hora
          </div>
          <div className="step active-step">
            <span className="step-number">2</span> Profesional
          </div>
          <div className="step">
            <span className="step-number">3</span> Datos de contacto
          </div>
        </div>

        <hr className="agendar-divider" />

        <div className="professionals-list">
          {professionals.map(pro => (
            <div
              key={pro.id}
              className={`professional-item ${selectedProfessional === pro.id ? "selected" : ""}`}
              onClick={() => setSelectedProfessional(pro.id)}
            >
              <div className="professional-avatar">
                {pro.isAuto ? (
                  <div className="auto-avatar">
                    <span className="user-icon">👤</span>
                  </div>
                ) : (
                  <div
                    className="name-avatar"
                    style={{ backgroundColor: getAvatarColor(pro.name) }}
                  >
                    {getInitials(pro.name)}
                  </div>
                )}
              </div>

              <div className="professional-info">
                <div className="professional-name">
                  {pro.name}
                  {pro.rating && (
                    <span className="rating">⭐ {pro.rating}</span>
                  )}
                </div>
                {appointmentData.date && (
                  <div className="professional-date">{appointmentData.date}</div>
                )}
              </div>

              <div className="selection-indicator">
                {selectedProfessional === pro.id && (
                  <span className="checkmark">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button className="back-button" onClick={handleBack}>
            Anterior
          </button>
          <button
            className={`next-button ${!selectedProfessional ? "disabled" : ""}`}
            onClick={handleNext}
            disabled={!selectedProfessional}
          >
            Siguiente
          </button>
        </div>
      </div>
      <TurnoResumen/>
    </div>
  );
};

export default SeleccionarProfesional;
