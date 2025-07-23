import axios from "axios";
import { handleError } from '../Utils/ErrorManager';
import { getAuth } from "firebase/auth";

export interface IUser  {
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  dni: number;
  phone: number;
  role: {
    name: string;
    permissions: string[];
  } | string;
  password: string;
  confirmPassword?: string;
  id?: string;
  _id?: string;
  status: boolean;
}

const API_BASE = 'https://nicolas-sanetti-system.onrender.com/api';

export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(
      `${API_BASE}/users/email`,
      { params: { email } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(handleError(error));
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const createUser = async (userData: IUser) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.post(
      `${API_BASE}/session/signup`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(handleError(error));
  }
};

export const updateUser = async (userid: string, userdata: Partial<IUser>) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.put(
      `${API_BASE}/users/${userid}`,
      userdata,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteUserMongo = async (userid: string) => {
  try {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('No authentication token available');

    const response = await axios.delete(
      `${API_BASE}/users/${userid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
