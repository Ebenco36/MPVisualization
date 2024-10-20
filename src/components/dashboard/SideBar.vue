<template>
  <div class="side-content-wrap">
    <div
      :class="[menu_switch.menu_switch.menu ? 'open' : 'close', 'sidebar-left rtl-ps-none']"
      data-perfect-scrollbar=""
      data-suppress-scroll-x="true"
    >
      <ul class="navigation-left">
        
        <!-- <li class="nav-item" data-item="welcome" id="mpvis_welcome">
          <router-link class="nav-item-hold" to="/welcome"
            ><i class="nav-icon i-Laptop-Secure"></i>
            <span class="nav-text">Home</span>
          </router-link>
          <div class="triangle"></div>
        </li> -->

        <li class="nav-item" data-item="dashboard" id="mpvis_dashboard">
          <router-link class="nav-item-hold" to="/dashboard"
            ><i class="nav-icon i-Bar-Chart"></i><span class="nav-text">Overview</span>
          </router-link>
          <div class="triangle"></div>
        </li>
        <li class="nav-item" data-item="summary" id="mpvis_summary_stats">
          <router-link class="nav-item-hold" to="/summary"
            ><i class="nav-icon i-Bar-Chart-5"></i><span class="nav-text">Summary Statistics</span>
          </router-link>
          <div class="triangle"></div>
        </li>
        <li class="nav-item" data-item="mpvis_use_cases_discrepancies" id="mpvis_use_cases_discrepancies">
          <router-link class="nav-item-hold" to="/use-cases/discrepancies" @click="handleClick()"
            ><i class="nav-icon i-Suitcase"></i> <span class="nav-text">Data Discrepancy</span>
          </router-link>
          <div class="triangle"></div>  
        </li>
        <li class="nav-item" data-item="mpvis_use_cases_outlier_detection" id="mpvis_use_cases_outlier_detection">
          <router-link class="nav-item-hold" to="/use-cases/outlier_detection" @click="handleClick()"
            ><i class="nav-icon i-Suitcase"></i> <span class="nav-text">Outlier Detection</span>
          </router-link>
          <div class="triangle"></div>
        </li>
        <li class="nav-item" data-item="databaseTable" id="mpvis_database">
          <router-link class="nav-item-hold" to="/databaseTable" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Big-Data"></i><span class="nav-text">Database</span>
          </router-link>
          <div class="triangle"></div>
        </li>
        <li class="nav-item" data-item="exploration" id="mpvis_evaluation">
          <router-link class="nav-item-hold" to="/exploration" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Internet-Explorer"></i><span class="nav-text">Exploration</span>
          </router-link>
          <div class="triangle"></div>
        </li>
        
        <li class="nav-item" data-item="training" id="mpvis_training">
          <router-link class="nav-item-hold" to="/evaluation" @click="menu_switch?.toggleMenu()"
              ><i class="nav-icon i-Library"></i><span class="nav-text">Evaluation</span>
          </router-link>
          <div class="triangle"></div>
        </li>
        
        <!-- <li class="nav-item" data-item="sunburst" id="mpvis_sunburst">
          <router-link class="nav-item-hold" to="/sunburst" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Pie-Chart-3"></i> <span class="nav-text">Other Charts</span>
          </router-link>
          <div class="triangle"></div>
        </li> -->
         <li class="nav-item" data-item="machine-learning-prediction" id="mpvis_machine-learning-prediction">
          <router-link class="nav-item-hold" to="/machine-learning-prediction" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Cloud-Computer"></i> <span class="nav-text">MPs Grouping</span>
          </router-link>
          <div class="triangle"></div>
        </li>
        <!-- <li class="nav-item" data-item="mpvis_use_cases" id="mpvis_use_cases">
          <router-link class="nav-item-hold" to="/use-cases" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Suitcase"></i> <span class="nav-text">Use Cases</span>
          </router-link>
          <div class="triangle"></div>
        </li> -->

        <!-- <li class="nav-item" data-item="about" id="mpvis_about">
          <router-link class="nav-item-hold" to="/about" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Computer-Secure"></i> <span class="nav-text">About Us</span>
          </router-link>
          <div class="triangle"></div>
        </li> -->
        <li class="nav-item" data-item="contact" id="mpvis_contact">
          <router-link class="nav-item-hold" to="/contact" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Computer-Secure"></i><span class="nav-text">Contact Us</span>
          </router-link>
          <div class="triangle"></div>
        </li>

        <li class="nav-item" data-item="about" id="mpvis_about">
          <router-link class="nav-item-hold" to="/metamp-about" @click="menu_switch?.toggleMenu()"
            ><i class="nav-icon i-Computer-Secure"></i> <span class="nav-text">About</span>
          </router-link>
          <div class="triangle"></div>
        </li>
       
      </ul>
    </div>
    
    <div class="sidebar-overlay"></div>
  </div>
</template>
<script setup>

import { useTemplateStore } from '@/stores/template_switch'

const menu_switch = useTemplateStore()

function handleClick() {
    this.menu_switch.toggleMenu();
    // Reload the page
    window.location.reload();
  }

function loadDynamicPath(path = '/evaluation') {
    const host = window.location.origin;
    // Construct the full URL
    const fullURL = `${host}${path}`;
    window.location.href = fullURL;
}
</script>
<style lang="scss">
.navigation-left{
  overflow: auto;
}
</style>
