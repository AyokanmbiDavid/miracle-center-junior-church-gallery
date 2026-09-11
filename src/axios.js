import axios from 'axios';

const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:5000/api';

const ONLINE_URL = 
import.meta.env?.VITE_API_ONLINE_URL 

const API = axios.create({
  baseURL: 'https://junior-gallery-backend.onrender.com/api',
  timeout: 500000,
});

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError =
      error.response?.data?.error || error.message || 'Something went wrong';
    console.error('API Error:', customError);
    return Promise.reject(customError);
  }
);

export default API;