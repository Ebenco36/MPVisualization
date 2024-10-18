<template>
  <div class="inner-container card card-body ms-auto col-sm-6 col-lg-4">
    <div class="form-header mb-3">
      <h3>Forgot Password</h3>
    </div>
    <!-- <p>Please enter your email address and receive your password reset link</p> -->
    <form class="form-body" @submit.prevent="handleLogin">
      <div class="form-group mb-2">
        <label for="email">Email</label>
        <input
          class="form-control"
          id="email"
          type="text"
          name="email"
          v-bind="email"
          placeholder="Enter your email"
        />
        <ErrorMessage v-if="errors.email" :errorMessage="errors.email" />
      </div>
      <div class="form-group mt-4">
        <AppButton
          label="Login"
          class="btn-primary btn-block"
          :isLoading="isLoading"
          type="submit"
        />
      </div>
      <p class="text-center mt-1">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </form>
  </div>
</template>
<script setup>
import AppButton from '../../components/common/AppButton.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import ErrorMessage from '../../components/common/ErrorMessage.vue'

/* Components Data */
const router = useRouter()
const isLoading = ref(false)

/* Effects */

const { errors, handleSubmit, defineInputBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().required('email is required')
  })
})

const email = defineInputBinds('email')

/* Functions  */
const handleLogin = handleSubmit((vals) => {
  /* Setup loading */
  isLoading.value = true

  /* 
    Timeout base on API response 
      Make request to endpoint

    
    */
  setTimeout(() => {
    isLoading.value = false
    router.push('/dashboard')
  }, 1000)
})
</script>
<style lang="scss"></style>
