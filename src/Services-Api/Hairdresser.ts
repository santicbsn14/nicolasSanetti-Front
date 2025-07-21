import axios from 'axios';
import mongoose from 'mongoose';
import { getAuth } from 'firebase/auth';
import {handleError} from '../Utils/ErrorManager'
import type { IUser } from './Users';
export type IdMongo = mongoose.Types.ObjectId
interface LimitServices {
  day: number;
  max: number;
}

export interface Hairdresser {
  _id?: string;
  user_id: string | IdMongo | IUser;
  services: string[];
  state: 'Disponible' | 'No disponible' | 'Vacaciones' | 'Feriado';
  limit_services: LimitServices[];
}
export const getHairdresserByUserId = async (id: IdMongo) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.get(
      'http://localhost:8080/api/hairdresser',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const hairdressers = response.data?.hairdressers || [];
    
    // Filtrar por user_id que coincida con el id recibido
    const hairdresser = hairdressers.find(
      (hd: { user_id: IUser }) => hd.user_id._id  === id.toString() 
    );
    
    return hairdresser ?? null;

  } catch (error) {
    const errorhandler = handleError(error);
    throw Error(errorhandler);
  }
};
export const createHairdresser = async (hairdresserData : Hairdresser) => {
  try {
    const auth = getAuth(); // Obtener la instancia de autenticación de Firebase
    const token = await auth.currentUser?.getIdToken(); // Obtener el token del usuario autenticado

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.post(
      'http://localhost:8080/api/hairdresser', 
      hairdresserData, 
      {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );

    return response.data;
  } catch (error) {
    const errorhandler = handleError(error);
    console.error(error)
    throw Error(errorhandler);
  }
};
export const updateHairdresser = async (id: IdMongo, hairdresserData : Partial<Hairdresser>) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.put(
      `http://localhost:8080/api/hairdresser/${id}`,
      hairdresserData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    
    return response.data

  } catch (error) {
    const errorhandler = handleError(error);
    throw Error(errorhandler);
  }
};
export const getHairdressers = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8080/api/hairdresser');
    
    const hairdressers = response.data?.hairdressers || [];
    
    
    return hairdressers

  } catch (error) {
    const errorhandler = handleError(error);
    throw Error(errorhandler);
  }
};
