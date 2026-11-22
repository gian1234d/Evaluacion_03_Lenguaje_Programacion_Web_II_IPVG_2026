<template>
  <div class="container">
    <div class="header-section">
      <div>
        <h2>🛡️ Equipos Registrados</h2>
        <p class="subtitle">Explora los clanes de GameHub o funda tu propia escuadra</p>
      </div>
      <button v-if="usuarioActual()" @click="showModal = true" class="btn-create">+ Crear Equipo</button>
    </div>

    <input
      v-model="filtro"
      placeholder="🔍 Buscar por nombre de equipo o juego..."
      class="search-bar"
    />

    <p v-if="error" role="alert">{{ error }}</p>
    <div v-else-if="cargando" class="loading">Cargando escuadras...</div>
    <div v-else-if="equiposFiltrados.length === 0" class="empty">
      No se encontraron equipos registrados con ese criterio.
    </div>
    <div v-else class="grid">
      <EquipoCard
        v-for="eq in equiposFiltrados"
        :key="eq.id"
        :equipo="eq"
        @select="id => router.push(`/equipos/${id}`)"
      />
    </div>

    <!-- Modal para nuevo equipo -->
    <div v-show="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>🛡️ Fundar Nuevo Equipo</h3>
        <p class="modal-desc">Serás asignado automáticamente como el Capitán.</p>

        <label>Nombre del Equipo</label>
        <input v-model="nuevo.nombre" placeholder="Ej: CyberHawks" />

        <label>Juego Principal</label>
        <input v-model="nuevo.juegoPreferido" placeholder="Ej: League of Legends, Valorant..." />

        <p v-if="modalError" class="modal-err">{{ modalError }}</p>

        <div class="modal-actions">
          <button @click="crearEquipo" class="btn-confirm">Guardar</button>
          <button @click="cerrarModal" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { api, usuarioActual } from '../services/api'
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EquipoCard from '../components/EquipoCard.vue';

const router = useRouter();
const equipos = ref([]);
const filtro = ref('');
const cargando = ref(true);
const error = ref('');
const showModal = ref(false);
const modalError = ref('');
const nuevo = ref({ nombre: '', juegoPreferido: '' });

const equiposFiltrados = computed(() => {
  const f = filtro.value.toLowerCase().trim();
  if (!f) return equipos.value;
  return equipos.value.filter(
    (e) =>
      e.nombre.toLowerCase().includes(f) ||
      (e.juegoPreferido && e.juegoPreferido.toLowerCase().includes(f))
  );
});

async function cargarEquipos() {
  cargando.value = true;
  try {
    equipos.value = await api('/equipos')
  } catch (cause) {
    error.value = cause.message
  } finally {
    cargando.value = false;
  }
}

async function crearEquipo() {
  if (!nuevo.value.nombre.trim()) {
    modalError.value = 'El nombre del equipo es obligatorio';
    return;
  }
  modalError.value = '';
  try {
    await api('/equipos', {
      method: 'POST',
      body: JSON.stringify({
        nombre: nuevo.value.nombre,
        juegoPreferido: nuevo.value.juegoPreferido || undefined,
      }),
    });

    cerrarModal();
    cargarEquipos();
  } catch (err) {
    modalError.value = err.message;
  }
}

function cerrarModal() {
  showModal.value = false;
  nuevo.value = { nombre: '', juegoPreferido: '' };
  modalError.value = '';
}

onMounted(cargarEquipos);
</script>

<style scoped>
.container { max-width: 960px; margin: 0 auto; }
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.header-section h2 { margin: 0; }
.subtitle { margin: 0.25rem 0 0; color: #8d8d99; font-size: 0.9rem; }
.btn-create {
  background: #00b37e;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.search-bar {
  width: 100%;
  padding: 12px;
  margin-bottom: 2rem;
  background: #202024;
  border: 1px solid #323238;
  border-radius: 4px;
  color: white;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #202024;
  padding: 2rem;
  border-radius: 8px;
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.modal-content input {
  padding: 10px;
  background: #121214;
  border: 1px solid #323238;
  color: white;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.modal-desc { font-size: 0.8rem; color: #8d8d99; margin: 0 0 0.8rem 0; }
.modal-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.btn-confirm { flex: 1; padding: 10px; background: #00b37e; color: white; border: none; font-weight: bold; cursor: pointer; border-radius: 4px; }
.btn-cancel { flex: 1; padding: 10px; background: transparent; border: 1px solid #444; color: #aaa; cursor: pointer; border-radius: 4px; }
.modal-err { color: #f75a68; font-size: 0.85rem; margin: 0; }
</style>