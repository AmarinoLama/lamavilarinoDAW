import { defineStore } from 'pinia';

export const useCestaStore = defineStore('cesta', {
    state: () => ({
        items: []
    }),

    getters: {
        totalItems(state) {
            return state.items.reduce((total, item) => total + item.cantidad, 0);
        },
        totalPrecio(state) {
            return state.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
        }
    },

    actions: {
        addProducto(producto) {
            const existente = this.items.find(item => item.id === producto.id);
            if (existente) {
                existente.cantidad++;
            } else {
                this.items.push({ 
                    ...producto, 
                    cantidad: 1 
                });
            }
        },
        removeProducto(productoId) {
            this.items = this.items.filter(item => item.id !== productoId);
        },
        incrementar(id) {
            const item = this.items.find(item => item.id === id);
            if (item) item.cantidad++;
        },
        decrementar(id) {
            const item = this.items.find(item => item.id === id);
            if (item && item.cantidad > 1) item.cantidad--;
        },
        clearCesta() {
            this.items = [];
        }
    }

});