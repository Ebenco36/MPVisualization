<template lang="">
    <div class="card mb-4">
        <div class="card-body">
        <div class="form-group mb-3">
            <h5>Filter Result</h5>
        </div>
        <div v-for="(filter, key) in filters?.filters?.data" :key="key">
            <div class="form-group mb-3">
                <label for="" :title="filter.data.help">{{ filter.data.field_name }}
                    <span class="my-tooltip-inner ml-1" :title="filter.data.help">
                        <i class="" style="width: 200px">?</i>
                    </span>
                </label>
                <select class="form-control" v-model="filterData[key]" :multiple="filter.data.multiple">
                    <option>select option...</option>
                    <option 
                        v-for="data in filter?.data?.options" 
                        :key="data.value" 
                        :value="data?.value"
                    >
                        {{ data?.name }}
                    </option>
                </select>
            </div>
            
            <div class="ml-5" v-for="(filter_, key_) in filter?.child" :key="key_">
                <div class="form-group mb-3" v-if="filter_?.parents?.includes(filterData[key])">
                    <label for="picker1">{{ filter_.field_name }}
                        <span class="my-tooltip-inner show ml-1" data-toggle="tooltip" title="Layer 2.Loading...">
                            <i class="" style="width: 200px">?</i>
                        </span>
                    </label>
                    <select class="form-control" v-model="filterData[key_]" :multiple="filter_.multiple">
                    <option value="">select option...</option>
                    <option 
                        v-for="data in filter_?.options" 
                        :key="data.value" 
                        :value="data?.value">
                            {{ data?.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group text-right">
            <AppButton
                label="Submit"
                class="btn-primary btn-large mt-3"
                :handleClick="sendData"
            />
        </div>

    </div>
  </div>
  </template>
  <script setup>
    import { useFilterStore } from '@/stores/filters'
    import { ref, onMounted, defineEmits, defineProps } from 'vue'
    import AppButton from '@/components/common/AppButton.vue'
    // import CustomToolTips from '@/components/CustomToolTips.vue';
    
    
    const filterData = ref({})
    
    const filters = useFilterStore()
    const emit = defineEmits(['childEvent']);
    function sendData() {
        console.log(filterData.value)
        // Emit an event to the parent with some data
        emit('childEvent', removeNullOrEmptyObjects(filterData.value));
    };

    function removeNullOrEmptyObjects(obj) {
        const result = {};

        for (const key in obj) {
            const value = obj[key];

            if (value !== null) {
            if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
                // Skip empty objects
                continue;
            }

            result[key] = value;
            }
        }

        return result;
    }

    function generateObject(obj) {
        const result = {};
        for (const key in obj) {
            const current = obj[key].data;
            const child = obj[key].child;
            if(current){
                result[key] = null;
            }

            if (child) {
                // Recursively process child objects
                result[key] = generateObject(child);
            }
            
        }

        return result;
    }

    onMounted(() => {
        filters.loadFilters().then((res) => {
            console.log(res)
            filterData.value = generateObject(filters?.filters?.data)
        })
        
    })
  </script>
<style scoped></style>
  