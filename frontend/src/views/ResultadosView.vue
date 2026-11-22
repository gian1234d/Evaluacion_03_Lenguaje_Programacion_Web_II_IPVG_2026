<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { api, usuarioActual } from '../services/api'
import type { Resultado } from '../types/competition'

const resultados = ref<Resultado[]>([])
const error = ref('')
const aviso = ref('')
const enviando = ref(false)
const form = reactive({ partidoId: 1, puntajeLocal: 0, puntajeVisitante: 0 })

async function cargarResultados() {
  error.value = ''
  try {
    resultados.value = await api<Resultado[]>('/resultados')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudieron cargar los resultados'
  }
}

async function registrarResultado() {
  error.value = ''
  aviso.value = ''
  enviando.value = true
  try {
    await api<Resultado>('/resultados', {
      method: 'POST',
      body: JSON.stringify({
        partidoId: Number(form.partidoId),
        puntajeLocal: Number(form.puntajeLocal),
        puntajeVisitante: Number(form.puntajeVisitante),
      }),
    })
    aviso.value = 'Resultado oficial registrado.'
    await cargarResultados()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo registrar el resultado'
  } finally {
    enviando.value = false
  }
}

onMounted(cargarResultados)
</script>

<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Actas oficiales</p>
        <h1>Resultados</h1>
      </div>
      <button class="button button-secondary" type="button" @click="cargarResultados">Actualizar</button>
    </div>

    <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
    <p v-if="aviso" class="notice notice-success" role="status">{{ aviso }}</p>

    <div class="content-grid">
      <form v-if="usuarioActual()?.rol === 'admin'" class="panel form-panel" @submit.prevent="registrarResultado">
        <h2>Registrar resultado oficial</h2>
        <p class="helper-text">La operación requiere una sesión de administrador válida.</p>
        <label>Partido ID
          <input v-model.number="form.partidoId" type="number" min="1" required />
        </label>
        <div class="score-inputs">
          <label>Puntaje local
            <input v-model.number="form.puntajeLocal" type="number" min="0" required />
          </label>
          <label>Puntaje visitante
            <input v-model.number="form.puntajeVisitante" type="number" min="0" required />
          </label>
        </div>
        <button class="button" type="submit" :disabled="enviando">
          {{ enviando ? 'Guardando…' : 'Registrar resultado' }}
        </button>
      </form>

      <div class="panel table-panel">
        <h2>Resultados registrados</h2>
        <div v-if="!resultados.length" class="empty-state">Aún no hay resultados oficiales.</div>
        <div v-else class="table-scroll">
          <table>
            <thead>
              <tr><th>Partido</th><th>Marcador</th><th>Ganador</th><th>Registrado</th></tr>
            </thead>
            <tbody>
              <tr v-for="resultado in resultados" :key="resultado.id">
                <td>#{{ resultado.partidoId }}</td>
                <td class="score">{{ resultado.puntajeLocal }} — {{ resultado.puntajeVisitante }}</td>
                <td>{{ resultado.ganadorId === null ? 'Empate' : `Equipo ${resultado.ganadorId}` }}</td>
                <td>{{ new Date(resultado.registradoEn).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
