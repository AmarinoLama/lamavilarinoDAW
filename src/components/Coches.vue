<template>
  <div class="my-1 p-3 border rounded-0 shadow-sm bg-light">
    <h4
      class="text-center my-2 bg-primary-subtle text-primary p-3 rounded mb-4"
    >
      <i class="bi bi-car-front-fill me-2"></i> Registro de Coches
    </h4>

    <form @submit.prevent="guardarCoche" class="mb-4">
      <!-- matricula / model / tipoDeposito -->
      <div class="mb-3 row align-items-center">
        <!-- Columna Matricula -->
        <div class="col-md-4 d-flex align-items-center">
          <label for="dni" class="form-label mb-0 w-25">Matricula: </label>
          <div class="flex-grow-1 d-flex align-items-center">
            <input
              type="text"
              id="matricula"
              v-model="nuevoCoche.matricula"
              class="form-control w-auto w-25 text-center ms-2"
              :class="[{ 'readonly-input': editando }]"
              :readonly="editando"
              required
            />
          </div>
        </div>

        <!-- Modelo del coche -->
        <div class="col-md-3 d-flex align-items-center me-1">
          <label for="modelo" class="form-label me-4 ms-5 mb-0 text-nowrap"
            >Modelo:</label
          >
          <select
            id="modelo"
            v-model="nuevoCoche.modelo"
            class="form-select flex-grow-1 w-25"
          >
            <option disabled value="">Seleccione provincia</option>
            <option value="Opel">Opel</option>
            <option value="Citroen">Citroen</option>
            <option value="Volvo">Volvo</option>
            <option value="Kawasakiu">Kawasaki</option>
          </select>
        </div>

        <!-- Tipo depósito -->
        <div class="col-md-3 d-flex align-items-center me-5">
          <label
            for="tipoDeposito"
            class="form-label me-4 ms-5 mb-0 text-nowrap"
            >Tipo Depósito:</label
          >
          <input
            type="radio"
            name="tipoDeposito"
            id="tipoDeposito"
            value="diesel"
            class="me-1"
            v-model="nuevoCoche.tipoDeposito"
            checked
            required
          />
          <label class="me-4">Diesel</label>
          <input
            type="radio"
            name="tipoDeposito"
            id="tipoDeposito"
            value="gasoil"
            class="me-1"
            v-model="nuevoCoche.tipo"
            required
          />
          <label>Gasoil</label>
        </div>
      </div>
      <!-- dueño / descripcion -->
      <div class="mb-3 row align-items-center">
        <!-- dueño -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="dueno" class="form-label mb-0 text-nowrap w-25"
            >Dueño:</label
          >
          <input
            type="text"
            id="dueno"
            v-model="nuevoCoche.dueno"
            class="form-control flex-grow-1"
            required
          />
        </div>

        <!-- descripcion -->
        <div class="col-md-5 d-flex align-items-center">
          <label class="form-label">Descipcion:</label>
          <textarea
            class="form-control ms-2"
            rows="4"
            placeholder="Escribe el contenido de la descripcion"
            v-model="nuevoCoche.descripcion"
            required
          ></textarea>
        </div>
      </div>

      <!-- alta / itv / histórico (coches rotos) -->
      <div class="mb-3 row align-items-center">
        <!-- alta  -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="fecha_alta" class="form-label ms-5 me-3 mb-0 text-nowrap"
            >Fecha de Alta:
          </label>
          <input
            type="date"
            id="fecha_alta"
            v-model="nuevoCoche.fecha_alta"
            class="form-control w-auto"
            required
          />
        </div>

        <!-- Tiene itv -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="itv" class="form-check-label mb-0 text-nowrap">
            ITV:
          </label>
          <input
            type="checkbox"
            id="itv"
            class="form-check-input me-5 ms-2"
            v-model="nuevoCoche.ITV"
          />
        </div>

        <!-- Histórico (coches rotos) -->
        <div class="col-md-3 d-flex align-items-center">
          <div class="form-switch d-flex align-items-center">
            <input
              type="checkbox"
              id="historico"
              v-model="mostrarHistorico"
              class="form-check-input me-2"
              @change="cargarCoches"
            />
            <label for="historico" class="form-check-label mb-0"
              >Ver coches rotos</label
            >
          </div>
        </div>

        <!-- Botón guardar -->
        <div class="d-flex justify-content-center align-items-center">
          <button
            type="submit"
            class="btn btn-primary border-0 shadow-none rounded-0"
          >
            {{ editando ? "Modificar Coche" : "Registrar" }}
          </button>
          <button
            class="btn btn-primary border-0 shadow-none rounded-0 ms-3"
            type="reset"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
    </form>
    <!-- Lista de Coches -->
    <div class="table-responsive">
      <h4 class="text-center w-100">Listado Coches</h4>
      <table class="table table-bordered table-striped w-100 align-middle">
        <thead class="table-primary">
          <tr>
            <th class="text-center">Matricula</th>
            <th class="text-center">Modelo</th>
            <th class="text-center">Depósito</th>
            <th class="text-center">ITV</th>
            <th class="text-center">Fecha Alta</th>
            <th class="text-center" style="width: 170px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(coche, index) in cochesPaginados" :key="index">
            <td>{{ coche.matricula }}</td>
            <td>{{ coche.modelo }}</td>
            <td class="text-center">{{ coche.tipo }}</td>
            <td class="text-center">{{ coche.ITV }}</td>
            <td class="text-center">{{ coche.fecha_alta }}</td>
            <td class="text-center text-start">
              <button
                @click="editarCoche(coche.matricula)"
                class="btn btn-warning btn-sm border-0 shadow-none rounded-1"
                title="Editar coche"
                aria-label="Editar coche"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                @click="eliminarCoche(coche.matricula)"
                class="btn btn-danger btn-sm ms-4 me-2 border-0 shadow-none rounded-1"
                title="Eliminar coche"
                aria-label="Eliminar coche"
              >
                <i
                  class="bi bi-exclamation-octagon-fill"
                  title="Marcar coche como roto"
                  aria-label="Marcar coche como roto"
                ></i>
              </button>
              <button
                v-if="coche.roto == true"
                @click="arreglarCoche(coche)"
                class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-1"
                title="Activar coche"
              >
                <i class="bi bi-tools"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Navegación de página-->
      <div class="d-flex justify-content-center my-3">
        <button
          class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none"
          @click="beforePagina"
          :disabled="currentPage <= 1"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <span class="mx-3 align-self-center text-muted"
          >Página {{ currentPage }}</span
        >
        <button
          class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none"
          @click="nextPagina"
          :disabled="currentPage >= totalPages"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import {
  getCoches,
  addCoche,
  updateCoche,
  darBajaCoche,
} from "@/api/coches.js";

const cocheVacio = {
  matricula: "",
  modelo: "",
  tipo: "",
  dueno: "",
  descripcion: "",
  fecha_alta: "",
  ITV: true,
  roto: false, // para gestionar el histórico
};

const nuevoCoche = ref({ ...cocheVacio });

// Edición
const editando = ref(false);
const cocheEditandoId = ref(null);

// Paginacion
const numCoches = ref(0);
const currentPage = ref(1);
const cochesPorPage = 10;

// Visualización tabla
const coches = ref([]);
const mostrarHistorico = ref(false);

onMounted(async () => {
  cargarCoches();
});

const cargarCoches = () => {
  getCoches(mostrarHistorico.value).then((data) => {
    coches.value = data;
    numCoches.value = data.length;
    currentPage.value = 1;
  });
  Swal.fire({
    icon: "success",
    title: "Listando Coches...",
    showConfirmButton: false,
    timer: 1500,
  });
};

const guardarCoche = async () => {
  if (!editando.value) {
    const duplicado = coches.value.find(
      (coche) => coche.matricula === nuevoCoche.value.matricula
    );
    if (duplicado) {
      Swal.fire({
        icon: "error",
        title: "Matrícula duplicada",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
  }

  const result = await Swal.fire({
    title: editando.value
      ? "¿Desea modificar este coche?"
      : "¿Desea grabar este coche?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: editando.value ? "Modificar" : "Registrar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    if (editando.value) {
      const cocheActualizado = await updateCoche(
        cocheEditandoId.value,
        nuevoCoche.value
      );

      const index = coches.value.findIndex(
        (c) => c.id === cocheEditandoId.value
      );
      if (index !== -1) coches.value[index] = cocheActualizado;
      Swal.fire({
        icon: "success",
        title: "Coche modificado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const cocheAgregado = await addCoche(nuevoCoche.value);
      coches.value.push(cocheAgregado);
      Swal.fire({
        icon: "success",
        title: "Coche agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    nuevoCoche.value = { ...cocheVacio };

    editando.value = false;
    cocheEditandoId.value = null;

    coches.value = await getCoches();
  } catch (error) {
    console.error("Error al guardar coche:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar coche",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

// Función Editar Coche
const editarCoche = (matricula) => {
  const coche = coches.value.find((c) => c.matricula === matricula);

  if (!coche) {
    Swal.fire({
      icon: "error",
      title: "Coche no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  nuevoCoche.value = { ...coche };
  editando.value = true;
  nuevoCoche.value.fecha_alta = formatearFechaParaInput(coche.fecha_alta);
  cocheEditandoId.value = coche.id;
};

const eliminarCoche = async (matricula) => {
  coches.value = await getCoches();

  const cocheAEliminar = coches.value.find(
    (coche) => coche.matricula === matricula
  );

  if (!cocheAEliminar) {
    Swal.fire({
      icon: "error",
      title: "Coche no encontrado",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  const result = await Swal.fire({
    title: `¿Marcar como roto al coche con la matrícula ${cocheAEliminar.matricula}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, está roto",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  await darBajaCoche(cocheAEliminar.id);

  coches.value = await getCoches();

  Swal.fire({
    icon: "success",
    title: "Coche marcado como roto",
    showConfirmButton: false,
    timer: 1500,
  });
};

const cochesPaginados = computed(() => {
  const start = (currentPage.value - 1) * cochesPorPage;
  const end = start + cochesPorPage;
  return coches.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(numCoches.value / cochesPorPage);
});

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
.form-control {
  width: 100%;
}
</style>
