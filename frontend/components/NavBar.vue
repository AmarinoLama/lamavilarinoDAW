<template>
  <nav class="navbar navbar-dark bg-primary sticky-top navbar-expand-lg">
    <div class="container-fluid">
      <!-- Logo izquierda (SIEMPRE fijo) -->
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
        <!-- NAV CENTRADO REAL -->
        <div class="navbar-center">
          <ul class="navbar-nav gap-3 text-center">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Inicio</router-link>
            </li>

            <li class="nav-item" v-if="isLogueado">
              <router-link class="nav-link" to="/clientes"
                >Clientes</router-link
              >
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/noticias"
                >Noticias</router-link
              >
            </li>

            <li class="nav-item" v-if="isAdmin">
              <router-link class="nav-link" to="/modelos">Modelos</router-link>
            </li>

            <li class="nav-item" v-if="isAdmin">
              <router-link class="nav-link" to="/taller">Taller</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/ventas">Ventas</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/contacto"
                >Contacto</router-link
              >
            </li>
          </ul>
        </div>

        <!-- Barra de búsqueda + Usuario derecha (SIEMPRE fijo) -->
        <div class="d-flex align-items-center ms-auto gap-3">
          <!-- Parte de la barra de búsqueda -->

          <form
            class="d-flex align-items-center"
            role="search"
            @submit.prevent="buscar"
          >
            <input
              class="form-control form-control-sm me-2 rounded-0"
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar"
              v-model="query"
              style="width: 140px"
            />
            <button class="btn btn-light btn-sm rounded-0" type="submit">
              <i class="bi bi-search"></i>
            </button>
          </form>

          <!-- Parte de la cesta de la compra -->

          <router-link
            to="/cesta"
            class="btn btn-primary position-relative ms-3 me-2"
            title="Cesta"
          >
            <i class="bi bi-cart3 fs-4"></i>
            <span
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              v-if="cesta.totalItems > 0"
            >
              {{  cesta.totalItems  }}
            </span>
          </router-link>

          <!-- Parte del usuario -->

          <div class="dropdown">
            <span class="text-white me-2" v-if="isLogueado">{{
              userName
            }}</span>

            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person fs-2"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-end">
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

              <li v-if="isLogueado">
                <a class="dropdown-item" href="#" @click.prevent="logout">
                  Cerrar Sesión
                </a>
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
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { checkAdmin } from "@/api/authApi.js";
import { useRouter } from "vue-router";
import { useCestaStore } from "@/store/cesta";

const cesta = useCestaStore();

const isLogueado = ref(false);
const isAdmin = ref(false);
const isUsuario = ref(false);
const userName = ref("");
const router = useRouter();
const query = ref("");

function buscar() {
  if (!query.value.trim()) return;

  router.push({
    name: "Buscar",
    query: { q: query.value.trim() },
  });

  query.value = "";
}

const actualizarNombreUsuario = () => {
  userName.value = sessionStorage.getItem("userName") || "";
};

onMounted(async () => {
  const adminCheck = await checkAdmin();
  isAdmin.value = adminCheck.isAdmin;

  isLogueado.value = sessionStorage.getItem("token") !== null;
  isUsuario.value = sessionStorage.getItem("isUsuario") === "true";
  userName.value = sessionStorage.getItem("userName") || "";

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

  window.dispatchEvent(new Event("userLoggedOut"));
  window.location.href = "/";
}
</script>

<style scoped>
.navbar {
  width: 100%;
  z-index: 1000;
  position: relative;
}

.logo {
  height: 45px;
  width: auto;
}

/* CENTRADO REAL */
.navbar-center {
  position: absolute;
  left: 46%;
  transform: translateX(-50%);
  display: flex;
}

@media (max-width: 991.98px) {
  /* En pantallas pequeñas permitimos que el nav colapsado se comporte de forma normal
     evitando que el centro absoluto solape la barra de búsqueda y el contenido derecho */
  .navbar-center {
    position: static;
    transform: none;
    display: flex;
    justify-content: flex-start;
    margin-right: auto;
  }

  /* Reducir el ancho del input de búsqueda en móviles para evitar solapamientos */
  form[role="search"] input[type="search"] {
    width: 100px !important;
  }
}

.navbar-nav {
  flex-direction: row;
}

.navbar-dark .nav-link {
  color: rgba(255, 255, 255, 0.9);
}

.navbar-dark .nav-link:hover,
.navbar-dark .nav-link:focus {
  color: #fff;
}
</style>
