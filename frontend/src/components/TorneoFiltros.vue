<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface FiltrosTorneo {
  q: string
  juego: string
  estado: string
  modalidad: string
}

const emit = defineEmits<{ cambiar: [filtros: FiltrosTorneo] }>()
const filtros = reactive<FiltrosTorneo>({
  q: '',
  juego: '',
  estado: '',
  modalidad: '',
})

watch(
  filtros,
  () => emit('cambiar', { ...filtros }),
  { deep: true },
)
</script>

<template>
  <div class="filters">
    <label>Búsqueda
      <input v-model="filtros.q" type="search" placeholder="Nombre, juego o modalidad" />
    </label>
    <label>Juego
      <input v-model="filtros.juego" placeholder="Ej: Valorant" />
    </label>
    <label>Modalidad
      <input v-model="filtros.modalidad" placeholder="Ej: 5v5" />
    </label>
    <label>Estado
      <select v-model="filtros.estado">
        <option value="">Todos</option>
        <option value="proximo">Próximo</option>
        <option value="abierto">Abierto</option>
        <option value="en_curso">En curso</option>
        <option value="finalizado">Finalizado</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </label>
  </div>
</template>
