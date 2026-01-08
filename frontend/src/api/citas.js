import axios from 'axios';

const API_URL = 'http://localhost:3000/taller';

export const getCitas = () => {
  const url = `${API_URL}?_sort=fechaCita&_order=desc`;

  return axios.get(url)
    .then(res => res.data)
    .catch(err => {
      console.error('Error al obtener las citas:', err);
      throw err;
    });
};

export const addCita = (nuevaCita) => {
  return axios.post(API_URL, nuevaCita)
              .then(res => res.data)
}

export const deleteCita = (id) => {
  return axios.delete(`${API_URL}/${id}`)
              .then(res => res.data)
}