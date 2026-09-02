import axios from 'axios';
import mongoose from 'mongoose';
import { getAuth } from 'firebase/auth';
import { handleError } from '../Utils/ErrorManager';
import type { IUser } from './Users';

export type IdMongo = mongoose.Types.ObjectId;

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

const API_BASE = 'https://nicolas-sanetti-system.onrender.com/api/hairdresser';

export const getHairdresserByUserId = async (id: IdMongo) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.get(
      API_BASE,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const hairdressers = response.data?.hairdressers || [];
const found = hairdressers.find(
  (hd :{user_id: IUser}) => hd.user_id?._id === id.toString()
);

return found ?? null;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const createHairdresser = async (hairdresserData: Hairdresser) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.post(
      API_BASE,
      hairdresserData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(handleError(error));
  }
};

export const updateHairdresser = async (
  id: IdMongo,
  hairdresserData: Partial<Hairdresser>
) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.put(
      `${API_BASE}/${id}`,
      hairdresserData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getHairdressers = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data?.hairdressers || [];
  } catch (error) {
    throw new Error(handleError(error));
  }
};
