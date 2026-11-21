import { createRouter, createWebHistory } from 'vue-router'
import TorneosView from '../views/TorneosView.vue'
import TorneoDetalleView from '../views/TorneoDetalleView.vue'
import TorneoFormView from '../views/TorneoFormView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/torneos' },
    { path: '/torneos', component: TorneosView },
    { path: '/torneos/nuevo', component: TorneoFormView },
    { path: '/torneos/:id/editar', component: TorneoFormView },
    { path: '/torneos/:id', component: TorneoDetalleView },
  ],
})
