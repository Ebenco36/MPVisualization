<template>
  <div class="form-group mb-2">
    <label :for="id">{{ name }}</label>
    <input
      class="form-control"
      :id="id"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @input="$emit('update:value', $event.target.value)"
    />
  </div>
</template>
<script setup>
defineProps({
  label: String,
  id: String,
  name: String,
  onChange: Function,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  value: String
})

defineEmits(['update:value'])
</script>
<style lang=""></style>
