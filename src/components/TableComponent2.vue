<template>
    <v-container style="max-width: 100%!important;">
        <div class="d-flex align-center">
            <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                single-line
                variant="outlined"
                @input="fetchData"
                class="col-md-6 mr-2 pl-0"
            ></v-text-field>
            <div class="ml-auto">
                <v-btn class="download-button text-20 i-Down" @click="downloadFile('csv')">CSV</v-btn>
                <v-btn class="download-button text-20 i-Down" @click="downloadFile('xlsx')">XLSX</v-btn>
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
        <v-data-table
            :items="data"
            :items-per-page="itemsPerPage"
            :server-items-length="totalRows"
            :loading="loading"
            :no-data-text="noDataText"
            class="elevation-1"
            :search="search"
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
            <template v-slot:item.actions="{ item }">
                <v-icon
                    class="me-2"
                    size="small"
                    @click="viewItem(item)"
                >
                    mdi-eye
                </v-icon>
                <a v-if="item.uniprot_id != 'NaN'" :href="'https://www.uniprot.org/uniprotkb?query=' + item.pdb_code" target="_blank" class="badge badge-info" size="small">
                    UniProt
                </a>
            </template>
        </v-data-table>
    </v-container>
  </template>
  
  <script>
  import dashboardService from '../services/dashboard.service';
  import { useRouter } from 'vue-router'
  
  const router = useRouter();

  export default {
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
        filter_options: []
      };
    },
    watch: {
      currentPage() {
        this.fetchData()
      },
      search() {
        this.currentPage = 1
      }
    },
    mounted() {
        this.fetchFilteroptions()
        this.fetchData();
        this.headerData = this.transformValues(this.headers)
        this.headerData.push({ title: 'Actions', key: 'actions', sortable: false })
    },
    methods: {
        viewItem(item) {
            console.log(item.pdb_code)
            // router.push(`/details/${item.pdb_code}`)
            window.open(`/#/details/${item.pdb_code}`, '_blank');

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
                this.data = response.data.items;
                this.totalRows = this.data.length;

                this.itemsPerPage = response.data.per_page;
                this.totalPages = response.data.total_pages;
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
    .d-flex {
        display: flex;
    }

    .align-center {
        align-items: center;
    }

    .mr-2 {
        margin-right: 0.5rem;
    }
  </style>
  