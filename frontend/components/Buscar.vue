<template>
  <div class="container mt-5">
    <h2>Resultados de búsqueda: "{{ searchTerm }}"</h2>

    <!-- Resultados de Clientes -->
    <div v-if="clientes.length > 0" class="mt-4">
      <h3>Clientes ({{ clientes.length }})</h3>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Móvil</th>
              <th>Provincia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientes" :key="cliente.id">
              <td v-html="highlightMatch(cliente.dni)"></td>
              <td v-html="highlightMatch(cliente.nombre)"></td>
              <td v-html="highlightMatch(cliente.apellidos)"></td>
              <td v-html="highlightMatch(cliente.email)"></td>
              <td v-html="highlightMatch(cliente.movil)"></td>
              <td v-html="highlightMatch(cliente.provincia)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Resultados de Noticias -->
    <div v-if="noticias.length > 0" class="mt-4">
      <h3>Noticias ({{ noticias.length }})</h3>
      <div class="row">
        <div
          v-for="noticia in noticias"
          :key="noticia.id"
          class="col-md-4 mb-3"
        >
          <div class="card">
            <img
              v-if="noticia.imagen"
              :src="noticia.imagen"
              class="card-img-top"
              alt="Imagen noticia"
            />
            <div class="card-body">
              <h5
                class="card-title"
                v-html="highlightMatch(noticia.titulo)"
              ></h5>
              <p class="card-text" v-html="highlightMatch(noticia.resumen)"></p>
              <small class="text-muted">{{ noticia.fecha }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="clientes.length === 0 && noticias.length === 0" class="mt-4">
      <div class="alert alert-info">
        No se encontraron resultados para "{{ searchTerm }}"
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const searchTerm = ref("");
const clientes = ref([]);
const noticias = ref([]);
const isLogueado = ref(false);

// Verificar si el usuario está logueado
const verificarSesion = () => {
  const token = sessionStorage.getItem("token");
  isLogueado.value = !!token;
};

// Función para resaltar coincidencias
const highlightMatch = (text) => {
  if (!text || !searchTerm.value) return text || "";

  const textStr = String(text);
  const regex = new RegExp(`(${searchTerm.value})`, "gi");
  return textStr.replace(regex, '<span class="highlight-match">$1</span>');
};

// Función para buscar clientes (solo si está logueado)
const buscarClientes = async (termino) => {
  if (!isLogueado.value) {
    clientes.value = [];
    return;
  }

  try {
    const response = await axios.get(`http://localhost:3000/clientes`);
    const terminoLower = termino.toLowerCase();

    // Filtramos localmente por todos los campos relevantes
    clientes.value = response.data.filter((cliente) => {
      // Convertimos todo a string para evitar errores con null/undefined
      const dni = String(cliente.dni || "").toLowerCase();
      const nombre = String(cliente.nombre || "").toLowerCase();
      const apellidos = String(cliente.apellidos || "").toLowerCase();
      const email = String(cliente.email || "").toLowerCase();
      const movil = String(cliente.movil || "").toLowerCase();
      const provincia = String(cliente.provincia || "").toLowerCase();
      const municipio = String(cliente.municipio || "").toLowerCase();

      return (
        dni.includes(terminoLower) ||
        nombre.includes(terminoLower) ||
        apellidos.includes(terminoLower) ||
        email.includes(terminoLower) ||
        movil.includes(terminoLower) ||
        provincia.includes(terminoLower) ||
        municipio.includes(terminoLower)
      );
    });
  } catch (error) {
    console.error("Error al buscar clientes:", error);
  }
};

// Función para buscar noticias
const buscarNoticias = async (termino) => {
  try {
    const response = await axios.get(`http://localhost:3000/noticias`);
    const terminoLower = termino.toLowerCase();

    // Filtramos localmente por título o resumen
    noticias.value = response.data.filter((noticia) => {
      const titulo = String(noticia.titulo || "").toLowerCase();
      const resumen = String(noticia.resumen || "").toLowerCase();
      const contenido = String(noticia.contenido || "").toLowerCase();

      return (
        titulo.includes(terminoLower) ||
        resumen.includes(terminoLower) ||
        contenido.includes(terminoLower)
      );
    });
  } catch (error) {
    console.error("Error al buscar noticias:", error);
  }
};

// Función principal de búsqueda
const realizarBusqueda = async () => {
  searchTerm.value = route.query.q || "";
  if (searchTerm.value) {
    verificarSesion();
    await buscarClientes(searchTerm.value);
    await buscarNoticias(searchTerm.value);
  }
};

// Watch para detectar cambios en la query (si buscamos desde el mismo componente)
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      realizarBusqueda();
    }
  }
);

// Ejecutar búsqueda al montar el componente
onMounted(() => {
  realizarBusqueda();
});
</script>

<style scoped>
h2 {
  color: #0d6efd;
  margin-bottom: 2rem;
}

h3 {
  color: #495057;
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.card {
  height: 100%;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

/* Estilo para resaltar coincidencias */
:deep(.highlight-match) {
  background-color: #ffeb3b;
}

.table {
  background: white;
}

.table td {
  vertical-align: middle;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #0056b3;
}
</style>
