<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import type { Torneo } from '../types/torneo'

const torneos = ref<Torneo[]>([])
const error = ref('')

onMounted(async () => {
  try {
    torneos.value = await api<Torneo[]>('/torneos')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudieron cargar los torneos'
  }
})
</script>

<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="eyebrow">Competencias</p>
        <h1>Torneos</h1>
      </div>
      <RouterLink class="button" to="/torneos/nuevo">Nuevo torneo</RouterLink>
    </div>
    <p v-if="error" class="alert">{{ error }}</p>
    <div v-else-if="!torneos.length" class="empty">No hay torneos disponibles.</div>
    <div v-else class="tournament-grid">
      <article v-for="torneo in torneos" :key="torneo.id" class="tournament-card">
        <span class="status">{{ torneo.estado }}</span>
        <h2>{{ torneo.nombre }}</h2>
        <p>{{ torneo.videojuego }} · {{ torneo.modalidad }}</p>
        <dl>
          <div><dt>Inicio</dt><dd>{{ new Date(torneo.fechaInicio).toLocaleString() }}</dd></div>
          <div><dt>Cupo</dt><dd>{{ torneo.cupoMaximo }} equipos</dd></div>
        </dl>
        <RouterLink class="text-link" :to="`/torneos/${torneo.id}`">Ver detalle →</RouterLink>
      </article>
    </div>
  </section>
</template>
