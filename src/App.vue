<script>
import { RouterView } from 'vue-router'
import DashboardLayout from './layouts/DashboardLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import PlainLayout from './layouts/PlainLayout.vue'

export default {
  components: {
    DashboardLayout,
    PlainLayout,
    AuthLayout
  },
  data() {
    return {
      layout: null
    }
  },
  watch: {
    $route(to) {
      if (to.meta.layout !== undefined) {
        this.layout = to.meta.layout
      } else {
        this.layout = 'DashboardLayout' // this is default layout if route meta is not set
      }
    }
  }
}
</script>

<template>
  <component :is="layout" />
</template>
<style lang="scss">
@use '@/assets/scss/main.scss';

.app-footer {
  bottom: 0;
}
</style>
