<script setup lang="ts">
import { ref } from 'vue'
import { api } from '../services/api'
import type { PosicionRanking } from '../types/competition'

const torneoId = ref(1)
const posiciones = ref<PosicionRanking[]>([])
const error = ref('')
const consultado = ref(false)
const cargando = ref(false)

async function cargarRanking() {
  error.value = ''
  cargando.value = true
  consultado.value = true
  try {
    posiciones.value = await api<PosicionRanking[]>(
      `/ranking?torneoId=${Number(torneoId.value)}`,
    )
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo cargar el ranking'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Tabla de posiciones</p>
        <h1>Ranking</h1>
      </div>
      <form class="ranking-filter" @submit.prevent="cargarRanking">
        <label for="ranking-torneo">Torneo ID</label>
        <input id="ranking-torneo" v-model.number="torneoId" type="number" min="1" required />
        <button class="button" type="submit" :disabled="cargando">
          {{ cargando ? 'Cargando…' : 'Ver ranking' }}
        </button>
      </form>
    </div>

    <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
    <div v-if="consultado && !error && !posiciones.length" class="panel empty-state">
      Este torneo todavía no tiene resultados oficiales.
    </div>
    <div v-else-if="posiciones.length" class="panel table-panel">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Equipo</th><th>Pts</th><th>PJ</th>
              <th>V</th><th>E</th><th>D</th><th>PF</th><th>PC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(posicion, index) in posiciones" :key="posicion.equipoId">
              <td class="position">{{ index + 1 }}</td>
              <td>Equipo {{ posicion.equipoId }}</td>
              <td class="points">{{ posicion.puntos }}</td>
              <td>{{ posicion.partidosJugados }}</td>
              <td>{{ posicion.victorias }}</td>
              <td>{{ posicion.empates }}</td>
              <td>{{ posicion.derrotas }}</td>
              <td>{{ posicion.puntosAFavor }}</td>
              <td>{{ posicion.puntosEnContra }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="helper-text ranking-legend">PJ: partidos jugados · V: victorias · E: empates · D: derrotas · PF/PC: puntos a favor/en contra</p>
    </div>
  </section>
</template>
