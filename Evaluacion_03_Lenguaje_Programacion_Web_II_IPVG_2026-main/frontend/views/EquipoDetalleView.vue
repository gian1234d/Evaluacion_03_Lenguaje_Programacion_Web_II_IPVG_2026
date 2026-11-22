<template>
  <div class="wrap" v-if="equipo">
    <button @click="router.push('/equipos')" class="btn-back">← Volver a Equipos</button>

    <div class="team-header">
      <div>
        <h2>🛡️ {{ equipo.nombre }}</h2>
        <span class="badge">{{ equipo.juegoPreferido || 'General' }}</span>
      </div>
      <button v-if="esCapitanOAdmin" @click="eliminarEquipo" class="btn-del">
        Eliminar Escuadra
      </button>
    </div>

    <div class="section captain-box">
      <h4>👑 Capitán</h4>
      <p v-if="equipo.capitan">
        <strong>{{ equipo.capitan.nombre }}</strong> (@{{ equipo.capitan.alias }}) - {{ equipo.capitan.correo }}
      </p>
    </div>

    <div class="section members-box">
      <h4>👥 Integrantes de la Escuadra ({{ equipo.integrantes?.length || 0 }})</h4>
      <ul class="member-list">
        <li v-for="m in equipo.integrantes" :key="m.id" class="member-item">
          <span>🎮 <strong>{{ m.nombre }}</strong> (@{{ m.alias }})</span>
          <span v-if="m.id === equipo.capitanId" class="cap-tag">Capitán</span>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="loading">Cargando detalles del equipo...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const equipo = ref(null);
const usuarioActual = ref(JSON.parse(localStorage.getItem('usuario') || '{}'));

const esCapitanOAdmin = computed(() => {
  if (!equipo.value) return false;
  return (
    usuarioActual.value.id === equipo.value.capitanId ||
    usuarioActual.value.rol === 'admin'
  );
});

async function cargarDetalle() {
  const res = await fetch(`http://localhost:3000/equipos/${route.params.id}`);
  if (res.ok) {
    equipo.value = await res.json();
  } else {
    router.push('/equipos');
  }
}

async function eliminarEquipo() {
  if (!confirm(`¿Estás seguro de eliminar el equipo "${equipo.value.nombre}"?`)) return;
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:3000/equipos/${equipo.value.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    router.push('/equipos');
  }
}

onMounted(cargarDetalle);
</script>

<style scoped>
.wrap {
  max-width: 650px;
  margin: 1.5rem auto;
  background: #202024;
  padding: 2.2rem;
  border-radius: 8px;
  border: 1px solid #323238;
}
.btn-back {
  background: none;
  border: 1px solid #323238;
  color: #a8a8b3;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}
.team-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.team-header h2 { margin: 0 0 0.4rem 0; }
.badge { background: #121214; border: 1px solid #00b37e; color: #00b37e; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; }
.btn-del {
  background: #f75a68;
  color: white;
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}
.section { margin-top: 1.5rem; border-top: 1px solid #29292e; padding-top: 1rem; }
.section h4 { margin: 0 0 0.8rem 0; color: #a8a8b3; font-size: 0.9rem; text-transform: uppercase; }
.member-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #121214;
  padding: 10px 14px;
  border-radius: 4px;
}
.cap-tag { background: #00b37e; color: white; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
</style>