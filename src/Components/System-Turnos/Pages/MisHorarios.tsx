import { useState, useEffect } from 'react';
import '../Css/MisHorarios.css';
import { getProfessionalTimeSlots, createProfessionalTimeSlots, updateProfessionalTimeSlots, type ProfessionalTimeSlots } from '../../../Services-Api/ProfessionalTimeSlots';
import { getHairdresserByUserId, updateHairdresser, type IdMongo } from '../../../Services-Api/Hairdresser';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../../Contexts/AuthContext';
import { isHttpError } from '../../../Utils/ErrorManager';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Interfaces
interface LimitServices {
  day: number;
  max: number;
}

interface Hairdresser {
  _id?: string;
  user_id: string;
  services: string[];
  state: 'Disponible' | 'No disponible' | 'Vacaciones' | 'Feriado';
  limit_services: LimitServices[];
}

interface TimeSlot {
  start_time: string; // Cambiado a string para mayor consistencia
  end_time: string;   // Cambiado a string para mayor consistencia
}

interface DaySchedule {
  week_day: number;
  time_slots: TimeSlot;
}

interface DayOfWeek {
  id: number;
  name: string;
  short: string;
}

interface StateOption {
  value: 'Disponible' | 'No disponible' | 'Vacaciones' | 'Feriado';
  label: string;
  color: string;
}

interface ApiResponse {
  hairdresser?: Hairdresser;
  schedule?: DaySchedule[];
  _id?: string; // ID del ProfessionalTimeSlots
}

const MisHorarios: React.FC = () => {
  const [hairdresserState, setHairdresserState] = useState<'Disponible' | 'No disponible' | 'Vacaciones' | 'Feriado'>('Disponible');
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [limitServices, setLimitServices] = useState<LimitServices[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [hairdresserId, setHairdresserId] = useState<IdMongo | string | null>(null);
  const [professionalTimeSlotsId, setProfessionalTimeSlotsId] = useState<string | null>(null);
  const [hasConfiguration, setHasConfiguration] = useState<boolean>(false);
  const { mongoUser } = useAuth();

  const daysOfWeek: DayOfWeek[] = [
    { id: 2, name: 'Martes', short: 'Mar' },
    { id: 3, name: 'Miércoles', short: 'Mié' },
    { id: 4, name: 'Jueves', short: 'Jue' },
    { id: 5, name: 'Viernes', short: 'Vie' },
    { id: 6, name: 'Sábado', short: 'Sáb' }
  ];

  const stateOptions: StateOption[] = [
    { value: 'Disponible', label: 'Disponible', color: '#22c55e' },
    { value: 'No disponible', label: 'No disponible', color: '#ef4444' },
    { value: 'Vacaciones', label: 'Vacaciones', color: '#f59e0b' },
    { value: 'Feriado', label: 'Feriado', color: '#8b5cf6' }
  ];

  // Función mejorada para formatear tiempo - solo maneja la conversión a HH:mm
  const formatTimeForInput = (dateString: Date | string | Dayjs): string => {
    if (!dateString) return '';

    try {
      // Si ya es un string en formato HH:mm, devolverlo directamente
      if (typeof dateString === 'string' && /^\d{2}:\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Convertir usando dayjs para mayor consistencia
      const dayjsDate = dayjs(dateString);
      if (!dayjsDate.isValid()) return '';

      return dayjsDate.format('HH:mm');
    } catch (error) {
      console.error('Error al formatear tiempo:', error);
      return '';
    }
  };

  // Función mejorada para mostrar tiempo en el resumen
  const formatTimeForDisplay = (timeString: string): string => {
    if (!timeString) return '';

    // Si ya es formato HH:mm, devolverlo
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // Si es una fecha completa, convertir
    try {
      return dayjs(timeString).format('HH:mm');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
      return ''
    }
  };

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);

        if (!mongoUser?._id) throw new Error('Usuario no autenticado');

        const hairdresser: Hairdresser = await getHairdresserByUserId(mongoUser._id as unknown as IdMongo);
        
        const currentHairdresserId: string | undefined = hairdresser?._id;
        console.log(currentHairdresserId)
        if (!currentHairdresserId) throw new Error('No se encontró un hairdresser para este usuario');
        
        setHairdresserId(currentHairdresserId);

        // 2. Intentar obtener los horarios usando ese ID
        const data: ApiResponse = await getProfessionalTimeSlots(currentHairdresserId);

        // 3. Verificar si tiene configuración previa
        if (data && ((data.schedule?.length ?? 0) > 0 || data.hairdresser)) {
          setHasConfiguration(true);

          // GUARDAR EL ID DEL ProfessionalTimeSlots
          if (data._id) {
            setProfessionalTimeSlotsId(data._id);
          }

          // Cargar datos existentes
          // Usar los datos del hairdresser original, no el del schedule
          setHairdresserState(hairdresser.state || 'Disponible');
          setLimitServices(hairdresser.limit_services || []);


          if (Array.isArray(data.schedule) && data.schedule.length > 0) {
            // Convertir los horarios de la API a formato string HH:mm
            const convertedSchedule: DaySchedule[] = data.schedule.map((s) => ({
              week_day: s.week_day,
              time_slots: {
                start_time: formatTimeForInput(s.time_slots.start_time),
                end_time: formatTimeForInput(s.time_slots.end_time)
              }
            }));
            setSchedule(convertedSchedule);
          }
        } else {
          // No tiene configuración previa
          setHasConfiguration(false);
          setProfessionalTimeSlotsId(null);
          setHairdresserState('Disponible');
          setSchedule([]);
          setLimitServices([]);
        }

      } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(errorMessage);

        if (isHttpError(error)) {
          if (
            error.message.includes('No se encontró') ||
            error.response?.status === 404
          ) {
            setHasConfiguration(false);
            setProfessionalTimeSlotsId(null);
            setHairdresserState('Disponible');
            setSchedule([]);
            setLimitServices([]);
          } else {
            setShowError('Error al cargar la configuración');
            setTimeout(() => setShowError(''), 3000);
          }
        } else {
          setShowError('Error inesperado al cargar la configuración');
          setTimeout(() => setShowError(''), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mongoUser]);

  const updateScheduleDay = (dayId: number, startTime: string, endTime: string): void => {
    const newSchedule = schedule.filter(s => s.week_day !== dayId);
    if (startTime && endTime) {
      newSchedule.push({
        week_day: dayId,
        time_slots: {
          start_time: startTime, // Guardar directamente como string HH:mm
          end_time: endTime      // Guardar directamente como string HH:mm
        }
      });
    }
    setSchedule(newSchedule.sort((a, b) => a.week_day - b.week_day));
  };

  const updateServiceLimit = (dayId: number, maxServices: number): void => {
    const newLimits = limitServices.filter(l => l.day !== dayId);
    if (maxServices > 0) {
      newLimits.push({ day: dayId, max: maxServices });
    }
    setLimitServices(newLimits.sort((a, b) => a.day - b.day));
  };

  const getDaySchedule = (dayId: number): DaySchedule | undefined => {
    return schedule.find(s => s.week_day === dayId);
  };

  const getDayLimit = (dayId: number): number => {
    const limit = limitServices.find(l => l.day === dayId);
    return limit?.max || 0;
  };

  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);
console.log(hairdresserId)
      if (!hairdresserId) {
        throw new Error('ID del peluquero no disponible');
      }

      // 1. Preparar el payload para ProfessionalTimeSlots
      // Convertir los tiempos string a objetos Dayjs para la API
      const professionalTimeSlotPayload: ProfessionalTimeSlots = {
        hairdresser_id: hairdresserId,
        schedule: schedule.map(s => {
          // Crear fechas usando el día actual con las horas especificadas
          const today = dayjs().format('YYYY-MM-DD');
          return {
            week_day: s.week_day,
            time_slots: {
              start_time: dayjs(`${today} ${s.time_slots.start_time}`),
              end_time: dayjs(`${today} ${s.time_slots.end_time}`)
            }
          };
        })
      };

      // 2. Preparar el payload para Hairdresser (estado y límites de servicios)
      const hairdresserPayload = {
        state: hairdresserState,
        limit_services: limitServices
      };

      // 3. Ejecutar ambas actualizaciones en paralelo
      const promises = [];

      // Actualizar/crear ProfessionalTimeSlots
      if (hasConfiguration && professionalTimeSlotsId) {
        promises.push(updateProfessionalTimeSlots(professionalTimeSlotsId, professionalTimeSlotPayload));
      } else {
        promises.push(createProfessionalTimeSlots(professionalTimeSlotPayload));
      }

      // Actualizar Hairdresser (necesitas importar la función updateHairdresser)
      promises.push(updateHairdresser(hairdresserId as unknown as IdMongo, hairdresserPayload));


      const results = await Promise.all(promises);

      // Si era una creación nueva, guardar el ID
      if (!hasConfiguration) {
        const response = results[0];
        if (response && response._id) {
          setProfessionalTimeSlotsId(response._id);
        }
        setHasConfiguration(true);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
      setShowError('Error al guardar la configuración');
      setTimeout(() => setShowError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleTimeChange = (dayId: number, timeType: 'start' | 'end', value: string): void => {
    const currentSchedule = getDaySchedule(dayId);
    if (timeType === 'start') {
      const endTime = currentSchedule?.time_slots.end_time || '18:00';
      updateScheduleDay(dayId, value, endTime);
    } else {
      const startTime = currentSchedule?.time_slots.start_time || '09:00';
      updateScheduleDay(dayId, startTime, value);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#64748b'
      }}>
        Cargando configuración...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      color: '#333',
      animation: 'fadeIn 0.6s ease-out',
      padding: '0 1rem'
    }}>

      <h1 className="schedule-title">Mis Horarios</h1>

      {/* Aviso si no tiene configuración */}
      {!hasConfiguration && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <strong style={{ color: '#92400e' }}>Configuración requerida</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#92400e', fontSize: '14px' }}>
                Por favor, configure sus horarios de disponibilidad para que los clientes puedan agendar citas.
              </p>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-message">
          ✅ Configuración guardada exitosamente
        </div>
      )}

      {showError && (
        <div className="error-message">
          ❌ {showError}
        </div>
      )}

      {/* Estado del Peluquero */}
      <section className="schedule-section">
        <h2>Estado Actual</h2>
        <div className="status-selector">
          <span style={{ color: '#64748b', fontWeight: '600' }}>Mi estado:</span>
          {stateOptions.map(option => (
            <button
              key={option.value}
              className={`status-button ${hairdresserState === option.value ? 'active' : ''}`}
              style={{
                ...(hairdresserState === option.value && {
                  borderColor: option.color,
                  backgroundColor: option.color,
                  color: 'white'
                })
              }}
              onClick={() => setHairdresserState(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* Configuración de Horarios */}
      <section className="schedule-section">
        <h2>Configuración de Horarios</h2>
        {daysOfWeek.map(day => {
          const daySchedule = getDaySchedule(day.id);
          const dayLimit = getDayLimit(day.id);
          const isWorking = !!daySchedule;

          return (
            <div key={day.id} className="day-schedule">
              <div className="day-header">
                <div className="day-name">{day.name}</div>
                <span className={`day-status ${isWorking ? 'working' : 'closed'}`}>
                  {isWorking ? 'Disponible' : 'Cerrado'}
                </span>
              </div>

              <div className="time-inputs">
                <label style={{ fontSize: '14px', color: '#64748b' }}>Desde:</label>
                <input
                  type="time"
                  className="time-input"
                  value={daySchedule?.time_slots.start_time || ''}
                  onChange={(e) => handleTimeChange(day.id, 'start', e.target.value)}
                />

                <label style={{ fontSize: '14px', color: '#64748b' }}>Hasta:</label>
                <input
                  type="time"
                  className="time-input"
                  value={daySchedule?.time_slots.end_time || ''}
                  onChange={(e) => handleTimeChange(day.id, 'end', e.target.value)}
                />

                <label style={{ fontSize: '14px', color: '#64748b', marginLeft: '1rem' }}>
                  Máx. servicios:
                </label>
                <input
                  type="number"
                  className="limit-input"
                  min="0"
                  max="20"
                  value={dayLimit}
                  onChange={(e) => updateServiceLimit(day.id, parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* Resumen */}
      <section className="schedule-section">
        <h2>Resumen de Configuración</h2>
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Estado actual:</strong>
            <span style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: stateOptions.find(s => s.value === hairdresserState)?.color + '20',
              color: stateOptions.find(s => s.value === hairdresserState)?.color
            }}>
              {hairdresserState}
            </span>
          </div>

          <div>
            <strong>Días laborables:</strong>
            {schedule.length === 0 ? (
              <div style={{
                marginTop: '0.5rem',
                color: '#64748b',
                fontStyle: 'italic',
                fontSize: '14px'
              }}>
                No hay días configurados
              </div>
            ) : (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {schedule.map(daySchedule => {
                  const day = daysOfWeek.find(d => d.id === daySchedule.week_day);
                  const limit = getDayLimit(daySchedule.week_day);
                  return (
                    <div
                      key={daySchedule.week_day}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        fontSize: '14px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ fontWeight: '600' }}>{day?.short}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>
                        {formatTimeForDisplay(daySchedule.time_slots.start_time)} - {formatTimeForDisplay(daySchedule.time_slots.end_time)}
                      </div>
                      {limit > 0 && (
                        <div style={{ color: '#64748b', fontSize: '12px' }}>
                          Max: {limit}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <button
        className="save-button"
        onClick={handleSave}
        disabled={saving}
        style={{
          ...(saving && {
            opacity: 0.6,
            cursor: 'not-allowed'
          })
        }}
      >
        {saving ? 'Guardando...' : 'Guardar Configuración'}
      </button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default MisHorarios;