<template>
  <div class="mpv-onboard-wrapper">
    <div class="container">
      <div class="row justify-content-center">
        <h1>Page Not Found</h1>
        <p>Please try to check your link, this page does not exist</p>
        <AppButton 
          label="Continue" 
          :handleClick="redirectTo"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import AppButton from '../components/common/AppButton.vue';

const router = useRouter();

function redirectTo() {
  router.push('/evaluation')
}
</script>
<style lang=""></style>
