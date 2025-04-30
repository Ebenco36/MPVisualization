
import App from './App.vue'
import router from './router'
import VueGtag from 'vue-gtag'
import { createApp } from 'vue'
import Vue3Tour from 'vue3-tour'
import { createPinia } from 'pinia'
import Hightcharts from "highcharts"
import 'vuetify/dist/vuetify.min.css'
import 'vue3-tour/dist/vue3-tour.css'
import JsonExcel from "vue-json-excel3"
import { createVuetify } from 'vuetify'
import Multiselect from 'vue-multiselect'
import HighchartsVue from "highcharts-vue"
import '@/assets/css/perfect-scrollbar.css'
import 'vue3-easy-data-table/dist/style.css'
import '@mdi/font/css/materialdesignicons.css'
import vennInit from "highcharts/modules/venn"
import Vue3EasyDataTable from 'vue3-easy-data-table'
import ToastPlugin from 'vue-toast-notification'
import 'vue-multiselect/dist/vue-multiselect.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Import PDBe-Mol*’s “light” stylesheet
import 'pdbe-molstar/build/pdbe-molstar-light.css'
// Import the plugin UMD bundle so that it registers `window.PDBeMolstarPlugin`
import 'pdbe-molstar/build/pdbe-molstar-plugin.js'


// other importations
/*
import "/src/assets/js/jquery-3.3.1.min.js";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/1.5.5/perfect-scrollbar.js";
import "/src/assets/js/script.min.js";
import "/src/assets/js/sidebar.large.script.min.js";
import "/src/assets/js/echart.options.min.js";
import "/src/assets/js/dashboard.v1.script.min.js";
import "/src/assets/js/customizer.script.min.js";
*/
// async function enableMocking() {
//   const { worker } = await import('./mock/browser')
//   if (process.env.NODE_ENV == 'development') {
//     return worker.start()
//   }
//   else if (process.env.NODE_ENV === 'production') {
//     return worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
//   }
// }

// enableMocking().then(() => {
  const app = createApp(App)

  app.component('EasyDataTable', Vue3EasyDataTable)
  app.component("downloadExcel", JsonExcel)
  app.component("Multiselect", Multiselect)
  app.use(createPinia())

  vennInit(Hightcharts)
  app.use(HighchartsVue)

  app.use(VueGtag, {
    config: { id: 'YOUR_GOOGLE_ANALYTICS_ID' },
  });


  const vuetify = createVuetify({
    components,
    directives,
  })

  app.use(vuetify)
  app.use(Vue3Tour)
  app.use(ToastPlugin)
  app.use(router)
  app.mount('#app')

// })