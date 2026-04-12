<template>
  <div class="side-content-wrap" @mouseleave="handleSidebarMouseLeave">
    <div
      ref="sidebarLeft"
      :class="[isMenuOpen ? 'open' : 'close', 'sidebar-left rtl-ps-none']"
      data-perfect-scrollbar
      data-suppress-scroll-x="true"
    >
      <ul class="navigation-left">
        <li
          v-for="item in primaryItems"
          :key="item.key"
          :class="['nav-item', { active: isPrimaryActive(item) }]"
          :data-item="item.key"
          @mouseenter="handlePrimaryHover(item, $event)"
          @mousemove="handlePrimaryPointerMove(item, $event)"
        >
          <router-link
            v-if="item.type === 'link'"
            class="nav-item-hold"
            :to="item.to"
            @click="handleDirectNavigation"
          >
            <i :class="['nav-icon', item.icon]"></i>
            <span class="nav-text">{{ item.label }}</span>
          </router-link>

          <a
            v-else
            class="nav-item-hold"
            href=""
            @click.prevent="openGroup(item.key, $event)"
          >
            <i :class="['nav-icon', item.icon]"></i>
            <span class="nav-text">{{ item.label }}</span>
          </a>

          <div class="triangle"></div>
        </li>
      </ul>
    </div>

    <div
      ref="sidebarSecondary"
      :class="['sidebar-left-secondary rtl-ps-none dynamic-secondary', { open: isSecondaryOpen }]"
      :style="secondaryStyle"
      data-perfect-scrollbar
      data-suppress-scroll-x="true"
    >
      <ul
        v-for="group in groupedItems"
        :key="group.key"
        :class="['childNav', { 'active-submenu': activeGroupKey === group.key }]"
        :data-parent="group.key"
      >
        <li
          v-for="child in group.children"
          :key="child.key"
          :class="['nav-item', { active: isChildActive(child) }]"
        >
          <router-link
            :to="child.to"
            :class="{ open: isChildActive(child) }"
            @click="handleChildNavigation(group.key)"
          >
            <i :class="['nav-icon', child.icon]"></i>
            <span class="item-name">{{ child.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div
      ref="sidebarOverlay"
      :class="['sidebar-overlay', { open: isSecondaryOpen }]"
      @click="handleOverlayClick"
    ></div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useTemplateStore } from '@/stores/template_switch'

const route = useRoute()
const menu_switch = useTemplateStore()

const isMenuOpen = computed(() => Boolean(menu_switch?.menu_switch?.menu))
const sidebarLeft = ref(null)
const sidebarSecondary = ref(null)
const hoverAnchorEl = ref(null)
const submenuPosition = ref({
  top: 96,
  left: 132,
  maxHeight: 480
})

const primaryItems = [
  {
    key: 'home',
    type: 'link',
    to: '/welcome',
    icon: 'i-Home-2',
    label: 'Home',
    matches: ['/welcome']
  },
  {
    key: 'overview',
    type: 'group',
    icon: 'i-Bar-Chart',
    label: 'Overview',
    children: [
      {
        key: 'overview-dashboard',
        to: '/dashboard',
        icon: 'i-Bar-Chart',
        label: 'Overview',
        matches: ['/dashboard']
      },
      {
        key: 'overview-statistics',
        to: '/summary',
        icon: 'i-Bar-Chart-5',
        label: 'Statistics',
        matches: ['/summary']
      }
    ]
  },
  {
    key: 'use-cases',
    type: 'group',
    icon: 'i-Suitcase',
    label: 'Use Cases',
    children: [
      {
        key: 'use-cases-ai',
        to: '/usecase',
        icon: 'i-Suitcase',
        label: 'AI Use-cases',
        matches: ['/usecase']
      },
      {
        key: 'use-cases-discrepancies',
        to: '/use-cases/discrepancies',
        icon: 'i-Duplicate-Layer',
        label: 'Data Discrepancy',
        matches: ['/use-cases/discrepancies']
      },
      {
        key: 'use-cases-outlier',
        to: '/use-cases/outlier_detection',
        icon: 'i-Filter-2',
        label: 'Outlier Detection',
        matches: ['/use-cases/outlier_detection']
      }
    ]
  },
  {
    key: 'database',
    type: 'link',
    to: '/databaseTable',
    icon: 'i-Data-Search',
    label: 'Database',
    matches: ['/databaseTable']
  },
  {
    key: 'analysis',
    type: 'group',
    icon: 'i-Internet-Explorer',
    label: 'Analysis',
    children: [
      {
        key: 'analysis-exploration',
        to: '/exploration',
        icon: 'i-Internet-Explorer',
        label: 'Exploration',
        matches: ['/exploration']
      },
      {
        key: 'analysis-evaluation',
        to: '/evaluation',
        icon: 'i-Line-Chart',
        label: 'Evaluation',
        matches: ['/evaluation']
      },
      {
        key: 'analysis-charts',
        to: '/sunburst',
        icon: 'i-Pie-Chart-3',
        label: 'Other Charts',
        matches: ['/sunburst']
      }
    ]
  },
  {
    key: 'contact',
    type: 'link',
    icon: 'i-Mail',
    label: 'Contact Us',
    to: '/contact',
    matches: ['/contact']
  },
  {
    key: 'about',
    type: 'link',
    icon: 'i-Information',
    label: 'About',
    to: '/metamp-about',
    matches: ['/metamp-about', '/about']
  }
]

const groupedItems = primaryItems.filter((item) => item.type === 'group')
const openedGroupKey = ref(null)

const matchesRoute = (matches = []) =>
  matches.some((basePath) => route.path === basePath || route.path.startsWith(`${basePath}/`))

const routeGroupKey = computed(() => {
  const activeGroup = groupedItems.find((group) =>
    group.children.some((child) => matchesRoute(child.matches))
  )

  return activeGroup?.key ?? null
})

const activeGroupKey = computed(() => openedGroupKey.value)
const isSecondaryOpen = computed(() => isMenuOpen.value && Boolean(activeGroupKey.value))
const secondaryStyle = computed(() => ({
  top: `${submenuPosition.value.top}px`,
  left: `${submenuPosition.value.left}px`,
  maxHeight: `${submenuPosition.value.maxHeight}px`
}))

watch(
  () => route.path,
  async () => {
    openedGroupKey.value = routeGroupKey.value
    await nextTick()
    updateSecondaryPosition(hoverAnchorEl.value)
  },
  { immediate: true }
)

function isPrimaryActive(item) {
  if (item.type === 'group') {
    return routeGroupKey.value === item.key || activeGroupKey.value === item.key
  }

  return matchesRoute(item.matches)
}

function isChildActive(child) {
  return matchesRoute(child.matches)
}

function openSidebarIfNeeded() {
  if (!isMenuOpen.value) {
    menu_switch?.toggleMenu()
  }
}

function closeSidebarOnSmallScreens() {
  if (typeof window === 'undefined') {
    return
  }

  if (window.innerWidth < 1200 && isMenuOpen.value) {
    menu_switch?.toggleMenu()
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function resolveAnchorElement(eventOrElement) {
  const candidate = eventOrElement?.currentTarget ?? eventOrElement
  if (typeof HTMLElement !== 'undefined' && candidate instanceof HTMLElement) {
    return candidate
  }
  return null
}

function updateSecondaryPosition(anchorEl, pointerEvent = null) {
  if (typeof window === 'undefined' || !sidebarSecondary.value) {
    return
  }

  const viewportPadding = 12
  const railRect = sidebarLeft.value?.getBoundingClientRect?.()
  const anchorRect = anchorEl?.getBoundingClientRect?.() || railRect
  const panelWidth = sidebarSecondary.value.offsetWidth || 240
  const activeSubmenu = activeGroupKey.value
    ? sidebarSecondary.value.querySelector(`[data-parent="${activeGroupKey.value}"]`)
    : null
  const submenuHeight = activeSubmenu?.scrollHeight || sidebarSecondary.value.scrollHeight || 240

  const baseTop = pointerEvent?.clientY
    ? pointerEvent.clientY - 24
    : anchorRect?.top ?? 96
  const minTop = Math.max(80, viewportPadding)
  const maxTop = Math.max(minTop, window.innerHeight - submenuHeight - viewportPadding)
  const top = clamp(baseTop, minTop, maxTop)

  const baseLeft = anchorRect?.right ? anchorRect.right - 1 : 119
  const minLeft = Math.max(119, (railRect?.left || 0) + (railRect?.width || 120) - 1)
  const maxLeft = Math.max(minLeft, window.innerWidth - panelWidth - viewportPadding)
  const left = clamp(baseLeft, minLeft, maxLeft)

  submenuPosition.value = {
    top,
    left,
    maxHeight: Math.max(180, window.innerHeight - top - viewportPadding)
  }
}

async function openGroup(groupKey, eventOrElement = null) {
  openedGroupKey.value = groupKey
  const anchorEl = resolveAnchorElement(eventOrElement)
  if (anchorEl) {
    hoverAnchorEl.value = anchorEl
  }
  openSidebarIfNeeded()
  await nextTick()
  updateSecondaryPosition(hoverAnchorEl.value, eventOrElement)
}

function handlePrimaryHover(item, event) {
  if (item.type !== 'group') {
    openedGroupKey.value = null
    hoverAnchorEl.value = null
    return
  }

  openGroup(item.key, event)
}

function handlePrimaryPointerMove(item, event) {
  if (item.type !== 'group' || activeGroupKey.value !== item.key) {
    return
  }

  updateSecondaryPosition(resolveAnchorElement(event) || hoverAnchorEl.value, event)
}

function handleSidebarMouseLeave() {
  openedGroupKey.value = null
  hoverAnchorEl.value = null
}

function handleDirectNavigation() {
  openedGroupKey.value = null
  hoverAnchorEl.value = null
  closeSidebarOnSmallScreens()
}

function handleChildNavigation(groupKey) {
  openedGroupKey.value = groupKey
  closeSidebarOnSmallScreens()
}

function handleOverlayClick() {
  if (!isMenuOpen.value) {
    return
  }

  menu_switch?.toggleMenu()
}
</script>

<style lang="scss">
.side-content-wrap {
  position: relative;
}

.navigation-left {
  overflow: auto;
}

.nav-item.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

.sidebar-left-secondary .childNav.active-submenu {
  display: block;
}

.layout-sidebar-large .sidebar-left-secondary.dynamic-secondary {
  width: 240px;
  max-width: calc(100vw - 156px);
  height: auto;
  min-height: 0;
  padding: 0.5rem 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  z-index: 110;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateX(-8px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s ease;
}

.layout-sidebar-large .sidebar-left-secondary.dynamic-secondary.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateX(0);
}
</style>
