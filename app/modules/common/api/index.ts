// api/axiosClient.ts
import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'https://your-backend.com/api',
  withCredentials: true, // boolean
});
