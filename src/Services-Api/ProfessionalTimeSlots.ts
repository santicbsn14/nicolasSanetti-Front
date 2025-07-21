import axios from "axios";
import {handleError} from '../Utils/ErrorManager'
import { getAuth } from "firebase/auth";
import { Dayjs } from "dayjs";
import mongoose from 'mongoose'

export interface TimeSlot {
    start_time: Dayjs;
    end_time: Dayjs;
}

export interface DaySchedule {
    week_day: number; 
    time_slots: TimeSlot;
}
export interface ProfessionalTimeSlots {
    _id?: mongoose.Types.ObjectId;
    hairdresser_id: mongoose.Types.ObjectId | string ;
    schedule: DaySchedule[];
}

export const createDailyHourAvailability = async (dailyData : unknown) => {
  try {
    const auth = getAuth(); // Obtener la instancia de autenticación de Firebase
    const token = await auth.currentUser?.getIdToken(); // Obtener el token del usuario autenticado

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.post(
      'http://localhost:8080/api/dailyHourAvailability', 
      dailyData, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en la cabecera
        }
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    const errorhandler = handleError(error);
    console.error(error)
    throw Error(errorhandler);
  }
};
export const getDailyHourAvailability= async () => {
    try {
    const auth = getAuth(); // Obtener la instancia de autenticación de Firebase
    const token = await auth.currentUser?.getIdToken(); // Obtener el token del usuario autenticado

    // if (!token) {
    //   throw new Error('No authentication token available');
    // }

    const response = await axios.get(
      'http://localhost:8080/api/dailyHourAvailability',  
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en la cabecera
        }
      }
    );

    return response.data;
  } catch (error) {
    const errorhandler = handleError(error);
    throw Error(errorhandler);
  }
}
export const createProfessionalTimeSlots = async (data:ProfessionalTimeSlots) => {
  try {
    const auth = getAuth(); 
    const token = await auth.currentUser?.getIdToken(); 
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    const response = await axios.post(`http://localhost:8080/api/professionalTimeSlots`, data, 
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
export const getProfessionalTimeSlots = async (id:string) => {
  try {
    const auth = getAuth(); 
    const token = await auth.currentUser?.getIdToken(); 
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.get(`http://localhost:8080/api/professionalTimeSlots/bypro/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en la cabecera
        }
      })
      
    if(response.data=== null){ throw new Error('Error al cargar los horarios')}
    return response.data
  } catch (error) {
    const errorhandler = handleError(error)
    throw Error(errorhandler)
  }
}
export const updateProfessionalTimeSlots = async(id:string, data:Partial<ProfessionalTimeSlots>) => {
  try {
    const auth = getAuth(); 
    const token = await auth.currentUser?.getIdToken(); 
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    const response = await axios.put(`http://localhost:8080/api/professionalTimeSlots/${id}`, data, 
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