import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTemplateStore = defineStore('template_views', () => {

  const menu_switch = ref({
    menu: false,
  })
  /* Load user dashboard information */

  async function toggleMenu() {
    menu_switch.value.menu = !menu_switch.value.menu
  }

  return { menu_switch, toggleMenu }
})