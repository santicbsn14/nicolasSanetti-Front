import axios from "axios";
import {handleError} from '../Utils/ErrorManager'
import { getAuth } from "firebase/auth";
import { Dayjs } from "dayjs";
import mongoose from 'mongoose'
import type { IdMongo } from "./Hairdresser";
export interface IService{
    _id?: string | mongoose.Types.ObjectId,
    name:  string,
    price: number,
    enabled:boolean,
    duration: number,
    description:string,
    images_galery: string[],
    discount?: string,
    limit?: boolean,
    deadline_time?:Dayjs
}

export const createService = async (appointmentData : unknown) => {
  try {
    const auth = getAuth(); // Obtener la instancia de autenticación de Firebase
    const token = await auth.currentUser?.getIdToken(); // Obtener el token del usuario autenticado

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.post(
      'http://localhost:8080/api/service', 
      appointmentData, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en la cabecera
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
export const getServices = async () => {
    try {


    const response = await axios.get(
      'http://localhost:8080/api/service'
    );
    return response.data;
  } catch (error) {
    const errorhandler = handleError(error);
    throw Error(errorhandler);
  }
}
export const updateService = async (id: IdMongo, hairdresserData : Partial<IService>) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.put(
      `http://localhost:8080/api/service/${id}`,
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