<template>
  <div class="form-group mb-2">
    <label :for="id">{{ name }}</label>
    <input
      class="form-control"
      :id="id"
      type="text"
      :v-model="value"
      :placeholder="placeholder"
    />
  </div>
</template>
<script>
defineProps({
  label: String,
  id: String,
  name: String,
  onChange: Function,
  type: String,
  placeholder: String,
  value: String
})

function updateInput() {}
</script>
<style lang=""></style>
