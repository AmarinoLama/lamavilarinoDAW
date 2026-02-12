<template>
  <div class="container vh-75 mt-5">
    <div class="row justify-content-center align-items-start">
      <div class="col-12 text-center mb-4">
        <h5 class="fw-bold text-uppercase text-primary position-relative d-inline-block">
          <i class="bi bi-people-fill me-2 fs-3"></i>
          Iniciar sesión
          <span class="underline-effect"></span>
        </h5>
      </div>

      <div class="col-12 col-md-6 mb-3">
        <div class="border p-4 shadow-sm rounded h-100">
          <form @submit.prevent="iniciarSesion">
            <div class="mb-3">
              <label for="dni" class="form-label fw-bold">DNI:</label>
              <input
                type="text"
                id="dni"
                autocomplete="off"
                @blur="capitalizarTexto"
                class="form-control text-center"
                v-model="dni"
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label fw-bold">Contraseña:</label>
              <input
                type="password"
                id="password"
                autocomplete="new-password"
                class="form-control"
                v-model="pass"
              />
            </div>

            <div class="text-center">
              <button type="submit" class="btn btn-primary w-50">
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-12 col-md-4 offset-md-1 mb-3">
        <div class="border p-3 rounded shadow-sm bg-light h-100">
          <h6 class="fw-bold">Credenciales de ejemplo</h6>
          <p class="mb-2"><strong>Administrador</strong></p>
          <ul class="list-unstyled mb-3">
            <li><strong>DNI:</strong> 55555555K</li>
            <li><strong>Password:</strong> abc123</li>
          </ul>

          <p class="mb-2"><strong>Usuario</strong></p>
          <ul class="list-unstyled">
            <li><strong>DNI:</strong> 12345678Z</li>
            <li><strong>Password:</strong> abc123</li>
          </ul>

          <small class="text-muted">Solo para pruebas en entorno local.</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// DEBE QUEDAR CLARO QUE ESTA É UNHA SIMULACIÓN DE LOGIN PARA FINS DIDÁCTICOS CON JSON-SERVER
// EN NINGÚN CASO DEBE USARSE ESTA IMPLEMENTACIÓN EN PRODUCCIÓN
// PARA UNHA APLICACIÓN REAL, O LOGIN DEBE XESTIONARSE NO LADO DO SERVIDOR CON HTTPS Y JWT SEGURO

import Swal from "sweetalert2";
import { loginUsuario } from "@/api/authApi.js";

export default {
  name: "TablaLogin",
  data() {
    return {
      dni: "",
      pass: "",
    };
  },

  methods: {
    async iniciarSesion() {
      try {
        this.dni = this.dni.toUpperCase().trim();
        this.pass = this.pass.trim();
        if (this.dni === "" || this.pass === "") {
          Swal.fire({
            title: "Campos vacíos",
            text: `Por favor, complete ambos campos`,
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
          return;
        }

        const data = await loginUsuario(this.dni, this.pass);

        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userName", data.nombre);
        sessionStorage.setItem("dni", this.dni);

        if (data.tipo === "admin") {
          sessionStorage.setItem("isAdmin", "true");
        } else {
          sessionStorage.setItem("isAdmin", "false");
        }

        Swal.fire({
          title: "Bienvenido",
          text: `Hola ${data.nombre}`,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        // Redirigir a la página de inicio y recargar con $router
        // $router se usa para evitar problemas de historial en SPA
        // window.location.reload() recarga la página para reflejar el estado autenticado
        const redirectQuery = this.$route?.query?.redirect;
        const redirectStorage = sessionStorage.getItem("redirectAfterLogin");
        let targetRoute = { name: "Inicio" };
        if (redirectQuery === "cesta" || redirectStorage === "cesta") {
          targetRoute = { name: "Cesta" };
        }
        sessionStorage.removeItem("redirectAfterLogin");
        this.$router.push(targetRoute).then(() => window.location.reload());
      } catch (error) {
        console.error("Error en iniciarSesion:", error);

        let mensajeError =
          "Error usuario o contraseña. Verifica tus credenciales.";

        // Mostrar mensaje específico según el error
        if (error.message === "Usuario no encontrado") {
          mensajeError = "El usuario no existe. Verifica tu DNI.";
        } else if (error.message === "Usuario inactivo") {
          mensajeError =
            "Tu cuenta está inactiva. Contacta con el administrador.";
        } else if (error.message === "Contraseña incorrecta") {
          mensajeError = "La contraseña es incorrecta.";
        }

        Swal.fire({
          title: "Error de autenticación",
          text: mensajeError,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
    // Función única: capitaliza y asigna en el mismo paso
    capitalizarTexto() {
      this.dni = this.dni.toUpperCase().trim();
    },
  },
};
</script>

<style>
.form-label {
  background-color: transparent !important;
  margin-bottom: 0.5rem;
}
</style>
