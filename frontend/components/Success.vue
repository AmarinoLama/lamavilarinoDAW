<template>
  <div class="success-wrapper">
    <div class="success-card">
      <!-- Icono -->
      <div class="icon-wrapper">
        <i class="bi bi-check-circle-fill"></i>
      </div>

      <h2 class="title">Pago realizado correctamente</h2>

      <p class="message">
        Tu pedido ha sido confirmado y procesado correctamente.
      </p>

      <div class="actions">
        <router-link
          to="/"
          class="btn btn-outline-primary border-1 shadow-none rounded-0"
        >
          Volver al inicio
        </router-link>

        <router-link
          to="/noticias"
          class="btn btn-primary border-0 shadow-none rounded-0"
        >
          Seguir comprando
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.success-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-card {
  border: 1px solid #e6e9f0;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  background-color: #fff;
  text-align: center;
}

.icon-wrapper {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.title {
  margin-bottom: 0.75rem;
}

.message {
  margin-bottom: 2rem;
  color: #6c757d;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>