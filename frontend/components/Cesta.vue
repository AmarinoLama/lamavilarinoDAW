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
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cesta.items" :key="item.id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.precio }} €</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary me-1" @click="decrementar(item.id)">-</button>
                {{ item.cantidad }}
                <button class="btn btn-sm btn-outline-secondary ms-1" @click="incrementar(item.id)">+</button>
            </td>
            <td>{{ (item.precio * item.cantidad).toFixed(2) }} €</td>
            <td>
                <button class="btn btn-sm btn-danger" @click="removeProducto(item.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <h5>Total: {{ cesta.totalPrecio }} €</h5>
        <button class="btn btn-success" @click="iniciarPago">Pagar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { useCestaStore } from "@/store/cesta";
    const cesta = useCestaStore();

    const incrementar = (id) => {
        cesta.incrementar(id);
    };
    const decrementar = (id) => {
        cesta.decrementar(id);
    };
    const removeProducto = (id) => {
        cesta.removeProducto(id);
    };
    const iniciarPago = () => {
        console.log("Redirigiendo a pasarela de pago...");
        // A continuación se llamaría a la URL de pago o abrir la modal
        // window.location.href = "URL_DE_PASARELA";
    };
</script>

<style scoped></style>