import axios from 'axios';

const API_URL = 'http://localhost:3000/coches';

export const getCoches = (mostrarHistorico) => {
  let url = `${API_URL}?_sort=matricula&_order=asc`;

  if (!mostrarHistorico) {
    url += `&roto=false`;
  }
  else {
    url += ``;
  } 

  return axios.get(url).then(res => res.data);
};

export const addCoche = (nuevoCoche) => {
  return axios.post(API_URL, nuevoCoche)
              .then(res => res.data)
}

export const updateCoche = (id, cocheActualizado) => {
  return axios.put(`${API_URL}/${id}`, cocheActualizado)
              .then(res => res.data)
}

export const deletePermanenteCoche = (id) => {
  return axios.delete(`${API_URL}/${id}`)
              .then(res => res.data)
}