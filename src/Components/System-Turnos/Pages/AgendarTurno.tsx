import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AgendarTurno.css";
import { useTurno } from "../../Contexts/TurnoContext";
import TurnoResumen from "../UI/TurnoResumen";
interface DateItem {
  dateObj: Date;
}
const AgendarTurno = () => {
  const navigate = useNavigate();

  const { setTurno } = useTurno();

  // Estado para el rango de fechas actual (inicio del período de 14 días)
  const [dateRangeStart, setDateRangeStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Horarios disponibles
  const morningTimes = ["8:00 am", "9:15 am", "10:30 am", "11:45 am"];
  const afternoonTimes = ["2:15 pm", "3:30 pm", "4:45 pm"];

  // Función para generar 14 días a partir de una fecha
  const generateDateRange = (startDate: Date) => {
    const dates = [];
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    
    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayName = daysOfWeek[currentDate.getDay()];
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Deshabilitar sábados y domingos
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      dates.push({
        day: dayName,
        date: dateString,
        dateObj: currentDate,
        disabled: isWeekend
      });
    }
    
    return dates;
  };

  // Función para obtener los meses únicos del rango actual
const getMonthsInRange = (dates: DateItem[]): string[] => {
  // Especificamos que el Set contendrá strings
  const months = new Set<string>();
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  dates.forEach(dateItem => {
    // TS ya sabe que dateItem.dateObj es Date
    months.add(monthNames[dateItem.dateObj.getMonth()]);
  });

  return Array.from(months);  // devuelve string[]
};

  // Navegar hacia adelante (14 días)
  const handleNextRange = () => {
    const newStart = new Date(dateRangeStart);
    newStart.setDate(dateRangeStart.getDate() + 14);
    setDateRangeStart(newStart);
    setSelectedDate(""); // Limpiar selección
  };

  // Navegar hacia atrás (14 días)
  const handlePrevRange = () => {
    const newStart = new Date(dateRangeStart);
    newStart.setDate(dateRangeStart.getDate() - 14);
    setDateRangeStart(newStart);
    setSelectedDate(""); // Limpiar selección
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
        setTurno(prev => ({
            ...prev,
            selectedDate,
            selectedTime
          }));
      navigate("/turnos/profesional", {
        state: {
          selectedDate,
          selectedTime
        }
      });
    }
  };

  // Generar el rango actual de fechas
  const dateList = generateDateRange(dateRangeStart);
  const monthsInRange = getMonthsInRange(dateList);

  return (
    <div className="agendar-wrapper">
      <div className="agendar-box">
        <div className="agendar-header">
          <strong>Selecciona fecha y hora de tu servicio</strong>
        </div>

        <hr className="agendar-divider" />

        <div className="agendar-steps-row">
          <div className="step active-step">
            <span className="step-number">1</span> Fecha y hora
          </div>
          <div className="step">
            <span className="step-number">2</span> Profesional
          </div>
          <div className="step">
            <span className="step-number">3</span> Datos de contacto
          </div>
        </div>

        <hr className="agendar-divider" />

        {/* Mostrar mes actual */}
        <div className="month-header">
          <span className="current-month">{monthsInRange[0]}</span>
          {monthsInRange.length > 1 && (
            <>
              <span className="month-separator"> - </span>
              <span className="next-month">{monthsInRange[1]}</span>
            </>
          )}
        </div>

        {/* Navegación "Otras fechas disponibles" */}
        <div className="date-navigation">
          <button className="nav-link" onClick={handlePrevRange}>
            ← Otras fechas disponibles
          </button>
          <button className="nav-link" onClick={handleNextRange}>
            Otras fechas disponibles →
          </button>
        </div>

        {/* Selector horizontal de fechas */}
        <div className="date-scroll">
          <button className="nav-arrow" onClick={handlePrevRange}>
            ←
          </button>

          <div className="day-list">
            {dateList.map(({ day, date, dateObj, disabled }) => {
              const isActive = date === selectedDate;
              return (
                <div
                  key={date}
                  className={`day-item ${disabled ? "disabled" : ""} ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => !disabled && setSelectedDate(date)}
                >
                  <div className="day-name">{day}</div>
                  <div className="day-number">
                    {dateObj.getDate().toString().padStart(2, "0")}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="nav-arrow" onClick={handleNextRange}>
            →
          </button>
        </div>

        {/* Selector de horarios */}
        {selectedDate && (
          <div className="time-selection">
            <div className="time-section">
              <h4>Mañana</h4>
              <div className="time-buttons">
                {morningTimes.map((time) => (
                  <button
                    key={time}
                    className={`time-button ${selectedTime === time ? "active" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="time-section">
              <h4>Tarde</h4>
              <div className="time-buttons">
                {afternoonTimes.map((time) => (
                  <button
                    key={time}
                    className={`time-button ${selectedTime === time ? "active" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="next-button-wrapper">
          <button 
            className={`next-button ${!selectedDate || !selectedTime ? "disabled" : ""}`}
            onClick={handleNext}
            disabled={!selectedDate || !selectedTime}
          >
            Siguiente
          </button>
        </div>
      </div>
      <TurnoResumen/>
    </div>
  );
};

export default AgendarTurno;