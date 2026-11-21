<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'
import type { Torneo } from '../types/torneo'

const route = useRoute()
const router = useRouter()
const editing = computed(() => Boolean(route.params.id))
const error = ref('')
const form = reactive({
  nombre: '',
  videojuego: '',
  modalidad: '',
  fechaInicio: '',
  cierreInscripcion: '',
  cupoMaximo: 16,
  estado: 'proximo',
})

onMounted(async () => {
  if (!editing.value) return
  try {
    const torneo = await api<Torneo>(`/torneos/${route.params.id}`)
    Object.assign(form, {
      ...torneo,
      fechaInicio: torneo.fechaInicio.slice(0, 16),
      cierreInscripcion: torneo.cierreInscripcion.slice(0, 16),
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo cargar el torneo'
  }
})

async function submit() {
  error.value = ''
  try {
    const payload = {
      ...form,
      cupoMaximo: Number(form.cupoMaximo),
      fechaInicio: new Date(form.fechaInicio).toISOString(),
      cierreInscripcion: new Date(form.cierreInscripcion).toISOString(),
    }
    const torneo = editing.value
      ? await api<Torneo>(`/torneos/${route.params.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
      : await api<Torneo>('/torneos', { method: 'POST', body: JSON.stringify(payload) })
    await router.push(`/torneos/${torneo.id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo guardar el torneo'
  }
}
</script>

<template>
  <section class="form-shell">
    <p class="eyebrow">Administración</p>
    <h1>{{ editing ? 'Editar torneo' : 'Crear torneo' }}</h1>
    <p v-if="error" class="alert">{{ error }}</p>
    <form @submit.prevent="submit" class="tournament-form">
      <label>Nombre<input v-model="form.nombre" required /></label>
      <label>Videojuego<input v-model="form.videojuego" required /></label>
      <label>Modalidad<input v-model="form.modalidad" required /></label>
      <label>Fecha de inicio<input v-model="form.fechaInicio" type="datetime-local" required /></label>
      <label>Cierre de inscripción<input v-model="form.cierreInscripcion" type="datetime-local" required /></label>
      <label>Cupo máximo<input v-model.number="form.cupoMaximo" type="number" min="1" required /></label>
      <label>Estado
        <select v-model="form.estado">
          <option value="proximo">Próximo</option>
          <option value="abierto">Abierto</option>
          <option value="en_curso">En curso</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </label>
      <button class="button" type="submit">{{ editing ? 'Guardar cambios' : 'Crear torneo' }}</button>
    </form>
  </section>
</template>
