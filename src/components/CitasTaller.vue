<template>
  <div class="my-1 p-3 border rounded-0 shadow-sm bg-light">
    <h4
      class="text-center my-2 bg-primary-subtle text-primary p-3 rounded mb-4"
    >
      <i class="bi bi-car-front me-2"></i> Taller
    </h4>
    <!-- Matrícula, movilCliente, fechaCita -->
    <div class="mb-3 row g-3 align-items-center">
      <!-- Matrícula -->
      <div class="col-md-3 d-flex align-items-center">
        <label for="matricula" class="form-label mb-0 text-nowrap w-25 me-2"
          >Matricula:</label
        >
        <input
          type="text"
          id="matricula"
          v-model="nuevaCita.matricula"
          class="form-control flex-grow-1"
          required
        />
      </div>
      <!-- Matrícula -->
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
          v-model="nuevaCita.fecha_alta"
          class="form-control w-auto"
          required
          oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
          oninput="this.setCustomValidity('')"
        />
      </div>
    </div>
    <!-- ServicioTaller, EstadoCita, Acepta -->
    <div class="mb-3 row g-3 align-items-center">
        
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";

const citaVacia = {
  matricula: "",
  movilCliente: "",
  fechaCita: "",
  servicioTaller: "",
  estadoCita: "",
  acepta: false,
};

const nuevaCita = ref({ ...citaVacia });
</script>

<style scoped></style>
