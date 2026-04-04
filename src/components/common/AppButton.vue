<template>
  <button @click="handleClick" :type="type" class="btn" :disabled="disabled || isLoading" :class="$attrs.class">
    <span class="-icon" v-if="icon"><i :class="icon"></i></span>
    {{ isLoading ? 'Loading...' : label }}
  </button>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handleClick: {
      type: Function,
      default: null
    },
    btnClass: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'button'
    }
  }
}
</script>
<style lang=""></style>
