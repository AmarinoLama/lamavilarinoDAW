import axios from 'axios';

const API_URL = 'http://localhost:3000/noticias';

export const getNoticias = () => {
  const url = `${API_URL}?_sort=fecha_publicacion&_order=desc`;

  return axios.get(url)
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