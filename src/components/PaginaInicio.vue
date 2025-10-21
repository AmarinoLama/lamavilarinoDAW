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
    <div class="content">
      <h2>Bienvenido a la página de inicio</h2>
    </div>
  </div>
</template>
<script setup></script>
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
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  object-fit: cover;
  transform: translate(-50%, -50%) rotate(-90deg);
  z-index: -1;
}

.content {
  position: relative;
  z-index: 2;
  display: flex;
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
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
