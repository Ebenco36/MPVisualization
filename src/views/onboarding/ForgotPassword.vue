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
          label="Send Reset Link"
          class="btn-primary btn-block"
          :isLoading="auth.auth.isLoading"
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
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '../../components/common/ErrorMessage.vue'

/* Components Data */
const auth = useAuthStore()

/* Effects */

const { errors, handleSubmit, defineInputBinds } = useForm({
  validationSchema: yup.object({
    email: yup.string().required('email is required')
  })
})

const email = defineInputBinds('email')

/* Functions  */
const handleLogin = handleSubmit(async ({ email }) => {
  await auth.forgotPassword({ email })
  Swal.fire({
    title: 'Request Sent',
    text: 'If the account exists, a reset link has been requested.',
    icon: 'success',
    confirmButtonText: 'OK'
  })
})
</script>
<style lang="scss"></style>
