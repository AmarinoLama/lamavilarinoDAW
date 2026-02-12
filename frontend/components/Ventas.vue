<template>
    <div class="container-fluid mt-2">
        <div class="row g-4">
            <div 
            v-for="car in vehiculos"
            :key="car._id"
            class="col-12 col-md-6 col-lg-3"
            @click="mostrarDetalles(car)"
            >
                <div class="card h-80 shadow-sm" style="cursor: pointer;">
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
                            <strong>Km:</strong> {{ car.kilometros ? car.kilometros.toLocaleString('es-ES') : 0 }}<br>
                            <strong>Precio:</strong> {{ car.precio ? car.precio.toLocaleString('es-ES') : 0 }}€<br>
                        </p>   
                    </div>

                    <div class="card-footer text-end bg-white">
                        <span :class="['badge', estadoClass(car.estado)]">{{ car.estado }}</span>
                        <button
                            class="btn badge btn-sm btn-info ms-2"
                            @click.stop="generarPDF(car)"
                            title="Descargar PDF"
                            >
                            <i class="bi bi-file-earmark-pdf me-1"></i> PDF
                        </button>
                        <button
                            v-if="car.estado === 'disponible'"
                            class="btn badge btn-sm btn-success ms-2"
                            @click.stop="agregarACesta(car)"
                            >
                            <i class="bi bi-cart3 me-1"></i> Añadir Cesta
                        </button>
                        <span v-else class="badge bg-secondary ms-2">
                            <i class="bi bi-lock me-1"></i> No disponible
                        </span>
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
                                <p><strong>Nivel de Uso:</strong> <span class="badge bg-info">{{ getNivelUsoTexto(vehiculoSeleccionado.nivel_uso) }}</span></p>
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
                        <button type="button" class="btn btn-info" @click="generarPDF(vehiculoSeleccionado)">
                            <i class="bi bi-file-earmark-pdf me-2"></i>Descargar PDF
                        </button>
                        <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getArticulos } from "@/api/articulos.js";
import { useCestaStore } from "@/store/cesta";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logoCochesTeis.png";

const router = useRouter();

const vehiculos = ref([]);
const vehiculoSeleccionado = ref(null);
const cestaStore = useCestaStore();

onMounted(async () => {
    vehiculos.value = await getArticulos();
});

// Navegar a la vista detallada del vehículo
const locate = (id) => {
    router.push(`/ventas/${id}`);
};

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

// Devuelve el texto del nivel de uso
const getNivelUsoTexto = (nivel) => {
    const nivelNum = parseInt(nivel ?? 0);
    switch (nivelNum) {
        case 0:
            return "0 - Nuevo";
        case 1:
            return "1 - Excelente";
        case 2:
            return "2 - Bueno";
        case 3:
            return "3 - Regular";
        default:
            return "0 - Nuevo";
    }
};

// Generar PDF con información del vehículo
/**
 * Generar PDF con información completa del vehículo
 * Incluye logo, información general, características técnicas, ubicación y contacto
 */
const generarPDF = (vehiculo) => {
    const doc = new jsPDF();

    // Obtener fecha y hora actual
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    // Agregar logo
    try {
        doc.addImage(logo, "PNG", 14, 10, 25, 25);
    } catch (logoError) {
        console.warn("Error al cargar logo:", logoError);
    }

    // Encabezado con título principal
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185); // Azul
    doc.text("Ficha Técnica del Vehículo", 105, 20, { align: "center" });

    // Nombre del vehículo
    doc.setFontSize(16);
    doc.setTextColor(52, 73, 94);
    doc.text(`${vehiculo.marca} ${vehiculo.modelo}`, 105, 28, { align: "center" });

    // Fecha y hora
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado: ${fechaHora}`, 105, 34, { align: "center" });

    // Línea decorativa
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    // Información de la empresa
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("Coches Teis - Venta de Vehículos", 14, 44);
    doc.text("Avenida Galicia 101, Vigo - 36216", 14, 48);
    doc.text("Tlf: 986 666 333 - Email: info@cochesteis.com", 14, 52);

    // Sección: Información General
    let yPos = 62;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text("Información General", 14, yPos);

    yPos += 2;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.3);
    doc.line(14, yPos, 70, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(52, 73, 94);

    const infoGeneral = [
        ["Tipo:", vehiculo.tipo || "N/A"],
        ["Matrícula:", vehiculo.matricula || "N/A"],
        ["Marca:", vehiculo.marca || "N/A"],
        ["Modelo:", vehiculo.modelo || "N/A"],
        ["Año:", vehiculo.anio || "N/A"],
        ["Estado:", vehiculo.estado || "N/A"],
        ["Kilómetros:", `${vehiculo.kilometros || 0} km`],
        ["Nivel de Uso:", getNivelUsoTexto(vehiculo.nivel_uso)],
        ["Precio:", `${vehiculo.precio || 0}€`],
    ];

    autoTable(doc, {
        startY: yPos,
        body: infoGeneral,
        theme: "plain",
        styles: {
            fontSize: 10,
            cellPadding: 2,
        },
        columnStyles: {
            0: { 
                fontStyle: "bold", 
                textColor: [41, 128, 185],
                cellWidth: 35
            },
            1: { 
                textColor: [52, 73, 94]
            },
        },
        margin: { left: 14 },
    });

    // Sección: Características Técnicas
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text("Características Técnicas", 14, yPos);

    yPos += 2;
    doc.setLineWidth(0.3);
    doc.line(14, yPos, 90, yPos);

    yPos += 6;
    const caracteristicas = [
        ["Combustible:", vehiculo.combustible || "N/A"],
        ["Transmisión:", vehiculo.transmision || "N/A"],
        ["Potencia:", vehiculo.potencia_cv ? `${vehiculo.potencia_cv} CV` : "N/A"],
    ];

    autoTable(doc, {
        startY: yPos,
        body: caracteristicas,
        theme: "plain",
        styles: {
            fontSize: 10,
            cellPadding: 2,
        },
        columnStyles: {
            0: { 
                fontStyle: "bold", 
                textColor: [41, 128, 185],
                cellWidth: 35
            },
            1: { 
                textColor: [52, 73, 94]
            },
        },
        margin: { left: 14 },
    });

    // Sección: Ubicación y Contacto
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text("Ubicación y Contacto", 14, yPos);

    yPos += 2;
    doc.setLineWidth(0.3);
    doc.line(14, yPos, 75, yPos);

    yPos += 6;
    const ubicacionContacto = [
        ["Provincia:", vehiculo.ubicacion?.provincia || "N/A"],
        ["Ciudad:", vehiculo.ubicacion?.ciudad || "N/A"],
        ["Contacto:", vehiculo.contacto?.nombre || "N/A"],
        ["Teléfono:", vehiculo.contacto?.telefono || "N/A"],
        ["Email:", vehiculo.contacto?.email || "N/A"],
    ];

    autoTable(doc, {
        startY: yPos,
        body: ubicacionContacto,
        theme: "plain",
        styles: {
            fontSize: 10,
            cellPadding: 2,
        },
        columnStyles: {
            0: { 
                fontStyle: "bold", 
                textColor: [41, 128, 185],
                cellWidth: 35
            },
            1: { 
                textColor: [52, 73, 94]
            },
        },
        margin: { left: 14 },
    });

    // Descripción si existe
    if (vehiculo.descripcion) {
        yPos = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(41, 128, 185);
        doc.text("Descripción", 14, yPos);

        yPos += 2;
        doc.setLineWidth(0.3);
        doc.line(14, yPos, 50, yPos);

        yPos += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(52, 73, 94);
        
        const descripcionLines = doc.splitTextToSize(vehiculo.descripcion, 180);
        doc.text(descripcionLines, 14, yPos);
    }

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Página ${i} de ${pageCount} | Coches Teis © ${new Date().getFullYear()}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: "center" }
        );
    }

    // Guardar el PDF
    const nombreArchivo = `${vehiculo.marca}_${vehiculo.modelo}_${vehiculo.anio || ""}.pdf`.replace(/\s+/g, "_");
    doc.save(nombreArchivo);
};

</script>

<style scoped>
.card-title{
    font-weight: bold;
    text-transform: capitalize;
}
</style>