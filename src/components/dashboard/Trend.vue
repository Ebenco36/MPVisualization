<template>
  <div class="card card-chart-bottom o-hidden mb-4">
    <div class="card-body">
      <div class="card-title">
        <div v-if="typeof title == 'object'" class="text-muted text-center">{{ title ?  typeof title == "object" ? joinStringArray(title.text) : joinStringArray(title) : "Loading ..." }}</div>
        <div v-else class="text-muted text-center">{{ title ?  typeof title == "string" ? title : joinStringArray(title) : "Loading ..." }}</div>
      </div>
    </div>
    <div class="col-md-12" id="trend"></div>
  </div>
</template>
<script setup>
import { ref, toRaw, toRefs, watchEffect } from 'vue'
import embed from 'vega-embed'
import { joinStringArray } from "@/utils/helpers"
const props = defineProps({ trend: Object, title: String })

const { trend, title } = toRefs(props)


setTimeout(() => {
  watchEffect(async () => {
    if (trend.value) {
      let clonedObject = { ...trend.value };
      title.value = clonedObject.title
      if (clonedObject.layer){
        title.value = clonedObject.layer[0].title
      } else {
        title.value = clonedObject.title
      }

      if (trend.value) {
        if (trend.value.layer){
          trend.value.layer.title = null
          trend.value.layer.forEach((layer) => {
            layer.title = null
          })
        } else {
          trend.value.title = null
        }
      // trend.value.title = null
      await embed('#trend', structuredClone(toRaw(trend.value)), { actions: true })
      }
    }
  })
}, 100)
</script>
