<template>
  <div class="container py-4">
    <h4
      class="text-center my-2 bg-primary-subtle text-primary p-3 rounded mb-4"
    >
      <i class="bi bi-newspaper"></i> Noticias
    </h4>
    <!-- Formulario de creación -->
    <form @submit.prevent="guardarNoticia" class="mb-4" v-if="isAdmin">
      <div class="card shadow-sm p-4 mb-5">
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
          <button type="submit" class="btn btn-primary fw-bold">
            {{ editando ? "Modificar" : "Publicar" }}
          </button>

          <button
            type="button"
            class="btn btn btn-primary ms-3 border-0 shadow-none rounded-0"
            @click="refrescarPagina"
            title="Refrescar Página"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
    </form>

    <!-- Noticias dinámicas -->
    <div
      v-for="noticia in noticias"
      :key="noticia._id"
      class="card mb-3 shadow-sm"
      @click="toggleNoticia(noticia._id)"
      :aria-expanded="String(expandidas.has(noticia._id))"
      role="button"
      tabindex="0"
    >
      <div
        class="card-header d-flex justify-content-between align-items-center bg-white border-bottom"
      >
        <h5 class="mb-0 text-primary fw-semibold">{{ noticia.titulo }}</h5>
        <div>
          <button
            @click.stop="eliminarNoticia(noticia._id)"
            class="btn btn-outline-danger btn-sm shadow-none rounded m-10"
            title="Eliminar noticia"
            aria-label="Eliminar noticia"
            v-if="isAdmin"
          >
            <i class="bi bi-trash"></i>
          </button>
          <small class="text-muted text-nowrap ms-3">
            <i class="bi bi-calendar-event me-1"></i>
            {{ formatearFecha(noticia.fecha_publicacion) }}
          </small>
        </div>
      </div>
      <div class="card-body">
        <transition name="fade" mode="out-in">
          <p
            :key="String(expandidas.has(noticia._id))"
            class="card-text mb-0 text-secondary lh-base"
          >
            {{
              expandidas.has(noticia._id)
                ? noticia.contenido
                : truncarTexto(noticia.contenido, 256)
            }}
          </p>
        </transition>

        <div
          v-if="noticia.contenido && noticia.contenido.length > 256"
          class="text-end mt-2"
        >
          <button
            class="btn btn-link p-0 text-primary fw-bold"
            @click.stop="toggleNoticia(noticia._id)"
            :aria-expanded="String(expandidas.has(noticia._id))"
          >
            {{ expandidas.has(noticia._id) ? "Ver menos ▲" : "Ver más ▼" }}
          </button>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-2"></div>
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
import {
  getNoticias,
  addNoticia,
  deleteNoticia,
  updateNoticia,
} from "@/api/noticias.js";
import { checkAdmin } from "@/api/authApi.js";

const noticias = ref([]);
const expandidas = ref(new Set());

const editando = ref(false);
const noticiaEditandoId = ref(null);

const isAdmin = ref(false);

const nuevaNoticia = ref({
  titulo: "",
  contenido: "",
  fecha_publicacion: "",
});

const noticiaVacia = ref({
  titulo: "",
  contenido: "",
  fecha_publicacion: "",
});

onMounted(async () => {

  const adminCheck = await checkAdmin();
  isAdmin.value = adminCheck.isAdmin;

  await cargarNoticias();
});

const updateTabla = async () => {
  await getNoticias().then((data) => {
    noticias.value = data.sort((a, b) => {
      const fechaA = new Date(a.fecha_publicacion);
      const fechaB = new Date(b.fecha_publicacion);
      return fechaB - fechaA; // Descendente: más nueva primero
    });
  });
};

const cargarNoticias = async () => {
  await updateTabla();
  Swal.fire({
    icon: "success",
    title: "Listando Noticias...",
    showConfirmButton: false,
    timer: 1500,
  });
};

const toggleNoticia = (id) => {
  if (expandidas.value.has(id)) expandidas.value.delete(id);
  else expandidas.value.add(id);
  expandidas.value = new Set(expandidas.value);
};

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";
  const date = new Date(fecha);
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("es-ES", opciones);
};

const truncarTexto = (texto, maxCaracteres) => {
  if (!texto || texto.length <= maxCaracteres) return texto;
  return texto.substring(0, maxCaracteres) + "...";
};

const refrescarPagina = async () => {
  editando.value = false;
  noticiaEditandoId.value = null;
  nuevaNoticia.value = { ...noticiaVacia };
};

const guardarNoticia = async () => {
  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar esta noticia?"
      : "¿Desea grabar esta noticia?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Grabar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    if (editando.value) {
      await updateNoticia(noticiaEditandoId.value, nuevaNoticia.value);

      Swal.fire({
        icon: "success",
        title: "Noticia modificada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const hoy = new Date();
      nuevaNoticia.value.fecha_publicacion = hoy.toISOString().split("T")[0];
      await addNoticia(nuevaNoticia.value);

      Swal.fire({
        icon: "success",
        title: "Noticia agregada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    nuevaNoticia.value = { titulo: "", contenido: "", fecha_publicacion: "" };
    editando.value = false;
    noticiaEditandoId.value = null;
    await updateTabla();
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

const editarNoticia = (id) => {
  const noticia = noticias.value.find((n) => n._id === id);

  if (!noticia) {
    Swal.fire({
      icon: "error",
      title: "Noticia no encontrada",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  nuevaNoticia.value = { ...noticia };
  editando.value = true;
  noticiaEditandoId.value = noticia._id;
};

const eliminarNoticia = async (id) => {
  noticias.value = await getNoticias();
  const noticiaAEliminar = noticias.value.find((noticia) => noticia._id === id);

  if (!noticiaAEliminar) {
    Swal.fire({
      icon: "error",
      title: "Noticia no encontrada",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  const result = await Swal.fire({
    title: `¿Eliminar la noticia ${noticiaAEliminar.titulo}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  await deleteNoticia(noticiaAEliminar._id);
  noticias.value = await getNoticias();

  Swal.fire({
    icon: "success",
    title: "Noticia eliminada",
    showConfirmButton: false,
    timer: 1500,
  });
};

function formatearFechaParaInput(fecha) {
  if (!fecha) return "";

  // Detecta formato dd/mm/yyyy
  if (fecha.includes("/")) {
    const [dd, mm, yyyy] = fecha.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  // Detecta formato yyyy-mm-dd
  if (fecha.includes("-")) {
    const partes = fecha.split("-");
    if (partes.length === 3) return fecha; // ya formato ISO
  }

  return "";
}
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
  border-radius: 12px;
  border: 1px solid rgba(16, 24, 40, 0.12);
  background: #fff;
  overflow: hidden;
}

.card + .card {
  margin-top: 1rem;
}

.card-header {
  background: transparent;
  border-bottom: 1px solid rgba(16, 24, 40, 0.12);
  padding: 0.85rem 1rem;
}

.card-body {
  padding: 1rem;
}

textarea,
input {
  border-radius: 10px;
}
</style>
