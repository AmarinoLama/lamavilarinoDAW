<template>
  <nav class="navbar navbar-dark bg-primary sticky-top navbar-expand-lg">
    <div class="container-fluid">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand ms-3">
        <img src="@/assets/logoCochesTeis.svg" alt="Coches Teis" class="logo" />
      </router-link>

      <!-- Botón hamburguesa -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Contenido colapsable -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- NAV CENTRADO -->
        <ul class="navbar-nav mx-auto gap-3 text-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="isLogueado" class="nav-link" to="/clientes"
              >Clientes</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/modelos">Modelos</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/taller">Taller</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ventas">Ventas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto">Contacto</router-link>
          </li>
        </ul>

        <!-- DROPDOWN DERECHA SIN ROMPER CENTRADO -->
        <div class="dropdown ms-auto">
          <span class="text-white" v-if="isLogueado">{{ userName }}</span>

          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person fs-2"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
            <li v-if="!isLogueado">
              <router-link class="dropdown-item" to="/login"
                >Acceso</router-link
              >
            </li>
            <li v-if="!isLogueado">
              <router-link class="dropdown-item" to="/clientes"
                >Registro</router-link
              >
            </li>
            <!-- Mostra “Cerrar Sesión” se está logueado -->
            <li v-if="isLogueado">
              <a class="dropdown-item" href="#" @click.prevent="logout"
                >Cerrar Sesión</a
              >
            </li>
            <li v-if="isLogueado">
              <router-link class="dropdown-item" to="/clientes"
                >Perfil</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { checkAdmin } from "@/api/authApi.js";

const isLogueado = ref(false);
const isAdmin = ref(false);
const isUsuario = ref(false);
const userName = ref("");

const actualizarNombreUsuario = () => {
  userName.value = sessionStorage.getItem("userName") || "";
};

onMounted(async () => {
  const adminCheck = await checkAdmin();
  isAdmin.value = adminCheck.isAdmin;

  isLogueado.value = sessionStorage.getItem("token") !== null;
  isUsuario.value = sessionStorage.getItem("isUsuario") === "true";
  userName.value = sessionStorage.getItem("userName") || "";

  // Escuchar evento de actualización de usuario
  window.addEventListener("userUpdated", actualizarNombreUsuario);
});

onUnmounted(() => {
  window.removeEventListener("userUpdated", actualizarNombreUsuario);
});

function logout() {
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("isUsuario");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("dni");
  sessionStorage.removeItem("isAdmin");

  isLogueado.value = false;
  userName.value = "";

  // Emitir evento para limpiar el formulario de clientes si está abierto
  window.dispatchEvent(new Event("userLoggedOut"));

  window.location.href = "/";
}
</script>

<style scoped>
.navbar {
  width: 100%;
  z-index: 1000;
}

.logo {
  height: 45px;
  width: auto;
}

.navbar-dark .nav-link {
  color: rgba(255, 255, 255, 0.9);
}

.navbar-dark .nav-link:hover,
.navbar-dark .nav-link:focus {
  color: #fff;
}
</style>
