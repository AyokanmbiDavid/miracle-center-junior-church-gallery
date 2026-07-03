import axios from "axios";

let url1 = 'http://localhost:5000/api'
let url2 = 'https://staggerbackend.onrender.com/api' 
const API = axios.create({
  baseURL: url1,
});

// Add interceptor to include the token in every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;