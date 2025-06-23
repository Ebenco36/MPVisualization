<template>
  <div class="wrapp-center">
    <div class="app-model-card success">
      <div class="icon-wrapper">
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="75" cy="75" r="75" fill="#64B25C" />
          <path
            d="M51.9004 74.4044L66.4029 88.9069L105.136 50.1736"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h2 class="title">Congratulations!</h2>
      <p>Thanks for taking part and providing your feedback. Press the "continue" button to proceed with the test.</p>
      <AppButton
        label="Continue"
        class="btn-primary btn-large mt-3"
        :isLoading="isLoading"
        :handleClick="handleContinue"
      />
    </div>
  </div>
</template>
<script setup>
import AppButton from '@/components/common/AppButton.vue'
// import { useTrainingStore } from '@/stores/training'
// import { useRouter } from 'vue-router'
// import { toRefs } from 'vue'

// const props = defineProps({
//   type: String,
// })
// const { type } = toRefs(props)

// const router = useRouter()
// const training = useTrainingStore()

function handleContinue() {
  loadDynamicPath('/welcome')
  /*
  if (type.value === "training"){
    training.updateTrainingStatus('')
    loadDynamicPath('/evaluation')
  } else {
    loadDynamicPath('/welcome')
  }
  */
}

function loadDynamicPath(path = '/welcome') {
  const host = window.location.origin;
  // Construct the full URL
  const fullURL = `${host}${path}`;
  window.location.href = fullURL;
}
</script>
<style lang=""></style>