<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTemplateStore } from '@/stores/template_switch'
import imagePath from '@/assets/image/metamp-owl.svg'

const authData = useAuthStore()
const menu_switch = useTemplateStore()

function switch_m() {
  menu_switch?.toggleMenu()
}

onMounted(() => {
  if (!authData.auth.user) {
    authData.ensureSession()
  }
})
</script>
<style lang="scss"></style>
<template>
  <div class="main-header">
    <div class="logo">
      <img :src="imagePath" alt="" style="width:max-content!important; color: #005EB8;" />
    </div>
    <div class="menu-toggle" @click="switch_m">
      <div></div>
      <div></div>
      <div></div>
    </div>

    <div class="d-flex align-items-center">
      <div class="dropdown mega-menu d-none d-md-block font-weight-bold" style="font-size: 12pt; width: 100%;">
        <router-link class="nav-item-hold" to="/welcome">Home </router-link>
        <router-link class="nav-item-hold" to="/dashboard"> <span style="font-size: 14pt;">|</span> Dashboard </router-link>
        <router-link class="nav-item-hold" to="/make-submission"> <span style="font-size: 14pt;">|</span> Make Submission </router-link>
        <router-link class="nav-item-hold" to="/summary"> <span style="font-size: 14pt;">|</span> Summary Statistics </router-link>
        <router-link class="nav-item-hold" to="/metamp-about"> <span style="font-size: 14pt;">|</span> About MetaMP </router-link>
        <router-link class="nav-item-hold" to="/contact"> <span style="font-size: 14pt;">|</span> Contact </router-link>
      </div>
    </div>

    <div style="margin: auto"></div>
  </div>
</template>
