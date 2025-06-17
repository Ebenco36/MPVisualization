<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useCasesStore } from '@/stores/use_cases'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'

const router = useRouter()
const casesStore = useCasesStore()
// 1) The search term
const search = ref('')
// Define columns for v-data-table
const headers = [
    { title: 'Year', value: 'Year' },
    { title: 'PDB Code', value: 'PDB Code' },
    { title: 'Group (OPM)', value: 'Group (OPM)' },
    { title: 'Group (MPstruc)', value: 'Group (MPstruc)' },
    { title: 'Group (Predicted)', value: 'Group (Predicted)' },
    { title: 'Group (Expert)', value: 'Group (Expert)' },
    {
        title: 'TM (Expert)',
        value: 'TM (Expert)',
        headerClass: 'bg-red lighten-4',
        cellClass: 'bg-red lighten-4'
    },
    {
        title: 'TMbed TM Count',
        value: 'TMbed_tm_count',
        headerClass: 'bg-red lighten-4',
        cellClass: 'bg-red lighten-4'
    },
    {
        title: 'DeepTMHMM TM Count',
        value: 'DeepTMHMM_tm_count',
        headerClass: 'bg-red lighten-4',
        cellClass: 'bg-red lighten-4'
    }
]

// Reactive state
const rows = ref([])
const loading = ref(false)

const errors = ref([])
const view = ref(router.currentRoute.value.params?.view)
const page_title = ref('')

const parseExpert = (val) => {
    const m = String(val).match(/^(\d+)/)
    return m ? parseInt(m[1], 10) : NaN
}

const loadingData = async () => {
    loading.value = true
    try {
        await casesStore.loadExpertAndMLClassifications()
        let data = casesStore.expert_results.data
        if (data.data.length === 0) {
            Swal.fire({
                title: 'No Data',
                text: 'No records found for the selected filters.',
                icon: 'info',
                confirmButtonText: 'OK'
            })
        } else {
            rows.value = data.data
        }
    } catch (err) {
        console.error('Fetch failed:', err)
    } finally {
        loading.value = false
    }
}


onMounted(() => {
    loadingData()
})
</script>

<template>
    <div class="main-content">
        <HeaderCrumbs label="AI/Expert prediction of the number of Transmembrane Segments" title="" />
        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card mb-4">
                            <div class="card-body p-0" style="overflow-y: auto">

                                <v-card>
                                    <v-card-title>Membrane Protein Records</v-card-title>

                                    <v-spacer />
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                        hide-details class="mx-4" />
                                    <v-data-table :headers="headers" :items="rows" :search="search" :loading="loading"
                                        class="elevation-1" :items-per-page="10">
                                        <template #no-data>
                                            <v-alert type="info" border="left" colored-border>
                                                No records found
                                            </v-alert>
                                        </template>
                                        <!-- Override each row -->
                                        <template #item="{ item, index, columns }">
                                            <tr :class="{
                                                'highlight-row':
                                                    parseExpert(item['TM (Expert)']) !== item.DeepTMHMM_tm_count ||
                                                    parseExpert(item['TM (Expert)']) !== item.TMbed_tm_count
                                            }">
                                                <td v-for="col in columns" :key="col.key">
                                                    {{ item[col.key] }}
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
canvas#display-canvas {
    top: inherit !important;
    left: inherit !important;
}

.bg-red.lighten-4 {
    background-color: #ffcdd2 !important;
}

.red-column {
    background-color: #fee;
    color: #900;
}

.highlight-row {
    background-color: rgba(255, 193, 7, 0.1);
}
</style>
