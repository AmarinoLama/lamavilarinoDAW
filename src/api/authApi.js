import axios from 'axios';
import bcrypt from 'bcryptjs';

// URL base de la API de clientes (usamos clientes como usuarios)
const API_URL = 'http://localhost:3000/clientes';

/**
 * Función para autenticar un usuario (cliente)
 * @param {string} dni - DNI del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise} - Promesa con los datos del usuario autenticado
 */
export const loginUsuario = async (dni, password) => {
    try {
        // Buscar el cliente por DNI
        const response = await axios.get(`${API_URL}?dni=${dni.toUpperCase().trim()}`);
        const clientes = response.data;

        // Verificar si existe el cliente
        if (!clientes || clientes.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const cliente = clientes[0];

        // Verificar si el cliente está activo (histórico = true)
        if (!cliente.historico) {
            throw new Error('Usuario inactivo');
        }

        // Comparar la contraseña con bcrypt
        const passwordValida = await bcrypt.compare(password, cliente.contrasena);

        if (!passwordValida) {
            throw new Error('Contraseña incorrecta');
        }

        // Si todo es correcto, devolver los datos del usuario
        return {
            token: `token-${cliente.id}-${Date.now()}`, // Token simulado
            nombre: cliente.nombre,
            apellidos: cliente.apellidos,
            dni: cliente.dni,
            email: cliente.email,
            tipo: cliente.tipoCliente === 'empresa' ? 'admin' : 'user', // Simulamos que empresa = admin
            id: cliente.id
        };

    } catch (error) {
        console.error('Error en loginUsuario:', error);
        throw error;
    }
};
