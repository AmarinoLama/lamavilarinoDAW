<template>
  <div class="container py-4">
    <!-- Encabezado -->
    <div class="text-center mb-4">
      <h2 class="fw-bold text-primary">Gestión de Noticias</h2>
      <hr class="mx-auto" style="width: 60%; border-color: #4a6cf7" />
    </div>

    <!-- Formulario de creación -->
    <form @submit.prevent="guardarNoticia" class="mb-4">
      <div class="card shadow-sm p-4 mb-5">
        <h4 class="mb-3">Nueva Noticia</h4>

        <div class="mb-3">
          <label class="form-label fw-semibold">Título:</label>
          <input
            type="text"
            class="form-control"
            v-model="nuevaNoticia.titulo"
            placeholder="Introduce el título de la noticia"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Contenido:</label>
          <textarea
            class="form-control"
            rows="4"
            placeholder="Escribe el contenido de la noticia"
            v-model="nuevaNoticia.contenido"
            required
          ></textarea>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-primary fw-bold">GRABAR</button>
        </div>
      </div>
    </form>

    <!-- Listado de noticias -->
    <div class="text-center mb-3">
      <h5 class="fw-semibold">Noticias publicadas</h5>
      <p class="text-muted small mb-1">
        ORDENADAS EN ORDEN DECRECIENTE POR FECHA
      </p>
    </div>

    <!-- Noticias dinámicas -->
    <div
      v-for="noticia in noticias"
      :key="noticia.id"
      class="card mb-3 shadow-sm"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="fw-bold">{{ noticia.titulo }}</h6>
            <p class="mb-2">{{ noticia.contenido }}</p>
          </div>
          <span class="text-muted small">{{ noticia.fecha_publicacion }}</span>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-2">
          <button class="btn btn-sm btn-outline-secondary">Editar</button>
          <button class="btn btn-sm btn-outline-danger">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Si no hay noticias -->
    <div v-if="noticias.length === 0" class="text-center text-muted">
      <p>No hay noticias disponibles.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { getNoticias } from "@/api/noticias.js";

const noticias = ref([]);

const nuevaNoticia = ref({
  titulo: "",
  contenido: "",
});

onMounted(async () => {
  try {
    noticias.value = await getNoticias();
  } catch (error) {
    console.error("Error al cargar las noticias:", error);
  }
});

const guardarNoticia = async () => {
  try {
    //const noticiaAgregada = await addNoticia(nuevaNoticia.value);
    noticias.value.push(noticiaAgregada);
    Swal.fire({
      icon: "success",
      title: "Noticia agregada",
      showConfirmButton: false,
      timer: 1500,
    });

    nuevaNoticia.value = {
      titulo: "",
      contenido: "",
    };

    noticias.value = await getNoticias();
  } catch (error) {
    console.error("Error al guardar la noticia:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar la noticia",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.btn-primary {
  background-color: #4a6cf7;
  border: none;
}

.btn-primary:hover {
  background-color: #3a5de0;
}

.card {
  border-radius: 15px;
}

textarea,
input {
  border-radius: 10px;
}
</style>
