<template>
  <header class="app-header">
    <RouterLink class="brand" to="/">GameHub</RouterLink>
    <nav aria-label="Navegación principal">
      <RouterLink to="/partidos">Partidos</RouterLink>
      <RouterLink to="/resultados">Resultados</RouterLink>
      <RouterLink to="/ranking">Ranking</RouterLink>
    </nav>
  </header>
  <main class="app-main">
    <RouterView />
  </main>
</template>
