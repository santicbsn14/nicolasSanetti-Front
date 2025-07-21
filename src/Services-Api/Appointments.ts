import axios from 'axios';
import { type Appointment } from '../Components/System-Turnos/Pages/MisTurnos';
import { handleError } from '../Utils/ErrorManager';

import { getAuth } from 'firebase/auth'; // Importar Firebase Auth
import type { IdMongo } from './Hairdresser';

export const makeAppointment = async (appointmentData: Appointment) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/appointments/byclient', 
      appointmentData, 
      {

      }
    );
    
    return response.data;
  } catch (error) {
    const errorhandler = handleError(error);
    throw Error(errorhandler);
  }
};
export const getAppointments = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/appointments')

    return response.data
  } catch (error) {
    const errorhandler = handleError(error)
    throw Error(errorhandler)
  }
}
export const updateAppointment = async (id: string | IdMongo, data: Partial<Appointment>) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    const response = await axios.put(`http://localhost:8080/api/appointments/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
    })
    return response.data
  } catch (error) {
    const errorhandler = handleError(error)
    throw Error(errorhandler)
  }
}
export const bulkAppointments = async (data:Appointment[]) => {
  try {
    const auth = getAuth(); 
    const token = await auth.currentUser?.getIdToken(); 
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    const response = await axios.post('http://localhost:8080/api/appointments/bulkAppointments', data,
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en la cabecera
        }
      })
    
    return response.data
  } catch (error) {
    const errorhandler = handleError(error)
    throw Error(errorhandler)
  }
}
export const makeAppointmentByPatient = async (data: Appointment ) => {
  try {
    const auth = getAuth(); 
    const token = await auth.currentUser?.getIdToken(); 
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.post(
      'http://localhost:8080/api/appointments/byclient', 
      data, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en la cabecera
        }
      }
    );
    
    return response.data;
  } catch (error) {
    const errorhandler = handleError(error)
    throw Error(errorhandler)
  }
}
export const deleteAppointment = async (id: string) =>{
  try {
    const auth = getAuth(); 
    const token = await auth.currentUser?.getIdToken(); 
    
    if (!token) {
      throw new Error('No authentication token available');
    }
  
    const response = await axios.delete(`http://localhost:8080/api/appointments/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en la cabecera
        }
      })
      return response
  } catch (error) {
    const errorhandler = handleError(error)
    throw Error(errorhandler)
  }
}