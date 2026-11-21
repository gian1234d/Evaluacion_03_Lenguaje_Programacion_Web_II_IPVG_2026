<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import type { Torneo } from '../types/torneo'
import InscripcionForm from '../components/InscripcionForm.vue'

const route = useRoute()
const torneo = ref<Torneo | null>(null)
const error = ref('')

onMounted(async () => {
  try {
    torneo.value = await api<Torneo>(`/torneos/${route.params.id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo cargar el torneo'
  }
})
</script>

<template>
  <section v-if="torneo" class="detail">
    <RouterLink class="text-link" to="/torneos">← Todos los torneos</RouterLink>
    <span class="status">{{ torneo.estado }}</span>
    <h1>{{ torneo.nombre }}</h1>
    <p class="detail-meta">{{ torneo.videojuego }} · {{ torneo.modalidad }}</p>
    <div class="detail-grid">
      <div><span>Inicio</span><strong>{{ new Date(torneo.fechaInicio).toLocaleString() }}</strong></div>
      <div><span>Cierre de inscripción</span><strong>{{ new Date(torneo.cierreInscripcion).toLocaleString() }}</strong></div>
      <div><span>Cupo máximo</span><strong>{{ torneo.cupoMaximo }} equipos</strong></div>
    </div>
    <InscripcionForm :torneo-id="torneo.id" />
    <RouterLink class="button" :to="`/torneos/${torneo.id}/editar`">Editar torneo</RouterLink>
  </section>
  <p v-else-if="error" class="alert">{{ error }}</p>
</template>
