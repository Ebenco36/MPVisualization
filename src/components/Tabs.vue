<template>
    <div>
        <div class="nav nav-tabs">
        <router-link :to="{ name: 'tab', params: { id: currentTab.id } }" class="nav-item nav-link" v-for="tab in tabs" :key="tab.id">
            {{ tab.name }}
        </router-link>
        </div>
        <router-view :key="currentTab.id" />
    </div>
</template>
  
<script setup>
    import { ref, defineProps } from 'vue';

    const { tabs, currentTab } = defineProps(['tabs', 'currentTab']);
</script>
  