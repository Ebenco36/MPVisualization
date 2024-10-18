<template>
  <div>
    <div v-if="serv">
      <div class="alert alert-danger" v-if="Array.isArray(errorMessage)">
        <ul v-for="error in errorMessage" :key="error">
          <li>{{ error.error }}</li>
        </ul>
      </div>
      <div class="alert alert-danger" v-else>
        <small class="text-danger" :class="$attrs.class">{{ errorMessage }}</small>
      </div>
    </div>
    <div v-else>
      <small class="text-danger" :class="$attrs.class">{{ errorMessage }}</small>
    </div>
  </div>
</template>
<script setup>
defineProps({
  errorMessage: String,
  serv: Boolean
})
</script>
<style lang=""></style>
