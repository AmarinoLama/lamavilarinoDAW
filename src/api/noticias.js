import axios from 'axios';

const API_URL = 'http://localhost:3001/noticias';

export const getNoticias = () => {
  const url = `${API_URL}?_sort=fecha_publicacion&_order=desc`;

  return axios.get(url)
    .then(res => res.data)
    .catch(err => {
      console.error('Error al obtener las noticias:', err);
      throw err;
    });
};
