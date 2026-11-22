<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, usuarioActual } from '../services/api'
import type { Torneo } from '../types/torneo'
import InscripcionForm from '../components/InscripcionForm.vue'

const route = useRoute()
const router = useRouter()
const usuario = usuarioActual()
const inscripciones = ref<{ id: number; equipoId: number }[]>([])
const operacionError = ref('')

async function cargarInscripciones() {
  try {
    inscripciones.value = await api(`/inscripciones/torneo/${route.params.id}`)
  } catch (cause) {
    operacionError.value = (cause as Error).message
  }
}

async function cancelarInscripcion(id: number) {
  if (!confirm('¿Eliminar esta inscripción?')) return
  try {
    await api(`/inscripciones/${id}`, { method: 'DELETE' })
    await cargarInscripciones()
  } catch (cause) {
    operacionError.value = (cause as Error).message
  }
}

async function eliminarTorneo() {
  if (!confirm('¿Eliminar el torneo y sus registros asociados?')) return
  try {
    await api(`/torneos/${route.params.id}`, { method: 'DELETE' })
    await router.push('/torneos')
  } catch (cause) {
    operacionError.value = (cause as Error).message
  }
}
const torneo = ref<Torneo | null>(null)
const error = ref('')

onMounted(async () => {
  try {
    torneo.value = await api<Torneo>(`/torneos/${route.params.id}`)
    await cargarInscripciones()
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
    <InscripcionForm v-if="usuario && torneo.estado === 'abierto'" :torneo-id="torneo.id" @inscrito="cargarInscripciones" />
    <h2>Equipos inscritos</h2>
    <p v-if="!inscripciones.length">Todavía no hay equipos inscritos.</p>
    <ul v-else>
      <li v-for="inscripcion in inscripciones" :key="inscripcion.id">
        <RouterLink :to="`/equipos/${inscripcion.equipoId}`">Equipo #{{ inscripcion.equipoId }}</RouterLink>
        <button v-if="usuario?.rol === 'admin'" @click="cancelarInscripcion(inscripcion.id)">Cancelar inscripción</button>
      </li>
    </ul>
    <p v-if="operacionError" role="alert">{{ operacionError }}</p>
    <button v-if="usuario?.rol === 'admin'" @click="eliminarTorneo">Eliminar torneo</button>
    <RouterLink v-if="usuario?.rol === 'admin'" class="button" :to="`/torneos/${torneo.id}/editar`">Editar torneo</RouterLink>
  </section>
  <p v-else-if="error" class="alert">{{ error }}</p>
  <p v-else>Cargando torneo…</p>
</template>
