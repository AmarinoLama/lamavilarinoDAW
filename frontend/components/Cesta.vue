<template>
  <div class="container mt-4">
    <h2>Mi Cesta</h2>

    <div v-if="cesta.items.length === 0" class="alert alert-info">
      Tu cesta está vacía.
    </div>

    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cesta.items" :key="item.id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.precio }} €</td>
            <td>
              <button
                class="btn btn-sm btn-outline-secondary me-1"
                @click="decrementar(item.id)"
              >
                -
              </button>
              {{ item.cantidad }}
              <button
                class="btn btn-sm btn-outline-secondary ms-1"
                @click="incrementar(item.id)"
              >
                +
              </button>
            </td>
            <td>{{ (item.precio * item.cantidad).toFixed(2) }} €</td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="removeProducto(item.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <h5>Total: {{ cesta.totalPrecio }} €</h5>
        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-success"
            @click="iniciarPago"
            :disabled="cesta.items.length === 0 || !isLoggedIn"
            :title="!isLoggedIn ? 'Inicia sesión para poder pagar' : ''"
          >
            Pagar
          </button>
          <router-link
            v-if="!isLoggedIn"
            :to="{ name: 'Login', query: { redirect: 'cesta' } }"
            class="btn btn-outline-primary"
          >
            Iniciar sesión
          </router-link>
          <router-link
            v-if="!isLoggedIn"
            to="/clientes"
            class="btn btn-outline-success"
          >
            Registrarse
          </router-link>
        </div>
      </div>

      <p v-if="!isLoggedIn" class="text-danger mt-2 text-end">
        Debes iniciar sesión para poder pagar
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCestaStore } from "@/store/cesta";
import { loadStripe } from "@stripe/stripe-js";

const router = useRouter();
const cesta = useCestaStore();
const isLoggedIn = computed(() => !!sessionStorage.getItem("token"));

const incrementar = (id) => {
  cesta.incrementar(id);
};
const decrementar = (id) => {
  cesta.decrementar(id);
};
const removeProducto = (id) => {
  cesta.removeProducto(id);
};
const iniciarPago = async () => {
  // Requiere inicio de sesión
  const token = sessionStorage.getItem("token");
  if (!token) {
    // Guardar destino para volver tras login (opcional)
    sessionStorage.setItem("redirectAfterLogin", "cesta");
    router.push({ name: "Login", query: { redirect: "cesta" } });
    return;
  }

  console.log("init iniciarPago");
  const stripe = await loadStripe(
    "pk_test_51SplRDFdvASCSD5SvezJHglhPqpAqMK40g6pTRu0qenW6CDH1bepJrfa2oShlK7EOQLdVd2oM4OhCdlwIIbgrLRF00zKcFdIbg",
  );
  console.log("enviando al backend:", JSON.stringify({ items: cesta.items }));

  const response = await fetch("http://localhost:5000/crear-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cesta.items, amount: cesta.totalPrecio }),
  });

  const session = await response.json();
  console.log("Session response:", session);
  if (!session.url) {
    console.error("❌ No se recibió URL de Stripe", session);
    return;
  }

  // Guardar items en sessionStorage antes de ir a Stripe
  sessionStorage.setItem("cartItemsForInvoice", JSON.stringify(cesta.items));

  // Redirigir a Stripe Checkout
  window.location.href = session.url;
};
</script>

<style scoped></style>
