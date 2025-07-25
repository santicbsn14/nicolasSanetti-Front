import axios from "axios";
import { handleError } from '../Utils/ErrorManager';
import { getAuth } from "firebase/auth";
import { Dayjs } from "dayjs";
import mongoose from 'mongoose';
import type { IdMongo } from "./Hairdresser";

export interface IService {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  price: number;
  enabled: boolean;
  duration: number;
  description: string;
  images_galery: string[];
  discount?: string;
  limit?: boolean;
  deadline_time?: Dayjs;
}

const API_BASE = 'https://nicolas-sanetti-system.onrender.com/api/service';

export const createService = async (serviceData: unknown) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.post(
      API_BASE,
      serviceData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(handleError(error));
  }
};

export const getServices = async () => {
  try {
    const response = await axios.get(API_BASE, {
      withCredentials: true,  // Esto asegura que las cookies se envíen con la solicitud
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};


export const updateService = async (
  id: IdMongo,
  serviceData: Partial<IService>
) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.put(
      `${API_BASE}/${id}`,
      serviceData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
