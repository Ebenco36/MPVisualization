<template lang="">
    <div class="wrapp-center">
      <div class="app-model-card">
        <div class="container mt-5">
          <img style="display: block; margin-left: auto; margin-right: auto;" :src="thankYou" width="70%" alt="" />
          <a href="https://www.cleanpng.com/png-group-of-people-group-holds-heart-and-sign-saying-7846244/">Image from cleanpng</a>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTrainingStore } from '../../stores/training'
  import thankYou from '@/assets/image/thankyou.jpeg';
  
  const props = defineProps({
    type: String,
  })
  const { type } = toRefs(props)
  
  const router = useRouter()
  
  const training = useTrainingStore()
  </script>
  <style lang=""></style>
  