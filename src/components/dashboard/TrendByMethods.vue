<template>
    <div class="card card-chart-bottom o-hidden mb-4 d-flex align-items-stretch">
        <div class="card-body">
            <div class="card-title">
                <div class="text-muted text-center">{{ title ? joinStringArray(title) : "Loading ..." }} </div>
            </div>
        </div>
        <div id="trend_by_method"></div>
    </div>
</template>
<script setup>
import { ref, toRaw, toRefs, watchEffect } from 'vue'
import embed from 'vega-embed'
import { joinStringArray } from "@/utils/helpers"

const props = defineProps({ trendByMethods: Object })

const { trendByMethods } = toRefs(props)
const title = ref("")
setTimeout(() => {
watchEffect(async () => {
    let clonedObject = { ...trendByMethods.value };
    title.value = clonedObject.title
    if (trendByMethods.value) {
        trendByMethods.value.title = null
        await embed('#trend_by_method', structuredClone(toRaw(trendByMethods.value)), { actions: true })
    }
})
}, 100)
</script>
