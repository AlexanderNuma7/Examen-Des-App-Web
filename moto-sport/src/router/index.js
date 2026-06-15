import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductoComponent from '@/components/ProductoComponent.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import OrdersView from '@/views/OrdersView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      { path: 'productos', component: ProductoComponent, meta: { requiresAuth: true } },
      { path: 'usuarios', component: UsuariosView, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'ordenes', component: OrdersView, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: '', redirect: 'productos' }
    ]
  },
  { path: '/productos', redirect: '/dashboard/productos' },
  { path: '/usuarios', redirect: '/dashboard/usuarios' },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role') || 'user'

  if (to.path === '/login' && token) {
    next('/dashboard/productos')
    return
  }

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if (to.meta.requiresAdmin && role !== 'admin') {
    next('/dashboard/productos')
    return
  }

  next()
})

export default router
