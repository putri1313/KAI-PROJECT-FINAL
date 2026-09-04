import axios from 'axios';

const apiClient = axios.create({
  // Ganti dengan URL backend Anda dari file .env
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;