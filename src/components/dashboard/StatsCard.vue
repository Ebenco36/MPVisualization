<template>
  <div class="card card-icon-bg card-icon-bg-primary o-hidden mb-4" :class="$attrs.class">
    <div class="card-body">
      <i :class="icon"></i>
      <div class="content">
        <p class="mt-2 mb-2">{{ label }}</p>
        <p class="text-24 line-height-1">{{ count ? currencyFormatter(count) : "Loading ..." }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import currencyFormatter from '../../composables/thousandFormat'
defineProps({
  icon: String,
  label: String,
  count: Number
})
</script>
<style lang="scss" scoped>
.card-icon-bg {
  .card-body {
    justify-content: space-between;
    .content {
      align-items: flex-end;
      justify-content: space-between;
      margin: 0;
      max-width: 50%;
      
    }
  }
}
</style>
