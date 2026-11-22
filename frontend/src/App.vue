<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usuarioActual } from './services/api'

const route = useRoute()
const router = useRouter()
const usuario = computed(() => {
  // La navegación también actualiza la sesión después de iniciar sesión.
  return route.fullPath && usuarioActual()
})

function salir() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  void router.push('/login')
}
</script>

<template>
  <header class="topbar">
    <RouterLink class="brand" to="/">GameHub IPVG</RouterLink>
    <nav aria-label="Navegación principal">
      <RouterLink to="/torneos">Torneos</RouterLink>
      <RouterLink to="/equipos">Equipos</RouterLink>
      <RouterLink to="/partidos">Partidos</RouterLink>
      <RouterLink to="/resultados">Resultados</RouterLink>
      <RouterLink to="/ranking">Ranking</RouterLink>
      <RouterLink v-if="usuario?.rol === 'admin'" to="/torneos/nuevo">Crear torneo</RouterLink>
      <template v-if="usuario">
        <RouterLink to="/perfil">Perfil</RouterLink>
        <button type="button" @click="salir">Cerrar sesión</button>
      </template>
      <RouterLink v-else to="/login">Iniciar sesión</RouterLink>
    </nav>
  </header>
  <main class="page">
    <RouterView />
  </main>
</template>
