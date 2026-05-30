import { createRouter, createWebHashHistory } from 'vue-router'
import ROUTES from './routes'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: ROUTES
})


router.beforeEach(async (to, from, next) => {
  const authData = useAuthStore()
  const { requiresAuth } = to.meta

  if (to.meta.requiresAuth) {
    try {
      await authData.ensureSession()
    } catch (error) {
      console.error(error)
      authData.auth.returnPath = to.fullPath
      return next({ path: '/login' })
    }
  }

  if ((authData.auth.user === null) && to.meta.requiresAuth) {
    return next({ path: '/login' })
  } else if (authData.auth.token && (requiresAuth === false)) {
    return next({ path: '/welcome', replace: true })
  } else {
    return next()
  }
})

export default router
