import axios from "axios";

const API_URL = "http://localhost:5000/api/contacto";

export const enviarContacto = async (form) => {
    try {
        const response = await axios.post(API_URL, form);
        return response.data;
    } catch (error) {
        console.error("Error al enviar contacto:", error);
        throw error;
    }
};
