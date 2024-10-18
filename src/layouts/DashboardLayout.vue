<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'
import SideBar from '../components/dashboard/SideBar.vue'
import AppFooter from '../components/common/AppFooter.vue';
import { useTemplateStore } from '@/stores/template_switch'

const menu_switch = useTemplateStore()

const router = useRouter()
const route = useRoute()

</script>

<template>
  <div class="app-admin-wrap layout-sidebar-large">
    <DashboardHeader />
    <SideBar />
    <div  
      :class="[menu_switch.menu_switch.menu ? 'sidenav-open' : '', 'main-content-wrap d-flex flex-column']"
    >
      <RouterView />
      <AppFooter />
    </div>
  </div>
</template>
