<template>
  <div class="main-content exploration-page">
    <HeaderCrumbs label="Exploration View" title="" />

    <section class="tabs-shell">
      <div class="tabs-header">
        <div class="tabs-list" role="tablist" aria-label="Exploration tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="tab-button"
            :class="{ active: currentTab?.id === tab.id }"
            @click="setCurrentTab(tab)"
          >
            <span class="tab-title">{{ tab.name }}</span>

            <span
              class="tab-close"
              role="button"
              tabindex="0"
              aria-label="Close tab"
              @click.stop="closeTab(tab)"
              @keydown.enter.stop="closeTab(tab)"
            >
              ×
            </span>
          </button>
        </div>

        <button type="button" class="add-tab-btn" @click="addTab()">
          + Add Tab
        </button>
      </div>

      <div class="tabs-body">
        <component
          :is="currentTab?.component || PlaceholderComponent"
          :key="currentTab?.id || 'placeholder'"
          :tab="currentTab"
          @update-tab-data="updateTabData"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import Tab from '../../components/Tab.vue'

const emit = defineEmits(['update-tab-data'])

const PlaceholderComponent = markRaw({
  template: `
    <div class="placeholder-state">
      <div class="placeholder-icon">📂</div>
      <h3>No tab open</h3>
      <p>Create a new tab to start exploring your data.</p>
    </div>
  `,
})

const tabs = ref([])
const currentTab = ref(null)
let tabId = 1

function createTab(initialData = {}) {
  const currentId = tabId++
  const customName = window.prompt('Set the name of your tab', `Tab ${currentId}`)

  return {
    id: currentId,
    number: currentId,
    name: customName?.trim() || `Tab ${currentId}`,
    component: markRaw(Tab),
    data: {
      method_filter: null,
      x_axis: null,
      y_axis: null,
      categorical: null,
      other_filters: {},
      experiment_method_filter: {},
      chart_types: null,
      ...initialData,
    },
    chartData: null,
  }
}

function addTab(initialData = {}) {
  const newTab = createTab(initialData)
  tabs.value.push(newTab)
  currentTab.value = newTab
}

function setCurrentTab(tab) {
  currentTab.value = tab
}

function closeTab(tabToClose) {
  const index = tabs.value.findIndex((tab) => tab.id === tabToClose.id)
  if (index === -1) return

  const wasActive = currentTab.value?.id === tabToClose.id
  tabs.value.splice(index, 1)

  if (!tabs.value.length) {
    currentTab.value = null
    return
  }

  if (wasActive) {
    currentTab.value = tabs.value[Math.max(0, index - 1)]
  }
}

function updateTabData(data) {
  emit('update-tab-data', data)
}

onMounted(() => {
  if (!tabs.value.length) {
    addTab()
  }
})
</script>

<style scoped>
.exploration-page {
  padding: 1rem;
}

.tabs-shell {
  margin-top: 1rem;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
}

.tabs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eef2f7;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  flex-wrap: wrap;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 1rem;
  border: 1px solid #dbe3ec;
  border-radius: 999px;
  background: #fff;
  color: #334155;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tab-button:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.tab-button.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
}

.tab-title {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  transition: background 0.2s ease;
}

.tab-close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.add-tab-btn {
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: #0f172a;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

.add-tab-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.tabs-body {
  padding: 1rem;
}

.placeholder-state {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-align: center;
}

.placeholder-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.placeholder-state h3 {
  margin: 0 0 0.4rem;
  color: #0f172a;
  font-weight: 700;
}

.placeholder-state p {
  margin: 0;
}

@media (max-width: 768px) {
  .tabs-header {
    align-items: stretch;
  }

  .add-tab-btn {
    width: 100%;
  }

  .tab-title {
    max-width: 110px;
  }
}
</style>