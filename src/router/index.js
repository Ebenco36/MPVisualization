import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import ROUTES from './routes';
import { useAuthStore } from '../stores/auth';

/* 
  CreateRouter 
*/
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(),
  routes: ROUTES
})


router.beforeEach((to, from, next) => {
  const authData = useAuthStore();
  const { requiresAuth } = to.meta;

  if ((authData.auth.user === null) && to.meta.requiresAuth) {
    return next({ path: '/login' })
  } else if (authData.auth.token && (requiresAuth === false)) {
    return next({ path: '/welcome', replace: true })
  } else {
    return next()
  }

})

export default router
