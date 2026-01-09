<!-- Código sin usar -->

<template>
  <div class="chat-container">
    <!-- Botón flotante para abrir/cerrar el chat -->
    <button
      v-if="!isChatOpen"
      @click="toggleChat"
      class="chat-button"
      title="Chat con IA"
    >
      <i class="bi bi-chat-dots-fill"></i>
    </button>

    <!-- Ventana del chat -->
    <div v-if="isChatOpen" class="chat-window">
      <!-- Header del chat -->
      <div class="chat-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-robot me-2"></i>
          <span class="fw-bold">Asistente Virtual</span>
        </div>
        <button @click="toggleChat" class="btn-close-chat">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Mensajes -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.type]"
        >
          <div class="message-content">
            <div class="message-avatar">
              <i
                :class="
                  msg.type === 'user' ? 'bi bi-person-fill' : 'bi bi-robot'
                "
              ></i>
            </div>
            <div class="message-text">
              {{ msg.text }}
            </div>
          </div>
          <div class="message-time">{{ msg.time }}</div>
        </div>

        <!-- Indicador de escritura -->
        <div v-if="isTyping" class="message bot">
          <div class="message-content">
            <div class="message-avatar">
              <i class="bi bi-robot"></i>
            </div>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input para escribir -->
      <div class="chat-input">
        <input
          v-model="userMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Escribe tu mensaje..."
          :disabled="isTyping"
        />
        <button
          @click="sendMessage"
          :disabled="!userMessage.trim() || isTyping"
          class="btn-send"
        >
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";

const isChatOpen = ref(false);
const userMessage = ref("");
const messages = ref([
  {
    type: "bot",
    text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
    time: getCurrentTime(),
  },
]);
const isTyping = ref(false);
const messagesContainer = ref(null);

function toggleChat() {
  isChatOpen.value = !isChatOpen.value;
  if (isChatOpen.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendMessage() {
  if (!userMessage.value.trim()) return;

  // Agregar mensaje del usuario
  messages.value.push({
    type: "user",
    text: userMessage.value,
    time: getCurrentTime(),
  });

  const messageToSend = userMessage.value;
  userMessage.value = "";

  await nextTick();
  scrollToBottom();

  // Mostrar indicador de escritura
  isTyping.value = true;

  try {
    // Llamar al backend
    const response = await axios.post("http://localhost:5000/ia", {
      message: messageToSend,
    });

    // Agregar respuesta del bot
    messages.value.push({
      type: "bot",
      text: response.data.reply,
      time: getCurrentTime(),
    });
  } catch (error) {
    console.error("Error completo:", error);
    let errorMessage = "Lo siento, ha ocurrido un error. ";

    if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      errorMessage +=
        "No se puede conectar al servidor. Asegúrate de que el servidor esté corriendo en el puerto 5000.";
    } else if (error.response) {
      errorMessage += `Error del servidor: ${
        error.response.data.error || error.response.statusText
      }`;
    } else {
      errorMessage += "Por favor, inténtalo de nuevo.";
    }

    messages.value.push({
      type: "bot",
      text: errorMessage,
      time: getCurrentTime(),
    });
  } finally {
    isTyping.value = false;
    await nextTick();
    scrollToBottom();
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}
</script>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.chat-window {
  width: 380px;
  height: 550px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-close-chat {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  transition: opacity 0.2s;
}

.btn-close-chat:hover {
  opacity: 0.8;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.message {
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-content {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message.user .message-avatar {
  background: #667eea;
  color: white;
}

.message.bot .message-avatar {
  background: #e9ecef;
  color: #764ba2;
}

.message-text {
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 75%;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-text {
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #718096;
  margin-top: 4px;
  padding: 0 42px;
}

.message.user .message-time {
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e0;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e0;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.chat-input input:focus {
  border-color: #667eea;
}

.chat-input input:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.btn-send {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
  }
}
</style>
