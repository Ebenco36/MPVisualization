<template>
  <div class="breadcrumb">
    <h1 class="mr-2">{{ label }}</h1>
    <ul>
      <li>{{ title }}</li>
      <!-- <li>Version 1</li> -->
    </ul>
  </div>
  <div class="separator-breadcrumb border-top"></div>
</template>
<script setup>
defineProps({
  label: String,
  title: String
})
</script>
<style lang=""></style>
