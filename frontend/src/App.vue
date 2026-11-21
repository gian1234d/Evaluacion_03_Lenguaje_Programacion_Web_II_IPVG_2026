<template>
  <header class="topbar">
    <RouterLink class="brand" to="/">GameHub Torneos</RouterLink>
    <nav>
      <RouterLink to="/torneos">Torneos</RouterLink>
      <RouterLink to="/torneos/nuevo">Crear torneo</RouterLink>
    </nav>
  </header>
  <main class="page">
    <RouterView />
  </main>
</template>
