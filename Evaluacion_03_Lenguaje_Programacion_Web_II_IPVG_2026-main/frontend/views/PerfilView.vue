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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const perfil = ref(null);
const cargando = ref(true);

onMounted(async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:3000/usuarios/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      perfil.value = await res.json();
    }
  } finally {
    cargando.value = false;
  }
});
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