import axios from "axios";


const api = axios.create({
  // baseURL: "http://localhost:5000/api",
   baseURL: "https://lpuquora-backend.onrender.com/api",
     withCredentials: true,

});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const token = auth?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default api;


