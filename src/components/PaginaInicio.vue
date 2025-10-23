<template>
  <div class="video-background">
    <video
      src="@/assets/cars_video.mp4"
      autoplay
      loop
      muted
      playsinline
      class="video-bg"
    ></video>
    <transition name="fade">
      <div class="content" v-if="showContent">
        <h2>Bienvenido a la página de inicio</h2>
        <p>Navega a tu gusto por nuestra web</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showContent = ref(true);

onMounted(() => {
  setTimeout(() => {
    showContent.value = false;
  }, 3000); // Oculta el contenido tras 3 segundos
});
</script>

<style scoped>
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vh;
  height: 100vw;
  object-fit: cover;
  transform: translate(-50%, -50%) rotate(-90deg);
  z-index: -1;
}

.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 80, 200, 0.7);
  border-radius: 18px;
  padding: 2.5rem 4rem;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  min-width: 320px;
  min-height: 120px;
}

.content h2 {
  margin: 0;
  color: #fff;
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: center;
}

.content p {
  color: #fff;
  font-size: 1.2rem;
  margin-top: 1rem;
  text-align: center;
  letter-spacing: 0.5px;
}

/* Transición fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
