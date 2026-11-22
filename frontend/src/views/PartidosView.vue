<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { api, usuarioActual } from '../services/api'
import type { Partido } from '../types/competition'

const partidos = ref<Partido[]>([])
const error = ref('')
const aviso = ref('')
const enviando = ref(false)
const form = reactive({
  ronda: '',
  torneoId: 1,
  equipoLocalId: 1,
  equipoVisitanteId: 2,
  fechaProgramada: '',
})

async function cargarPartidos() {
  error.value = ''
  try {
    partidos.value = await api<Partido[]>('/partidos')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudieron cargar los partidos'
  }
}

async function programarPartido() {
  error.value = ''
  aviso.value = ''
  enviando.value = true
  try {
    await api<Partido>('/partidos', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        ronda: form.ronda.trim() || undefined,
        torneoId: Number(form.torneoId),
        equipoLocalId: Number(form.equipoLocalId),
        equipoVisitanteId: Number(form.equipoVisitanteId),
        fechaProgramada: new Date(form.fechaProgramada).toISOString(),
      }),
    })
    aviso.value = 'Partido programado correctamente.'
    await cargarPartidos()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo programar el partido'
  } finally {
    enviando.value = false
  }
}

onMounted(cargarPartidos)
</script>

<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Competencia</p>
        <h1>Partidos</h1>
      </div>
      <button class="button button-secondary" type="button" @click="cargarPartidos">Actualizar</button>
    </div>

    <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
    <p v-if="aviso" class="notice notice-success" role="status">{{ aviso }}</p>

    <div class="content-grid">
      <form v-if="usuarioActual()?.rol === 'admin'" class="panel form-panel" @submit.prevent="programarPartido">
        <h2>Programar enfrentamiento</h2>
        <label>Torneo ID
          <input v-model.number="form.torneoId" type="number" min="1" required />
        </label>
        <label>Equipo local ID
          <input v-model.number="form.equipoLocalId" type="number" min="1" required />
        </label>
        <label>Equipo visitante ID
          <input v-model.number="form.equipoVisitanteId" type="number" min="1" required />
        </label>
        <label>Ronda <input v-model="form.ronda" maxlength="80" /></label>
        <label>Fecha y hora
          <input v-model="form.fechaProgramada" type="datetime-local" required />
        </label>
        <button class="button" type="submit" :disabled="enviando">
          {{ enviando ? 'Guardando…' : 'Programar partido' }}
        </button>
      </form>

      <div class="panel table-panel">
        <h2>Calendario</h2>
        <div v-if="!partidos.length" class="empty-state">Todavía no hay partidos programados.</div>
        <div v-else class="table-scroll">
          <table>
            <thead>
              <tr><th>Partido</th><th>Enfrentamiento</th><th>Fecha</th><th>Estado</th></tr>
            </thead>
            <tbody>
              <tr v-for="partido in partidos" :key="partido.id">
                <td><RouterLink :to="`/partidos/${partido.id}`">#{{ partido.id }}</RouterLink></td>
                <td>Equipo {{ partido.equipoLocalId }} <span class="versus">vs</span> Equipo {{ partido.equipoVisitanteId }}</td>
                <td>{{ new Date(partido.fechaProgramada).toLocaleString() }}</td>
                <td><span class="badge">{{ partido.estado }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
