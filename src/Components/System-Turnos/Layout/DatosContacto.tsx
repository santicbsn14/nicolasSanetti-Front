import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Css/AgendarTurno.css";
import TurnoResumen from "../UI/TurnoResumen";
import { makeAppointment } from "../../../Services-Api/Appointments";
import { useTurno } from "../../Contexts/TurnoContext";
import type { Appointment, Service } from "../Pages/MisTurnos";
import type { Hairdresser } from "../../../Services-Api/Hairdresser";
import { ToastContainer, toast } from 'react-toastify';

const DatosContacto = () => {
  const navigate = useNavigate();
  const location = useLocation();
// @ts-expect-error TS6133: setTurno no se lee, pero lo necesitamos para el setter
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { turno, setTurno } = useTurno();
  const appointmentData = location.state || {};
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    observaciones: ""
  });

  const [errors, setErrors] = useState({
    nombre: false,
    apellido: false,
    email: false,
    telefono: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      nombre: !formData.nombre.trim(),
      apellido: !formData.apellido.trim(),
      email: !formData.email.trim() || !isValidEmail(formData.email),
      telefono: !formData.telefono.trim()
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBack = () => {
    navigate("/turnos/profesional", {
      state: appointmentData
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const date_time = new Date(`${turno.selectedDate} ${turno.selectedTime}`);
const client_id = {
  firstname: formData.nombre,
  lastname: formData.apellido,
  email: formData.email,
  phone: Number(formData.telefono),
  dni: 0,  // ← si no se pide en el formulario
  age: 0   // ← lo mismo
};

    try {
      const appointment: Appointment = {
  client_id,
  hairdresser_id:turno.selectedProfessional!.id as unknown as Hairdresser,
  date_time,
  state: "Solicitado", // o "Confirmado" según prefieras
  service_id:turno.service!._id as unknown as Service,
  notes: formData.observaciones.trim()
    ? [formData.observaciones.trim()]
    : undefined
};


      // Llamada al backend
      await makeAppointment(appointment);
      // Navegar a pantalla de éxito
      navigate("/turnos/confirmado");
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        toast.error(errorMessage);
    }
  };
  return (
    <div className="agendar-wrapper">
      <div className="agendar-box">
        <div className="agendar-header">
          <strong>Datos de contacto</strong>
        </div>

        <hr className="agendar-divider" />

        <div className="agendar-steps-row">
          <div className="step completed-step">
            <span className="step-number">✓</span> Fecha y hora
          </div>
          <div className="step completed-step">
            <span className="step-number">✓</span> Profesional
          </div>
          <div className="step active-step">
            <span className="step-number">3</span> Datos de contacto
          </div>
        </div>

        <hr className="agendar-divider" />

        <div className="contact-info">
          <p>Te notificaremos sobre tus citas al correo y/o teléfono que escribas aquí</p>
        </div>

        {/* Formulario de contacto */}
        <div className="contact-form">
          <div className="form-row">
            <div className="form-field">
              <label>
                Nombre <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className={errors.nombre ? "error" : ""}
                placeholder="Ingresa tu nombre"
              />
              {errors.nombre && (
                <span className="error-message">El nombre es requerido</span>
              )}
            </div>

            <div className="form-field">
              <label>
                Apellido <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                className={errors.apellido ? "error" : ""}
                placeholder="Ingresa tu apellido"
              />
              {errors.apellido && (
                <span className="error-message">El apellido es requerido</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "error" : ""}
                placeholder="juan@mail.com"
              />
              {errors.email && (
                <span className="error-message">
                  {!formData.email.trim() ? "El email es requerido" : "Email inválido"}
                </span>
              )}
            </div>

            <div className="form-field">
              <label>
                Teléfono <span className="required">*</span>
              </label>
              <div className="phone-input">
                <select className="country-code">
                  <option value="+54">🇦🇷 +54</option>
                </select>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  className={errors.telefono ? "error" : ""}
                  placeholder="Ej: 1123456789"
                />
              </div>
              <small className="phone-help">
                Ingresá tu número con código de área, sin el 0 y sin el 15. Ej: 1123456789
              </small>
              {errors.telefono && (
                <span className="error-message">El teléfono es requerido</span>
              )}
            </div>
          </div>

          <div className="form-field full-width">
            <label>Observaciones</label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => handleInputChange("observaciones", e.target.value)}
              placeholder="Escribe aquí información que consideres relevante para tu cita"
              rows={4}
            />
          </div>
        </div>

        <div className="navigation-buttons">
          <button className="back-button" onClick={handleBack}>
            Anterior
          </button>
          <button 
            className="next-button"
            onClick={handleSubmit}
          >
            Agendar Turno
          </button>
        </div>
        
        <div className="footer-branding">
          <small>Desarrollado por <strong>Santiago Viale Sistemas</strong></small>
        </div>
      </div>
      <TurnoResumen/>
      <ToastContainer/>
    </div>
  );
};

export default DatosContacto;