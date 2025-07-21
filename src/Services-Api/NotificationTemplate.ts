import axios from "axios";
import {handleError} from '../Utils/ErrorManager'
import { getAuth } from "firebase/auth";
import { Dayjs } from "dayjs";
import type { IdMongo } from "./Hairdresser";
export interface NotificationTemplate{
    _id?: IdMongo,
    name: string,
    message: string,
    updatedAt?: Dayjs,
}
export const getNotificationTemplate = async () => {
    try {
    const auth = getAuth(); // Obtener la instancia de autenticación de Firebase
    const token = await auth.currentUser?.getIdToken(); // Obtener el token del usuario autenticado

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.get(
      'http://localhost:8080/api/notificationTemplate',  
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
export const updateNotificationTemplate = async (id: IdMongo, hairdresserData : Partial<NotificationTemplate>) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.put(
      `http://localhost:8080/api/notificationTemplate/${id}`,
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