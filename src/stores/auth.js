import { ref } from 'vue'
import { defineStore } from 'pinia'
import globalFigs from '../config/constants'
import AuthService from '../services/auth.service'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  let sessionPromise = null
  const auth = ref({
    token: localStorage.getItem(globalFigs.token),
    user: JSON.parse(localStorage.getItem(globalFigs.user)),
    returnPath: null,
    isLoading: false,
    error: null
  })

  function clearSessionState() {
    localStorage.removeItem(globalFigs.token)
    localStorage.removeItem(globalFigs.user)
    auth.value.token = null
    auth.value.user = null
  }
  /* Setup token */

  async function loadUser() {
    const token = localStorage.getItem(globalFigs.token);
    if (token) {
      auth.value.token = token;
      return await AuthService.loadUser()
        .then((res) => {
          auth.value.user = res?.data?.data
          localStorage.setItem(globalFigs.user, JSON.stringify(res?.data?.data))
          return auth.value.user
        })
        .catch((error) => {
          console.error({ error })
          clearSessionState()
          throw error
        })
    } else {
      clearSessionState()
    }
  }


  async function updateUser(user_id, data) {
    await AuthService.updateUser(user_id, data)
    .then((res) => {
      loadUser()
      console.log(res?.data?.message)
    })
    .catch((error) => {
      console.error({ error })
    })
  }



  async function login(userData, options = {}) {
    const { redirect = true, redirectTo = null } = options
    auth.value.isLoading = true;
    /*
    setTimeout(() => {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NCwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJvbGExMTAwMCIsImV4cCI6MTcwMjA0NDgwMn0.Q3kOLpgjUO7oLdX6OVyOoBLHIAGBkb9CAMOJSMZdV_4'
      let user = { "name": "Oladele", "phone": "090827773882", "username": "ola200", ...userData }
      localStorage.setItem(globalFigs.token, token)
      localStorage.setItem(globalFigs.user, JSON.stringify(user))
      auth.value.user = user
      auth.value.token = token
      auth.value.isLoading = false
      // router.push('/dashboard')
      router.replace('/welcome')
    }, 3000)
    */

    return await AuthService.login(userData)
       .then(res => {
          let response = res?.data
          localStorage.setItem(globalFigs.token, response?.data?.token)
          localStorage.setItem(globalFigs.user, JSON.stringify(response?.data?.user))
          auth.value.user = response?.data?.user
          auth.value.token = response?.data?.token
          auth.value.isLoading = false
          if (redirect) {
            const targetPath = redirectTo || auth.value.returnPath || '/welcome'
            auth.value.returnPath = null
            router.replace(targetPath)
          }
          return response?.data?.user
       })
       .catch((error) => {
         auth.value.isLoading = false;
         auth.value.error = error.message;
         setTimeout(() => {
           auth.value.error = null;
         }, 3000)
         throw error
       });
  }

  async function ensureSession(options = {}) {
    const { allowDefaultLogin = true } = options

    if (auth.value.token && auth.value.user) {
      return auth.value.user
    }

    if (sessionPromise) {
      return sessionPromise
    }

    sessionPromise = (async () => {
      try {
        if (localStorage.getItem(globalFigs.token)) {
          try {
            return await loadUser()
          } catch (error) {
            if (!allowDefaultLogin) {
              throw error
            }
          }
        }

        if (allowDefaultLogin) {
          return await login({ ...globalFigs.defaultLogin }, { redirect: false })
        }

        return null
      } finally {
        sessionPromise = null
      }
    })()

    return sessionPromise
  }

  async function register(userData) {
    auth.value.isLoading = true;
    await AuthService.register(userData)
      .then(res => {
        let response = res?.data
        if (response.status === true) {
          auth.value.isLoading = false;
          router.replace('/login')
        }
      })
      .catch((error) => {
        auth.value.isLoading = false;
        auth.value.error = error.message;
        setTimeout(() => {
          auth.value.error = null;
        }, 3000)
      })
  }

  async function forgotPassword(userData) {
    auth.value.isLoading = true
    return await AuthService.forgotPassword(userData)
      .then((res) => {
        auth.value.isLoading = false
        return res?.data
      })
      .catch((error) => {
        auth.value.isLoading = false;
        auth.value.error = error.message;
        setTimeout(() => {
          auth.value.error = null;
        }, 3000)
        throw error
      })
  }

  async function logout() {

    await AuthService.logout()
      .then(res => {
        let response = res?.data
        if(response.status) {
          clearSessionState()
          auth.value.returnPath = null
          router.replace('/login')
        }
      })
      .catch((error) => {
        auth.value.isLoading = false;
        auth.value.error = error.message;
        setTimeout(() => {
          auth.value.error = null;
        }, 3000)
      });
  }

  /* Validate user */
  /* Store user data */

  return { auth, loadUser, login, ensureSession, register, logout, updateUser, forgotPassword }
})
