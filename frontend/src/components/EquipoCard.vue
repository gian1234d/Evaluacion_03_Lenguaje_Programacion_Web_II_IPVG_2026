<template>
  <div class="card" @click="$emit('select', equipo.id)">
    <div class="card-header">
      <h3>🛡️ {{ equipo.nombre }}</h3>
      <span class="game-badge">{{ equipo.juegoPreferido || 'General' }}</span>
    </div>
    <div class="card-body">
      <p>
        <span class="label">Capitán:</span>
        <strong>{{ equipo.capitan ? equipo.capitan.alias : 'Sin Capitán' }}</strong>
      </p>
      <p>
        <span class="label">Integrantes:</span>
        <span>{{ equipo.integrantes?.length || 1 }} jugadores</span>
      </p>
    </div>
    <div class="card-footer">
      <span>Ver escuadra →</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  equipo: {
    type: Object,
    required: true,
  },
});
defineEmits(['select']);
</script>

<style scoped>
.card {
  background: #202024;
  border: 1px solid #323238;
  padding: 1.3rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, border-color 0.2s;
}
.card:hover {
  border-color: #00b37e;
  transform: translateY(-4px);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
}
.card-header h3 { margin: 0; font-size: 1.15rem; color: #fff; }
.game-badge {
  background: #121214;
  border: 1px solid #00b37e;
  color: #00b37e;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
}
.label { color: #8d8d99; font-size: 0.9rem; margin-right: 4px; }
.card-footer {
  margin-top: 1rem;
  text-align: right;
  font-size: 0.85rem;
  color: #00b37e;
  font-weight: 600;
}
</style>