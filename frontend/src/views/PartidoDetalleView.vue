<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import type { Partido } from '../types/competition'

const route = useRoute()
const partido = ref<Partido>()
const error = ref('')

watch(() => route.params.id, async (id, _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  partido.value = undefined
  error.value = ''
  try {
    partido.value = await api<Partido>(`/partidos/${id}`, { signal: controller.signal })
  } catch (cause) {
    if (!controller.signal.aborted) error.value = (cause as Error).message
  }
}, { immediate: true })
</script>

<template>
  <RouterLink to="/partidos">Volver al calendario</RouterLink>
  <article v-if="partido" class="detail">
    <h1>Partido #{{ partido.id }}</h1>
    <p>Equipo {{ partido.equipoLocalId }} vs. Equipo {{ partido.equipoVisitanteId }}</p>
    <p>{{ new Date(partido.fechaProgramada).toLocaleString() }} · {{ partido.estado }}</p>
    <RouterLink :to="`/torneos/${partido.torneoId}`">Ver torneo</RouterLink>
  </article>
  <p v-else-if="error" role="alert">{{ error }}</p>
  <p v-else>Cargando partido…</p>
</template>
