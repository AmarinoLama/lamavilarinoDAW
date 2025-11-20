<template>
  <div class="my-1 p-3 border rounded-0 shadow-sm bg-light">
    <h4
      class="text-center my-2 bg-primary-subtle text-primary p-3 rounded mb-4"
    >
      <i class="bi bi-car-front me-2"></i> Citas Taller
    </h4>
    <form @submit.prevent="guardarCita" class="mb-4">
      <!-- Matrícula, movilCliente, fechaCita -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Matrícula -->
        <div class="col-md-3 d-flex align-items-center ms-5">
          <label for="matricula" class="form-label mb-0 text-nowrap w-25 me-2"
            >Matricula:</label
          >
          <input
            type="text"
            id="matricula"
            v-model="nuevaCita.matricula"
            class="form-control flex-grow-1"
            @blur="validarMatricula"
            required
          />
        </div>
        <!-- MovilCliente -->
        <div class="col-md-3 d-flex align-items-center">
          <label
            for="movilCliente"
            class="form-label mb-0 text-nowrap w-25 me-3 ms-5"
            >Móvil Cliente:</label
          >
          <input
            type="text"
            id="movilCliente"
            v-model="nuevaCita.movilCliente"
            class="form-control flex-grow-1"
            @blur="validarMovil"
            required
          />
        </div>
        <!-- Fecha Cita -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="fechaCita" class="form-label ms-5 me-3 mb-0 text-nowrap"
            >Fecha Cita:
          </label>
          <input
            type="date"
            id="fechaCita"
            v-model="nuevaCita.fechaCita"
            class="form-control w-auto"
            required
            oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
            oninput="this.setCustomValidity('')"
          />
        </div>
      </div>
      <!-- ServicioTaller, EstadoCita, Acepta -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- ServicioTaller -->
        <div class="col-md-4 d-flex align-items-center me-1">
          <label for="servicio" class="form-label me-4 ms-5 mb-0 text-nowrap"
            >Servicio del taller:</label
          >
          <select
            id="servicio"
            v-model="nuevaCita.servicioTaller"
            class="form-select flex-grow-1 w-25"
            required
          >
            <option disabled value="">Seleccione servicio</option>
            <option value="Revision">Revision</option>
            <option value="preITV">preITV</option>
            <option value="neumaticos">neumaticos</option>
            <option value="frenos">frenos</option>
            <option value="cambio_aceite">cambio de aceite</option>
          </select>
        </div>
        <!-- EstadoCita -->
        <div class="col-md-3 d-flex align-items-center me-5">
          <label for="estadoCita" class="form-label me-4 ms-5 mb-0 text-nowrap"
            >Estado Cita:</label
          >
          <input
            type="radio"
            name="estadoCita"
            id="estadoCita"
            value="pendiente"
            class="me-1"
            v-model="nuevaCita.estadoCita"
            checked
            required
          />
          <label class="me-4">Pendiente</label>
          <input
            type="radio"
            name="estadoCita"
            id="estadoCita"
            value="finalizado"
            class="me-1"
            v-model="nuevaCita.estadoCita"
            required
          />
          <label>Finalizado</label>
        </div>
        <!-- Aceptar condiciones y términos (centro absoluto) -->
        <div class="col-md-3 d-flex align-items-center me-5">
          <div class="form-check d-flex align-items-center">
            <input
              type="checkbox"
              id="acepta"
              class="form-check-input me-2"
              v-model="nuevaCita.acepta"
              required
            />
            <label for="acepta" class="form-check-label mb-0 text-nowrap">
              Aceptar presupuesto
            </label>
          </div>
        </div>
      </div>
      <!-- Botón centrado (centro) -->
      <div class="d-flex justify-content-center">
        <button
          type="submit"
          class="btn btn-primary border-0 shadow-none rounded-0 me-3"
        >
          Guardar
        </button>
        <button
          type="button"
          class="btn btn btn-primary me-4 border-0 shadow-none rounded-0 m"
          @click="refrescarPagina"
          title="Refrescar Página"
        >
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </form>
    <div class="table-responsive">
      <h4 class="text-center w-100">Listado Citas</h4>
      <table class="table table-bordered table-striped w-100 align-middle">
        <thead class="table-primary">
          <tr>
            <th class="text-center">ID</th>
            <th class="text-center">Fecha Cita</th>
            <th class="text-center">Matricula</th>
            <th class="text-center">Móvil</th>
            <th class="text-center">Servicio</th>
            <th class="text-center">Estado Cita</th>
            <th class="text-center" style="width: 170px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cita, index) in citasPaginadas" :key="index">
            <td class="text-center">{{ cita.id }}</td>
            <td class="text-center">{{ cita.fechaCita }}</td>
            <td class="text-center">{{ cita.matricula }}</td>
            <td class="text-center">{{ cita.movilCliente }}</td>
            <td class="text-center">{{ cita.servicioTaller }}</td>
            <td class="text-center">{{ cita.estadoCita }}</td>
            <td class="text-nowrap text-start">
              <button
                @click="editarCita(cita.id)"
                class="btn btn-warning btn-sm border-0 shadow-none rounded-1 ms-4"
                title="Editar cita"
                aria-label="Editar cita"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                @click="eliminarCita(cita.id)"
                class="btn btn-danger btn-sm ms-4 border-0 shadow-none rounded-1"
                title="Eliminar cliente"
                aria-label="Eliminar cita"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { getCitas, addCita, deleteCita } from "@/api/citas.js";
import { getClientes } from "@/api/clientes.js";

const citaVacia = {
  matricula: "",
  movilCliente: "",
  fechaCita: "",
  servicioTaller: "",
  estadoCita: "",
  acepta: false,
};

const numCitas = ref(0);
const currentPage = ref(1);
const citasPorPage = 5;

const nuevaCita = ref({ ...citaVacia });
const citas = ref([]);

onMounted(async () => {
  cargarCitas();
});

const cargarCitas = async () => {
  getCitas().then((data) => {
    citas.value = data;
    numCitas.value = data.length;
    currentPage.value = 1;
  });
  Swal.fire({
    icon: "success",
    title: "Listando Citas...",
    showConfirmButton: false,
    timer: 1500,
  });
};

const guardarCita = async () => {
  if (!validarMovil()) {
    Swal.fire({
      icon: "error",
      title: "Hay campos inválidos",
      text: "El móvil no existe",
      showConfirmButton: true,
    });
    return;
  }
  if (!validarMatricula()) {
    Swal.fire({
      icon: "error",
      title: "Hay campos inválidos",
      text: "Corrija la matrícula",
      showConfirmButton: true,
    });
    return;
  }

  const result = await Swal.fire({
    title: "¿Desea grabar esta cita?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Grabar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    const citaAgregada = await addCita(nuevaCita.value);
    citas.value.push(citaAgregada);
    Swal.fire({
      icon: "success",
      title: "Cita agregada",
      showConfirmButton: false,
      timer: 1500,
    });

    // Reset formulario y estado
    nuevaCita.value = { ...citaVacia };

    citas.value = await getCitas();
  } catch (error) {
    console.error("Error al guardar la cita:", error);
    Swal.fire({
      icon: "error",
      title: "Error al guardar la cita",
      text: "Inténtelo de nuevo o contacte con el administrador.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

const beforePagina = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPagina = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const citasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * citasPorPage;
  const end = start + citasPorPage;
  return citas.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(numCitas.value / citasPorPage);
});

const eliminarCita = async (id) => {
  citas.value = await getCitas();

  const citaAEliminar = citas.value.find((cita) => cita.id === id);

  if (!citaAEliminar) {
    Swal.fire({
      icon: "error",
      title: "Cita no encontrada",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  // Pedir confirmación antes de eliminar
  const result = await Swal.fire({
    title: `¿Eliminar la cita del coche con la mátricuña ${citaAEliminar.matricula}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  // Si no confirma, salir
  if (!result.isConfirmed) return;

  // Si confirma, eliminar cliente usando la API y movil como ID
  await deleteCita(citaAEliminar.id);
  citas.value = await getCitas();

  Swal.fire({
    icon: "success",
    title: "Cita eliminada",
    showConfirmButton: false,
    timer: 1500,
  });
};

const editarCita = (id) => {
  const cita = citas.value.find((c) => c.id === id);

  if (!cita) {
    Swal.fire({
      icon: "error",
      title: "Cita no encontrada",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  nuevaCita.value = { ...cita };

  nuevaCita.value.fechaCita = formatearFechaParaInput(cita.fechaCita);
};

const refrescarPagina = () => {
  nuevaCita.value = { ...citaVacia };
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

const validarMatricula = () => {
  const matricula = nuevaCita.value.matricula;
  console.log(matricula.length);
  return matricula.length <= 10;
};

// Por algún motivo esto no va
const validarMovil = async () => {
  const clientes = await getClientes();
  const telefono = nuevaCita.value.movil;
  for (let cliente of clientes) {
    console.log(cliente.movil == telefono)
    // if (cliente.movil === movil) {
    //   console.log("se encontró");
    //   return true;
    // }
  }
  console.log("devuelvo false");
  return false;
};
</script>

<style scoped></style>
