<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTemplateStore } from '@/stores/template_switch'
import imagePath from '@/assets/image/metamp-owl.png';
import user_placeholder from '@/assets/image/user_placeholder.jpeg'

const router = useRouter()
const authData = useAuthStore()
const menu_switch = useTemplateStore()
const user = authData.auth.user
function handleLogout() {
  router.push('/login')
  authData.logout()
}

function handleProfile() {
  router.push('/profile')
}

function switch_m() {
  menu_switch?.toggleMenu()
}


onMounted(() => {
  if(!user)
    authData.loadUser()
})
</script>
<style lang="scss"></style>
<template>
  <div class="main-header">
    <div class="logo">
      <img :src="imagePath" alt="" style="width:fit-content!important"/>
    </div>
    <div class="menu-toggle" @click="switch_m">
      <div></div>
      <div></div>
      <div></div>
    </div>
    
      <div class="d-flex align-items-center">
        <!-- Mega menu -->
        <div class="dropdown mega-menu d-none d-md-block font-weight-bold" style="font-size: 12pt; width: 100%;">
          <router-link class="nav-item-hold" to="/welcome">Home </router-link>
          <router-link class="nav-item-hold" to="/dashboard"> <span style="font-size: 14pt;">|</span>  Dashboard </router-link>
          <router-link class="nav-item-hold" to="/make-submission"> <span style="font-size: 14pt;">|</span>  Make Submission </router-link>
          <router-link class="nav-item-hold" to="/summary"> <span style="font-size: 14pt;">|</span>  Summary Statistics </router-link>
          <router-link class="nav-item-hold" to="/metamp-about"> <span style="font-size: 14pt;">|</span> About MetaMP </router-link>
          <router-link class="nav-item-hold" to="/contact"> <span style="font-size: 14pt;">|</span>  Contact </router-link>
        </div>
        <!-- <div class="search-bar">
          <input type="text" placeholder="Search" />
          <i class="search-icon text-muted i-Magnifi-Glass1"></i>
        </div> -->
      </div>
   
    <div style="margin: auto"></div>
    <div class="header-part-right">
      
      <!-- User avatar dropdown -->
      <div class="dropdown" id="view-profile">
        <div class="user col align-self-end">
          <img
            :src="user_placeholder"
            id="userDropdown"
            alt=""
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          />
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
            <div class="dropdown-header"><i class="i-Lock-User mr-1"></i> {{ user.name }}</div>
            <a class="dropdown-item" @click="handleProfile">Profile</a>
            <span class="dropdown-item" @click="handleLogout">Sign out</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>