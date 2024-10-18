<template>
  <button @click="handleClick" :type="type" class="btn" :disabled="disabled" :class="$attrs.class">
    <span class="-icon" v-if="icon"><i :class="icon"></i></span>
    {{ isLoading ? 'Loading...' : label }}
  </button>
</template>
<script>
export default {
  props: {
    icon: String | null,
    label: String,
    isLoading: Boolean,
    disabled: Boolean,
    handleClick: Function,
    btnClass: String,
    type: String
  }
}
</script>
<style lang=""></style>
