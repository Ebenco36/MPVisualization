<template>
  <div class="inner-container card card-body col-sm-6 col-lg-4">
    <div class="form-header mb-3">
      <h3>Signup</h3>
    </div>
    <form class="form-body" @submit.prevent="handleRegister">
      <div class="form-body">
        <div class="form-group mb-2">
          <label for="name">Name</label>
          <input
            class="form-control"
            id="name"
            type="text"
            v-bind="name"
            placeholder="Enter your name"
          />
          <ErrorMessage v-if="errors.name" :errorMessage="errors.name" />
        </div>
        <div class="form-group mb-2">
          <label for="username">Username</label>
          <input
            class="form-control"
            id="username"
            type="text"
            v-bind="username"
            placeholder="Enter your username"
          />
          <ErrorMessage v-if="errors.username" :errorMessage="errors.username" />
        </div>
        <div class="form-group mb-2">
          <label for="email">Email</label>
          <input
            class="form-control"
            id="email"
            type="text"
            v-bind="email"
            placeholder="Enter your email"
          />
          <ErrorMessage v-if="errors.email" :errorMessage="errors.email" />
        </div>
        <div class="form-group mb-2">
          <label for="institute">Institute</label>
          <input
            class="form-control"
            id="institute"
            type="text"
            v-bind="institute"
            placeholder="Enter your institute"
          />
          <ErrorMessage v-if="errors.institute" :errorMessage="errors.institute" />
        </div>
        <div class="form-group mb-2">
          <label for="location">Location</label>
          <input
            class="form-control"
            id="location"
            type="text"
            v-bind="location"
            placeholder="Enter your location"
          />
          <ErrorMessage v-if="errors.location" :errorMessage="errors.location" />
        </div>
        <div class="form-group mb-2">
          <label for="password">Password</label>
          <div class="with-icon">
            <input
              class="form-control"
              id="password"
              :type="togglePassword ? 'text' : 'password'"
              v-bind="password"
              placeholder="Enter your password"
            />
            <span class="-icon" @click="toggleView">
              <i :class="togglePassword ? 'eye-icon' : 'eye-slash-icon'"></i>
            </span>
          </div>
          <ErrorMessage v-if="errors.password" :errorMessage="errors.password" />
        </div>
        <div class="form-group mb-4">
          <label for="cpassword">Confirm Password</label>
          <div class="with-icon">
            <input
              class="form-control"
              id="cpassword"
              :type="toggleCPassword ? 'text' : 'password'"
              v-bind="cpassword"
              placeholder="Confirm your password"
            />
            <span class="-icon" @click="toggleCView">
              <i :class="toggleCPassword ? 'eye-icon' : 'eye-slash-icon'"></i>
            </span>
          </div>
          <ErrorMessage v-if="errors.cpassword" :errorMessage="errors.cpassword" />
        </div>
        <div class="form-group">
          <AppButton
            label="Signup"
            class="btn-primary btn-block"
            :isLoading="isLoading"
            :handleClick="handleRegister"
          />
        </div>
        <p class="text-center mt-1">Already have an account? <a href="/login">Login</a></p>
      </div>
    </form>
  </div>
</template>
<script setup>

import { ref } from 'vue'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import AppButton from '../../components/common/AppButton.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'

/* Data */
const router = useRouter()
const isLoading = ref(false)
const auth = useAuthStore()
const togglePassword = ref(false)
const toggleCPassword = ref(false)
/* Effects */

const { errors, handleSubmit, defineInputBinds } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Name is required'),
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    institute: yup.string().required('Institue is required'),
    location: yup.string().required('Location is required'),
    password: yup.string().required('Password is required'),
    cpassword: yup.string().required('Confirm password is required')
  })
})


const name = defineInputBinds('name')
const username = defineInputBinds('username')
const email = defineInputBinds('email')
const institute = defineInputBinds('institute')
const location = defineInputBinds('location')
const password = defineInputBinds('password')
const cpassword = defineInputBinds('cpassword')

const handleRegister = handleSubmit((vals) => {
  isLoading.value = true
  auth.register(vals)
  isLoading.value = false
})

function toggleView() {
  togglePassword.value = !togglePassword.value
}

function toggleCView() {
  toggleCPassword.value = !toggleCPassword.value
}
</script>
<style lang="scss">
</style>
