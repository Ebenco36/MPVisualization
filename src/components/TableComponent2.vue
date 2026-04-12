<template>
    <v-container fluid class="table-component pa-0">
        <div class="d-flex align-center table-toolbar">
            <!-- <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                single-line
                variant="outlined"
                @input="fetchData"
                class="col-md-6 mr-2 pl-0"
            ></v-text-field> -->
            <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                single-line
                variant="outlined"
                class="col-md-6 mr-2 pl-0"
            ></v-text-field>
            <div class="ml-auto table-toolbar__actions">
                <v-btn class="download-button text-20 i-Down" @click="downloadFile('csv')">CSV</v-btn>
                <v-btn class="download-button text-20 i-Down" @click="downloadFile('xlsx')">Excel</v-btn>
            </div>
        </div>
        <label class="col-md-12 switch pr-5 switch-primary mr-3 pull-right"><span>Advanced Filters</span>
            <input type="checkbox" checked="checked" v-model="toggleFilters"><span class="slider"></span>
        </label>
        <div class="col-md-12 p-0" v-if="toggleFilters == true">
            <form action="javascript:void(0)" method="get" class="row mt-4">
                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Group: </label>
                    <multiselect v-model="search_filter.group" :options="filter_options.group"></multiselect>
                </div>
                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Sub-group: </label>
                    <multiselect v-model="search_filter.subgroup" :options="filter_options.subgroup"></multiselect>
                </div>
                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Taxonomic Domain: </label>
                    <multiselect v-model="search_filter.taxonomic_domain" :options="filter_options.taxonomic_domain"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Experimental Method: </label>
                    <multiselect v-model="search_filter.experimental_method" :options="filter_options.experimental_methods"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Molecular Function: </label>
                    <multiselect v-model="search_filter.molecular_function" :options="filter_options.molecular_function"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Cellular Component: </label>
                    <multiselect v-model="search_filter.cellular_component" :options="filter_options.cellular_component"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Biological Process: </label>
                    <multiselect v-model="search_filter.biological_process" :options="filter_options.biological_process"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Family Name: </label>
                    <multiselect v-model="search_filter.family_name" :options="filter_options.family_name"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Species: </label>
                    <multiselect v-model="search_filter.species" :options="filter_options.species"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Membrane Name: </label>
                    <multiselect v-model="search_filter.membrane_name" :options="filter_options.membrane_name"></multiselect>
                </div>
                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Super Family Name: </label>
                    <multiselect v-model="search_filter.super_family" :options="filter_options.super_family"></multiselect>
                </div>

                <div class="form-group col-md-6 col-lg-4">
                    <label for="select2" class="">By Class Type: </label>
                    <multiselect v-model="search_filter.super_family_class_type" :options="filter_options.super_family_class_type"></multiselect>
                </div>

                <div class="col-md-12 form-group text-right">
                    <button @click="fetchData()" class="btn btn-info">Search</button>
                </div>
            </form>
        </div>
        <!-- <v-data-table
            :items="data"
            :items-per-page="itemsPerPage"
            :server-items-length="totalRows"
            :loading="loading"
            :no-data-text="noDataText"
            class="elevation-1"
            :search="search"
            :headers="headerData"
        > -->
        <v-data-table
            :items="data"
            :items-per-page="itemsPerPage"
            :server-items-length="totalRows"
            :loading="loading"
            :no-data-text="noDataText"
            class="elevation-1"
            :headers="headerData"
        >
        <!--
            <template v-slot:header="{ props }">
                {{ props }}
                <th v-for="head in props.headers" :key="head">{{ head.text.toUpperCase() }}</th>
            </template>
        -->
            <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            </template>

            <!-- Custom rendering for the 'count' column -->
            <template v-slot:[`item.comment_disease_name`]="{ item }">
                <td >
                    <span v-if="item.comment_disease_name != 'NaN'">{{ item.comment_disease_name }}</span>
                    <span v-else>Not Set</span>
                </td>
            </template>

            <template v-slot:bottom>
                <div class="text-center pt-2">
                    <v-pagination
                        v-model="currentPage"
                        :length="totalPages"
                    ></v-pagination>
                </div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <div class="actions-cell" :class="{ 'actions-cell--live': item._liveNoteFlash }">
                    <div class="actions-cell__row">
                        <StructureExpertNotesDialog
                            v-if="item.pdb_code"
                            :pdb-code="item.pdb_code"
                            :initial-count="item.expert_note_count || 0"
                            :summary="item.expert_note_summary || {}"
                            trigger-mode="icon"
                            source-context="database_table"
                            @updated="updateExpertNotesSummary(item, $event)"
                        />
                        <v-btn
                            class="row-action-button row-action-button--details"
                            size="small"
                            variant="tonal"
                            density="comfortable"
                            @click="viewItem(item)"
                        >
                            <v-icon start size="16">mdi-eye-outline</v-icon>
                            Details
                        </v-btn>
                        <v-btn
                            v-if="item.uniprot_id != 'NaN'"
                            class="row-action-button row-action-button--uniprot"
                            size="small"
                            variant="outlined"
                            density="comfortable"
                            :href="'https://www.uniprot.org/uniprotkb?query=' + item.pdb_code"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <v-icon start size="16">mdi-open-in-new</v-icon>
                            UniProt
                        </v-btn>
                    </div>
                    <div
                        v-if="item.preferred_tm_compact_label || item.preferred_tm_prediction_count != null"
                        class="actions-cell__summary"
                    >
                        <span v-if="item.preferred_tm_compact_label" class="summary-pill">
                            {{ item.preferred_tm_compact_label }}
                        </span>
                        <span
                            v-if="item.preferred_tm_prediction_method"
                            class="summary-caption"
                        >
                            {{ item.preferred_tm_prediction_method }}
                            <template v-if="item.preferred_tm_prediction_count != null">
                                · {{ item.preferred_tm_prediction_count }} TM
                            </template>
                        </span>
                    </div>
                </div>
            </template>
        </v-data-table>
    </v-container>
  </template>
  
  <script>
  import { nextTick } from 'vue';
  import dashboardService from '../services/dashboard.service';
  import StructureExpertNotesDialog from '@/components/useCases/StructureExpertNotesDialog.vue';
  import StructureNotesRealtimeService from '@/services/structure_notes_realtime.service';

  export default {
    components: {
        StructureExpertNotesDialog,
    },
    props: {
        apiUrl: {
            type: String,
            required: false,
            default: ''
        },
        headers: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },  
    data() {
      return {
        data: [],
        itemsPerPage: 10,
        totalRows: 0,
        currentPage: 1,
        loading: false,
        totalPages: 1,
        headerData: [],
        search: "",
        download: "none",
        noDataText: 'No data available',
        toggleFilters: false,
        search_filter: {
            "group": "All",
            "subgroup": "All",
            "taxonomic_domain": "All",
            "experimental_method": "All",
            "molecular_function": "All",
            "cellular_component": "All",
            "biological_process": "All",
            "family_name": "All",
            "species": "All",
            "membrane_name": "All",
            "super_family": "All",
            "super_family_class_type": "All",
        },
        value: null,
        filter_options: [],
        stopStructureNotesRealtime: null,
        noteHighlightTimers: {}
      };
    },
    watch: {
        currentPage() {
            this.fetchData()
        },
        search(newVal, oldVal) {
            if (newVal === oldVal) return
            clearTimeout(this._searchTimer)
            this._searchTimer = setTimeout(() => {
            if (this.currentPage !== 1) {
                this.currentPage = 1  // triggers currentPage watcher → fetchData
            } else {
                this.fetchData()       // already page 1, must call manually
            }
            }, 350)                    // 350ms debounce — avoids firing on every keystroke
        }
    },
    mounted() {
        this.fetchFilteroptions()
        this.fetchData();
        this.headerData = this.transformValues(this.headers)
        this.headerData.push({ title: 'Actions', key: 'actions', sortable: false })
    },
    beforeUnmount() {
        if (typeof this.stopStructureNotesRealtime === 'function') {
            this.stopStructureNotesRealtime()
            this.stopStructureNotesRealtime = null
        }
        Object.values(this.noteHighlightTimers || {}).forEach((timerId) => clearTimeout(timerId))
        this.noteHighlightTimers = {}
    },
    methods: {
        viewItem(item) {
            const canonicalCode = this.normalizePdbCode(
                item?.canonical_pdb_code || item?.replacement_pdb_code || item?.pdb_code
            )
            if (!canonicalCode) return
            this.$router.push({ path: '/details-2', query: { code: canonicalCode, type: 'pdb' } })
        },
        transformValues(values) {
            return values.map((item) => {
                const text = this.capitalizeAndRemoveUnderscores(item);
                return { title: text, value: item };
            });
        },
        capitalizeAndRemoveUnderscores(str) {
            return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
        },

        updateExpertNotesSummary(item, summary) {
            const normalizedSummary = {
                note_count: Number(summary?.note_count || 0),
                open_note_count: Number(summary?.open_note_count || 0),
                latest_note_at: summary?.latest_note_at || null,
                latest_note_excerpt: summary?.latest_note_excerpt || null,
                recent_notes: Array.isArray(summary?.recent_notes) ? summary.recent_notes : [],
            }
            item.expert_note_count = normalizedSummary.note_count
            item.open_expert_note_count = normalizedSummary.open_note_count
            item.expert_note_summary = normalizedSummary
        },

        normalizePdbCode(value) {
            const text = String(value || '').trim().toUpperCase()
            return text || null
        },

        itemMatchesStructureNoteUpdate(item, payload) {
            const candidateCodes = [item?.pdb_code, item?.canonical_pdb_code]
                .map((value) => this.normalizePdbCode(value))
                .filter(Boolean)

            const payloadCodes = [payload?.pdb_code, payload?.canonical_pdb_code]
                .map((value) => this.normalizePdbCode(value))
                .filter(Boolean)

            return payloadCodes.some((value) => candidateCodes.includes(value))
        },

        flashStructureNoteUpdate(item) {
            const code = this.normalizePdbCode(item?.pdb_code || item?.canonical_pdb_code) || String(item?.id || '')
            const existingTimer = this.noteHighlightTimers[code]
            if (existingTimer) {
                clearTimeout(existingTimer)
            }

            item._liveNoteFlash = false
            nextTick(() => {
                item._liveNoteFlash = true
                this.noteHighlightTimers[code] = setTimeout(() => {
                    item._liveNoteFlash = false
                    delete this.noteHighlightTimers[code]
                }, 2200)
            })
        },

        applyStructureNoteRealtimeUpdate(payload) {
            this.data.forEach((item) => {
                if (this.itemMatchesStructureNoteUpdate(item, payload)) {
                    this.updateExpertNotesSummary(item, payload?.summary)
                    this.flashStructureNoteUpdate(item)
                }
            })
        },

        resubscribeStructureNotesRealtime() {
            if (typeof this.stopStructureNotesRealtime === 'function') {
                this.stopStructureNotesRealtime()
                this.stopStructureNotesRealtime = null
            }

            const pdbCodes = this.data
                .map((item) => item?.pdb_code || item?.canonical_pdb_code)
                .filter(Boolean)

            if (!pdbCodes.length) return

            this.stopStructureNotesRealtime = StructureNotesRealtimeService.subscribeToStructureNotes(
                pdbCodes,
                this.applyStructureNoteRealtimeUpdate
            )
        },

        async fetchFilteroptions() {
            this.loading = true;
            await dashboardService.fetchData("option-filters")
            .then(res => {
                let response = res?.data
                this.filter_options = response.data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                this.loading = false;
            });
        },

        fetchData() {
            this.loading = true;
            let data = {
                "page": this.currentPage,
                "search_terms": {
                    "search_term": this.search,
                    "group": this.search_filter?.group,
                    "subgroup": this.search_filter?.subgroup,
                    "taxonomic_domain": this.search_filter?.taxonomic_domain,
                    "experimental_methods": this.search_filter?.experimental_method,
                    "molecular_function": this.search_filter?.molecular_function,
                    "cellular_component": this.search_filter?.cellular_component,
                    "biological_process": this.search_filter?.biological_process,
                    "family_name": this.search_filter?.family_name,
                    "species": this.search_filter?.species,
                    "membrane_name": this.search_filter?.membrane_name,
                    "super_family": this.search_filter?.super_family,
                    "super_family_class_type": this.search_filter.super_family_class_type
                },
                "download": this.download,

            }
            dashboardService.postData(this.apiUrl, data)
            .then(res => {
                let response = res?.data
                this.data      = response.data.items;
                this.totalRows = response.data.total_items ?? response.data.total ?? response.data.count ?? 0;

                this.itemsPerPage = response.data.per_page;
                this.totalPages = response.data.total_pages;
                this.resubscribeStructureNotesRealtime();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                this.loading = false;
            });
        },
        async downloadFile(type) {
            this.download = type
            try {
                let data = {
                    "page": this.currentPage,
                    "search_terms": {
                        "search_term": this.search,
                        "group": this.search_filter?.group,
                        "subgroup": this.search_filter?.subgroup,
                        "taxonomic_domain": this.search_filter?.taxonomic_domain,
                        "experimental_methods": this.search_filter?.experimental_method,
                        "molecular_function": this.search_filter?.molecular_function,
                        "cellular_component": this.search_filter?.cellular_component,
                        "biological_process": this.search_filter?.biological_process,
                        "family_name": this.search_filter?.family_name,
                        "species": this.search_filter?.species,
                        "membrane_name": this.search_filter?.membrane_name,
                        "super_family": this.search_filter?.super_family,
                        "super_family_class_type": this.search_filter.super_family_class_type
                    },
                    "download": this.download,

                }
                let response = await dashboardService.postData(this.apiUrl, data).catch(error => {
                    console.error('Error fetching data:', error);
                })

                // Create a blob from the binary data
                const blob = new Blob([response.data], { type: 'text/'+ this.download });

                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'data.' + this.download;
                link.click();

                // Clean up
                window.URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error('Error downloading CSV:', error);
            }
        }
    },
  };
  </script>
  
  <style scoped>
    .table-component {
        max-width: 100% !important;
        padding: 0 !important;
    }

    .d-flex {
        display: flex;
    }

    .table-toolbar {
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
    }

    .table-toolbar__actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .actions-cell {
        min-width: 0;
        border-radius: 14px;
        padding: 0.2rem 0.35rem;
        transition: background-color 0.25s ease, box-shadow 0.25s ease;
    }

    .actions-cell--live {
        animation: live-note-pulse 2.2s ease;
        background: rgba(62, 142, 208, 0.12);
        box-shadow: 0 0 0 1px rgba(62, 142, 208, 0.18);
    }

    .actions-cell__row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .actions-cell__summary {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 6px;
        min-width: 0;
    }

    .row-action-button {
        text-transform: none;
        letter-spacing: 0;
        border-radius: 999px;
        font-weight: 700;
        min-width: 0;
        box-shadow: none;
    }

    .row-action-button--details {
        color: #14446c;
        background: #e9f3ff;
    }

    .row-action-button--uniprot {
        color: #1f4d78;
        border-color: #b7cde0;
        background: #ffffff;
    }

    @media (max-width: 768px) {
        .table-toolbar {
            flex-direction: column;
            align-items: stretch;
        }

        .table-toolbar__actions {
            margin-left: 0 !important;
        }
    }

    .summary-pill {
        display: inline-flex;
        width: fit-content;
        padding: 4px 8px;
        border-radius: 999px;
        background: #edf4fb;
        color: #184772;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1.2;
    }

    .summary-caption {
        color: #56718f;
        font-size: 0.74rem;
        line-height: 1.3;
    }

    :deep(.v-data-table) {
        width: 100%;
    }

    :deep(.v-toolbar) {
        padding-inline: 0;
    }

    .align-center {
        align-items: center;
    }

    .mr-2 {
        margin-right: 0.5rem;
    }

    @keyframes live-note-pulse {
        0% {
            background: rgba(62, 142, 208, 0.26);
            box-shadow: 0 0 0 0 rgba(62, 142, 208, 0.22);
        }

        35% {
            background: rgba(62, 142, 208, 0.16);
            box-shadow: 0 0 0 6px rgba(62, 142, 208, 0.08);
        }

        100% {
            background: rgba(62, 142, 208, 0);
            box-shadow: 0 0 0 0 rgba(62, 142, 208, 0);
        }
    }
  </style>
  
