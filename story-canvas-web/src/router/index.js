import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/views/auth/register.vue'),
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/forgot-password.vue'),
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('@/views/create/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/preview/:id',
    name: 'Preview',
    component: () => import('@/views/preview/index.vue'),
  },
  {
    path: '/bookshelf',
    name: 'Bookshelf',
    component: () => import('@/views/bookshelf/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.token) {
    next('/auth/login')
  } else {
    next()
  }
})

export default router
