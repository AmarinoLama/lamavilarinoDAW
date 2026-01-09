import axios from 'axios';

// URL de json-server (igual que clientes.js)
const API_URL = 'http://localhost:3000/noticias';

export const getNoticias = () => {
  // Ordenar por fecha descendente usando json-server
  return axios.get(`${API_URL}?_sort=fecha_publicacion&_order=desc`)
    .then(res => res.data)
    .catch(err => {
      console.error('Error al obtener las noticias:', err);
      throw err;
    });
};

export const addNoticia = (nuevaNoticia) => {
  return axios.post(API_URL, nuevaNoticia)
    .then(res => res.data)
}

export const deleteNoticia = (id) => {
  return axios.delete(`${API_URL}/${id}`)
    .then(res => res.data)
}

export const updateNoticia = (id, noticiaActualizada) => {
  return axios.put(`${API_URL}/${id}`, noticiaActualizada)
    .then(res => res.data)
}