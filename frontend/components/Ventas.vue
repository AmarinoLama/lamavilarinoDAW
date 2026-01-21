<template>
    <div class="container-fluid mt-2">
        <div class="row g-4">
            <div 
            v-for="car in vehiculos"
            :key="car._id"
            class="col-12 col-md-6 col-lg-3"
            >
                <div class="card h-80 shadow-sm" @click="mostrarDetalles(car)" style="cursor: pointer;">
                    <img
                        :src="urlImagen(car.imagen)"
                        class="card-img-top"
                        alt="vehiculo"
                        style="height: 200px; object-fit: cover;"
                    ></img>

                    <div class="card-body">
                        <h5 class="card-title">{{ car.marca }} {{ car.modelo }}</h5>
                        <p class="card-text">
                            <strong>Año:</strong> {{ car.anio }}<br>
                            <strong>Km:</strong> {{ car.kilometros }}<br>
                            <strong>Precio:</strong> {{ car.precio }}€<br>
                        </p>   
                    </div>

                    <div class="card-footer text-end bg-white">
                        <span :class="['badge', estadoClass(car.estado)]">{{ car.estado }}</span>
                        <button
                            class="btn badge btn-sm btn-success ms-2"
                            @click.stop="agregarACesta(car)"
                            >
                            <i class="bi bi-cart3 me-1"></i> Añadir Cesta
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de detalles del vehículo -->
        <div v-if="vehiculoSeleccionado" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="cerrarModal">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ vehiculoSeleccionado.marca }} {{ vehiculoSeleccionado.modelo }}</h5>
                        <button type="button" class="btn-close" @click="cerrarModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img
                                    :src="urlImagen(vehiculoSeleccionado.imagen)"
                                    class="img-fluid rounded"
                                    alt="vehiculo"
                                    style="max-height: 300px; width: 100%; object-fit: cover;"
                                >
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-primary mb-3">Información General</h6>
                                <p><strong>Tipo:</strong> {{ vehiculoSeleccionado.tipo }}</p>
                                <p><strong>Matrícula:</strong> {{ vehiculoSeleccionado.matricula }}</p>
                                <p><strong>Marca:</strong> {{ vehiculoSeleccionado.marca }}</p>
                                <p><strong>Modelo:</strong> {{ vehiculoSeleccionado.modelo }}</p>
                                <p><strong>Año:</strong> {{ vehiculoSeleccionado.anio }}</p>
                                <p><strong>Estado:</strong> <span :class="['badge', estadoClass(vehiculoSeleccionado.estado)]">{{ vehiculoSeleccionado.estado }}</span></p>
                                <p><strong>Kilómetros:</strong> {{ vehiculoSeleccionado.kilometros }} km</p>
                                <p><strong>Precio:</strong> <span class="text-success fw-bold">{{ vehiculoSeleccionado.precio }}€</span></p>
                            </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="text-primary mb-3">Características Técnicas</h6>
                                <p><strong>Combustible:</strong> {{ vehiculoSeleccionado.combustible }}</p>
                                <p><strong>Transmisión:</strong> {{ vehiculoSeleccionado.transmision }}</p>
                                <p v-if="vehiculoSeleccionado.potencia_cv"><strong>Potencia:</strong> {{ vehiculoSeleccionado.potencia_cv }} CV</p>
                                <p v-if="vehiculoSeleccionado.descripcion"><strong>Descripción:</strong> {{ vehiculoSeleccionado.descripcion }}</p>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-primary mb-3">Ubicación</h6>
                                <p><strong>Provincia:</strong> {{ vehiculoSeleccionado.ubicacion.provincia }}</p>
                                <p><strong>Ciudad:</strong> {{ vehiculoSeleccionado.ubicacion.ciudad }}</p>
                                
                                <h6 class="text-primary mb-3 mt-4">Contacto</h6>
                                <p><strong>Nombre:</strong> {{ vehiculoSeleccionado.contacto.nombre }}</p>
                                <p><strong>Teléfono:</strong> {{ vehiculoSeleccionado.contacto.telefono }}</p>
                                <p><strong>Email:</strong> {{ vehiculoSeleccionado.contacto.email }}</p>
                            </div>
                        </div>
                        
                        <div v-if="vehiculoSeleccionado.fecha_publicacion" class="text-muted text-end mt-3">
                            <small>Publicado el: {{ formatearFecha(vehiculoSeleccionado.fecha_publicacion) }}</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from "vue";
import { getArticulos } from "@/api/articulos.js";
import { useCestaStore } from "@/store/cesta";

const vehiculos = ref([]);
const vehiculoSeleccionado = ref(null);
const cestaStore = useCestaStore();

onMounted(async () => {
    vehiculos.value = await getArticulos();
});

const urlImagen = (ruta) => {
    if (!ruta) return "/proximamente.png";
    return `http://localhost:5000${ruta}`
};

const mostrarDetalles = (vehiculo) => {
    vehiculoSeleccionado.value = vehiculo;
};

const cerrarModal = () => {
    vehiculoSeleccionado.value = null;
};

const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

const agregarACesta = (vehiculo) => {
    cestaStore.addProducto({
        id: vehiculo._id,
        nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
        precio: vehiculo.precio,
        imagen: urlImagen(vehiculo.imagen),
    });
};

// Devuelve la clase Bootstrap según el estado
const estadoClass = (estado) => {
    const value = (estado || '').toString().toLowerCase().trim();
    switch (value) {
        case 'disponible':
            return 'bg-primary';
        case 'vendido':
            return 'bg-danger';
        case 'reservado':
            return 'bg-warning text-dark';
        default:
            return 'bg-secondary';
    }
};

</script>

<style scoped>
.card-title{
    font-weight: bold;
    text-transform: capitalize;
}
</style>