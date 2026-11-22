import PartidoDetalleView from '../views/PartidoDetalleView.vue'
import { usuarioActual } from '../services/api'
import RankingView from '../views/RankingView.vue'
import ResultadosView from '../views/ResultadosView.vue'
import PartidosView from '../views/PartidosView.vue'
import EquipoDetalleView from '../views/EquipoDetalleView.vue'
import EquiposView from '../views/EquiposView.vue'
import PerfilView from '../views/PerfilView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import TorneosView from '../views/TorneosView.vue'
import TorneoDetalleView from '../views/TorneoDetalleView.vue'
import TorneoFormView from '../views/TorneoFormView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/registro', component: RegisterView },
    { path: '/perfil', component: PerfilView, meta: { auth: true } },
    { path: '/equipos', component: EquiposView },
    { path: '/equipos/:id', component: EquipoDetalleView },
    { path: '/partidos/:id', component: PartidoDetalleView },
    { path: '/partidos', component: PartidosView },
    { path: '/resultados', component: ResultadosView },
    { path: '/ranking', component: RankingView },

    { path: '/', redirect: '/torneos' },
    { path: '/torneos', component: TorneosView },
    { path: '/torneos/nuevo', component: TorneoFormView, meta: { auth: true, admin: true } },
    { path: '/torneos/:id/editar', component: TorneoFormView, meta: { auth: true, admin: true } },
    { path: '/torneos/:id', component: TorneoDetalleView },
  ],
})

router.beforeEach((to) => {
  const usuario = usuarioActual()
  if (to.meta.auth && !usuario) return '/login'
  if (to.meta.admin && usuario?.rol !== 'admin') return '/torneos'
})
