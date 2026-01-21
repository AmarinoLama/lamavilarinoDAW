import { defineStore } from 'pinia';

const STORAGE_KEY = 'cesta_items';

export const useCestaStore = defineStore('cesta', {
    state: () => ({
        items: loadCestaFromStorage()
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
            this.saveCestaToStorage();
        },
        removeProducto(productoId) {
            this.items = this.items.filter(item => item.id !== productoId);
            this.saveCestaToStorage();
        },
        incrementar(id) {
            const item = this.items.find(item => item.id === id);
            if (item) item.cantidad++;
            this.saveCestaToStorage();
        },
        decrementar(id) {
            const item = this.items.find(item => item.id === id);
            if (item && item.cantidad > 1) item.cantidad--;
            this.saveCestaToStorage();
        },
        clearCesta() {
            this.items = [];
            this.saveCestaToStorage();
        },
        saveCestaToStorage() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        }
    }
});

// Función helper para cargar la cesta desde localStorage
function loadCestaFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error al cargar cesta desde localStorage:', error);
        return [];
    }
}