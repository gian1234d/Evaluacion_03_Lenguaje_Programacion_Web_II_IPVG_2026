import { createRouter, createWebHistory } from 'vue-router'
import PartidosView from './views/PartidosView.vue'
import RankingView from './views/RankingView.vue'
import ResultadosView from './views/ResultadosView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/partidos' },
    { path: '/partidos', component: PartidosView },
    { path: '/resultados', component: ResultadosView },
    { path: '/ranking', component: RankingView },
  ],
})
