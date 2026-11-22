import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PerfilView from '../views/PerfilView.vue';
import EquiposView from '../views/EquiposView.vue';
import EquipoDetalleView from '../views/EquipoDetalleView.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/equipos' },
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/registro', component: RegisterView, meta: { guestOnly: true } },
  { path: '/perfil', component: PerfilView, meta: { requiresAuth: true } },
  { path: '/equipos', component: EquiposView, meta: { requiresAuth: true } },
  { path: '/equipos/:id', component: EquipoDetalleView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.guestOnly && token) {
    next('/equipos');
  } else {
    next();
  }
});

export default router;