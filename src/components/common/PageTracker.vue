<!-- components/PageTracking.vue -->
<template>
    <div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watchEffect, onBeforeUnmount, defineProps, toRefs } from 'vue';
  import { onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';
  import { logEvent } from '../../services/logger';
  
    const props = defineProps({
        pageTitle: String
    })

    const { pageTitle } = toRefs(props)

    const pageStartTime = ref(0);
    
    // Track page view on component mount
    onMounted(() => {
        pageStartTime.value = Date.now();
        logEvent('page_view', { page: pageTitle.value });
    });

    // Watch for route changes and track page leave
    watchEffect(() => {
        onBeforeUnmount(() => {
            const pageDuration = Date.now() - pageStartTime.value;
            logEvent('page_leave', { page: pageTitle.value, duration: pageDuration });
        });
    });
</script>
  