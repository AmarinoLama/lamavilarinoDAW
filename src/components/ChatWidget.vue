<template>
  <div>
    <!-- Botón flotante -->
    <button
      class="btn btn-success rounded-circle shadow position-fixed d-flex align-items-center justify-content-center"
      style="bottom: 20px; right: 20px; width: 60px; height: 60px; z-index: 9999;"
      @click="toggleChat"
    >
    </button>

    <!-- Ventana del chat -->
    <div
      v-if="open"
      class="card shadow position-fixed"
      style="bottom: 90px; right: 20px; width: 320px; height: 450px; z-index: 9999; animation: slideUp .3s;"
    >
      <!-- Header -->
      <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <span>Asistente IA</span>
        <button class="btn-close btn-close-white" @click="toggleChat"></button>
      </div>

      <!-- Mensajes -->
      <div class="card-body overflow-auto" style="height: 330px;" ref="messageContainer">
        <div v-for="(msg,index) in messages" :key="index" class="mb-2">
          
          <!-- Usuario -->
          <div v-if="msg.from === 'user'" class="d-flex justify-content-end">
            <div class="p-2 px-3 bg-success text-white rounded-pill w-75 text-end">
              {{ msg.text }}
            </div>
          </div>

          <!-- Bot -->
          <div v-else class="d-flex align-items-start">
            <div class="p-2 px-3 bg-light border rounded-pill w-75">
              {{ msg.text }}
            </div>
          </div>
        </div>

        <!-- Indicador escribiendo -->
        <div v-if="typing" class="text-muted small ms-2">
          El bot está escribiendo...
        </div>
      </div>

      <!-- Input -->
      <div class="card-footer d-flex">
        <input
          type="text"
          class="form-control me-2"
          placeholder="Escribe un mensaje..."
          v-model="input"
          @keyup.enter="send"
        >
        <button class="btn btn-success" @click="send">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, nextTick } from "vue";
    import axios from "axios";

    const open = ref(false);
    const input = ref("");
    const typing = ref(false);
    const messages = ref([]);
    const messageContainer = ref(null);

    const toggleChat = () => {
      open.value = !open.value;
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      });
    };

    const send = async () => {
      if (!input.value.trim()) return;

      // Añadir mensaje del usuario
      messages.value.push({ from: "user", text: input.value });
      scrollToBottom();

      const userMessage = input.value;
      input.value = "";
      typing.value = true;

      try {
        // Llamada a la API del bot
        const response = await axios.post("https://api.example.com/chatbot", {
          message: userMessage,
        });

        setTimeout(() => {
          messages.value.push({ from: "bot", text: response.data.reply });
          typing.value = false;
          scrollToBottom();
        }, 600);

      } catch (error) {
        messages.value.push({ from: "bot", text: "Error al conectar con el bot." });
        typing.value = false;
        scrollToBottom();
      }
    };
</script>

<style>
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>