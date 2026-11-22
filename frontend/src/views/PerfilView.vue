<template>
  <div class="profile-card">
    <h2>👤 Mi Perfil de Jugador</h2>
    <div v-if="cargando" class="loading">Cargando datos del perfil...</div>
    <div v-else-if="perfil" class="info-list">
      <div class="row">
        <span>Nombre:</span>
        <strong>{{ perfil.nombre }}</strong>
      </div>
      <div class="row">
        <span>Alias:</span>
        <strong class="tag">@{{ perfil.alias }}</strong>
      </div>
      <div class="row">
        <span>Correo:</span>
        <strong>{{ perfil.correo }}</strong>
      </div>
      <div class="row">
        <span>Rol en GameHub:</span>
        <strong class="role">{{ perfil.rol }}</strong>
      </div>
      <div class="row">
        <span>Estado:</span>
        <span class="badge-active">{{ perfil.activo ? 'Activo' : 'Inactivo' }}</span>
      </div>
      <form @submit.prevent="guardar">
        <label>Nombre <input v-model.trim="perfil.nombre" required minlength="2" maxlength="100" /></label>
        <label>Alias <input v-model.trim="perfil.alias" required minlength="2" maxlength="50" /></label>
        <label>Correo <input v-model.trim="perfil.correo" type="email" required /></label>
        <button class="button" :disabled="guardando">Guardar perfil</button>
      </form>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="mensaje" role="status">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { api } from '../services/api'
import { ref, onMounted } from 'vue'

const perfil = ref(null)
const cargando = ref(true)
const guardando = ref(false)
const error = ref('')
const mensaje = ref('')

onMounted(async () => {
  try {
    perfil.value = await api('/usuarios/perfil')
  } catch (cause) {
    error.value = cause.message
  } finally {
    cargando.value = false
  }
})

async function guardar() {
  guardando.value = true
  error.value = ''
  mensaje.value = ''
  try {
    const { nombre, alias, correo } = perfil.value
    perfil.value = await api('/usuarios/perfil', {
      method: 'PATCH', body: JSON.stringify({ nombre, alias, correo }),
    })
    localStorage.setItem('usuario', JSON.stringify(perfil.value))
    mensaje.value = 'Perfil actualizado.'
  } catch (cause) {
    error.value = cause.message
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.profile-card {
  max-width: 550px;
  margin: 2rem auto;
  background: #202024;
  padding: 2.5rem;
  border-radius: 8px;
  border: 1px solid #323238;
}
.info-list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #29292e;
}
.tag { color: #00b37e; }
.role { text-transform: uppercase; font-size: 0.85rem; color: #a8a8b3; }
.badge-active { color: #04d361; font-weight: bold; }
</style>