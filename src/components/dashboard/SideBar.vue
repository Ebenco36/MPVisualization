<template>
  <div class="side-content-wrap">
    <div
      ref="sidebarLeft"
      :class="[(menu_switch?.menu_switch?.menu) ? 'open' : 'close', 'sidebar-left rtl-ps-none']"
      data-perfect-scrollbar
      data-suppress-scroll-x="true"
    >
      <ul class="navigation-left">
        <li class="nav-item" id="mpvis_welcome">
          <router-link class="nav-item-hold" to="/welcome">
            <i class="nav-icon i-Home-2"></i>
            <span class="nav-text">Home</span>
          </router-link>
        </li>

        <li class="nav-item" id="mpvis_dashboard">
          <router-link class="nav-item-hold" to="/dashboard">
            <i class="nav-icon i-Bar-Chart"></i>
            <span class="nav-text">Overview</span>
          </router-link>
        </li>
        <li class="nav-item" id="mpvis_summary_stats">
          <router-link class="nav-item-hold" to="/summary"><i class="nav-icon i-Bar-Chart-5"></i><span
              class="nav-text">Statistics</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>
        <li class="nav-item" id="mpvis_use_cases_outlier_detection">
          <router-link class="nav-item-hold" to="/usecase" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Suitcase"></i> <span class="nav-text">AI Use-cases</span>
          </router-link>
        </li>
        <li class="nav-item" id="mpvis_use_cases_discrepancies">
          <router-link class="nav-item-hold" to="/use-cases/discrepancies" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Suitcase"></i> <span class="nav-text">Data Discrepancy</span>
          </router-link>
        </li>
        <li class="nav-item" id="mpvis_use_cases_outlier_detection">
          <router-link class="nav-item-hold" to="/use-cases/outlier_detection" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Suitcase"></i> <span class="nav-text">Outlier Detection</span>
          </router-link>
        </li>
        
        <li class="nav-item nav-item" id="mpvis_database">
          <router-link class="nav-item-hold" to="/databaseTable" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Big-Data"></i><span class="nav-text">Database</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>
        <li class="nav-item" id="mpvis_evaluation">
          <router-link class="nav-item-hold" to="/exploration" @click.prevent="menu_switch?.toggleMenu()">
            <i class="nav-icon i-Internet-Explorer"></i>
            <span class="nav-text">Exploration</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>

        <li class="nav-item" id="mpvis_training">
          <router-link class="nav-item-hold" to="/evaluation" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Library"></i><span class="nav-text">Evaluation</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>

        <li class="nav-item" id="mpvis_sunburst">
          <router-link class="nav-item-hold" to="/sunburst" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Pie-Chart-3"></i> <span class="nav-text">Other Charts</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>
        <li class="nav-item" id="mpvis_machine-learning-prediction">
          <router-link class="nav-item-hold" to="/machine-learning-prediction" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Cloud-Computer"></i> <span class="nav-text">MPs Grouping</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>
        <!-- <li class="nav-item" data-item="mpvis_use_cases" id="mpvis_use_cases">
          <router-link class="nav-item-hold" to="/use-cases" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Suitcase"></i> <span class="nav-text">Use Cases</span>
          </router-link>
          <div class="triangle"></div>
        </li> -->
        <li class="nav-item" id="mpvis_contact">
          <router-link class="nav-item-hold" to="/contact" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Computer-Secure"></i><span class="nav-text">Contact Us</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>

        <li class="nav-item" id="mpvis_about">
          <router-link class="nav-item-hold" to="/metamp-about" @click="menu_switch?.toggleMenu()"><i
              class="nav-icon i-Computer-Secure"></i> <span class="nav-text">About</span>
          </router-link>
          <!-- <div class="triangle"></div> -->
        </li>
      </ul>
    </div>


    <div class="sidebar-overlay" @click="handleOverlayClick" ref="sidebarOverlay"></div>
  </div>
</template>

<script setup>
import { useTemplateStore } from '@/stores/template_switch'

const menu_switch = useTemplateStore()
</script>

<style lang="scss">
.navigation-left {
  overflow: auto;
}

.nav-item.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
