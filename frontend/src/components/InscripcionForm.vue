<script setup lang="ts">
import { ref } from 'vue'
import { api } from '../services/api'

const props = defineProps<{ torneoId: number }>()
const equipoId = ref<number>(1)
const mensaje = ref('')
const error = ref('')

async function inscribir() {
  mensaje.value = ''
  error.value = ''
  if (!window.confirm(`¿Confirmar inscripción del equipo ${equipoId.value}?`)) return

  try {
    await api('/inscripciones', {
      method: 'POST',
      body: JSON.stringify({
        torneoId: props.torneoId,
        equipoId: Number(equipoId.value),
      }),
    })
    mensaje.value = 'Inscripción registrada correctamente'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo completar la inscripción'
  }
}
</script>

<template>
  <form class="inscription-form" @submit.prevent="inscribir">
    <label>ID del equipo
      <input v-model.number="equipoId" type="number" min="1" required />
    </label>
    <button class="button" type="submit">Inscribirme</button>
    <p v-if="mensaje" class="success">{{ mensaje }}</p>
    <p v-if="error" class="alert">{{ error }}</p>
  </form>
</template>
