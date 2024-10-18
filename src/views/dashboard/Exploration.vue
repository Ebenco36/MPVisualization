<!-- Home.vue -->
<template>
    <div class="main-content">
      <HeaderCrumbs label="Exploration View" title="" />
      <div class="nav nav-tabs">
        <div v-for="tab in tabs" :key="tab.id" class="nav-item">
          <button @click="setCurrentTab(tab)" class="nav-link" :class="{ 'active': currentTab.id === tab.id }">
            {{ tab.name }} <span @click="closeTab(tab)">x</span>
          </button>
        </div>
        <button @click="addTab" class="btn btn-primary ml-3 mt-2">Add Tab</button>
      </div>
      <component :is="currentTab.component" :tab="currentTab" @update-tab-data="updateTabData" />
    </div>
  </template>
  
  <script setup>
    import { ref, markRaw, shallowRef, onMounted, defineEmits } from 'vue';
    import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
    import axios from 'axios';
    import Tab from "../../components/Tab.vue";
    
    const emit = defineEmits(['update-tab-data']);
    
    const tabs = ref([]);
    let tabId = 0;
    const currentTab = ref(markRaw({ id: 0, name: '', component: 'PlaceholderComponent' }));

    const addTab = (initialData = {}) => {
        const tabName = window.prompt("Set the name of your tab?", "Default text");
        const newTab = {
        id: tabId++,
        number: tabId,
        name: (tabName) ? tabName : `Tab ${tabId}`,
        component: Tab,
        data: {
            [`method_filter_${tabId}`]: null,
            [`x_axis_${tabId}`]: null,
            [`y_axis_${tabId}`]: null,
            [`categorical_${tabId}`]: null,
            [`other_filters_${tabId}`]: {},
            [`experiment_method_filter_${tabId}`]: {},
            ...initialData,
        },
        chartData: null,
        };
        tabs.value.push(newTab);
        setCurrentTab(newTab);
    };
    
    const setCurrentTab = (tab) => {
        currentTab.value = tab;
    };
  
    const closeTab = (tab) => {
        const tabIndex = tabs.value.findIndex(t => t.id === tab.id);
        tabs.value.splice(tabIndex, 1);
    
        if (currentTab.value.id === tab.id && tabs.value.length > 0) {
        currentTab.value = tabs.value[tabs.value.length - 1];
        } else {
        currentTab.value = markRaw({ id: 0, name: '', component: 'PlaceholderComponent' });
        }
    };
    
    const PlaceholderComponent = markRaw({ template: '<div>Placeholder Component</div>' });
    onMounted(() => {
        addTab(); // Add Tab 1
    });
  
    // Emit an event to notify the Tab component about the updated chart data
    const updateTabData = (data) => {
        emit('update-tab-data', data);
    };
</script>