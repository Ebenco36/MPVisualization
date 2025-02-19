<template>
  <div class="inner-container card card-body col-sm-6 col-lg-4">
    <div class="form-header mb-3">
      <h3>Login</h3>
    </div>

    <form class="form-body" @submit.prevent="handleLogin">
      <!--Error message from backend is here.-->
      <div class="form-group" v-if="auth.auth.error" :serv={True}>
        <ErrorMessage :errorMessage="auth.auth.error" />
      </div>

      <div class="form-group mb-2">
        <label for="email">Username/Email</label>
        <input class="form-control" id="email" type="text" name="email" v-bind="email"
          placeholder="Enter your username/email" value="admin01@gmail.com" />
        <ErrorMessage v-if="errors.email" :errorMessage="errors.email" />
      </div>

      <div class="form-group mb-2">
        <label for="password">Password</label>
        <div class="with-icon">
          <input class="form-control" id="password" :type="togglePassword ? 'text' : 'password'" v-bind="password"
            placeholder="Enter your password" value="password" />
          <span class="-icon" @click="toggleView"><i :class="togglePassword ? 'eye-icon' : 'eye-slash-icon'"></i></span>
        </div>
        <ErrorMessage v-if="errors.password" :errorMessage="errors.password" />
      </div>
      <p class="text-right">
        <small><router-link to="/forgot-password">Forgot password?</router-link></small>
      </p>
      <div class="form-group">
        <AppButton label="Login" class="btn-primary btn-block" :isLoading="auth.auth.isLoading" type="submit" />
      </div>
      <p class="text-center mt-1">
        Don't have an account? <router-link to="/signup">Signup</router-link>
      </p>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/common/AppButton.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

/* Components Data */
const isLoading = ref(false)
const auth = useAuthStore()
const togglePassword = ref(false)

/* Effects */
const { errors, handleSubmit, defineInputBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().default("admin01@gmail.com").required('Username/email is required'),
    password: yup.string().default("password").min(8, 'Too short').required('Password is required.')
  })
})

const email = defineInputBinds('email')
const password = defineInputBinds('password')

/* Functions  */
const handleLogin = handleSubmit((vals) => {
  /* Setup loading */
  if (Object.keys(vals).length === 0) {
    vals.email = "admin01@gmail.com"
    vals.password = "password"
  }

  isLoading.value = true
  auth.login(vals)
  isLoading.value = false
})

function toggleView() {
  togglePassword.value = !togglePassword.value
}

onMounted(() => {
  handleLogin()
})

</script>
<style lang="scss"></style>
