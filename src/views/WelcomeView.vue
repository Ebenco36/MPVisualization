<template>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="glyphicon glyphicon-menu-hamburger"></span>
                </button>
                <div class="navbar-left logo">
                    <!-- <img :src="imagePath" alt="" width="60" /> -->
                </div>
            </div>
        </div>
    </nav>
    <section class="banner">
        <div class="container">
            <div class="row p-2">
                <div class="banner-text pb-10" style="text-align: center; width:100%">
                    <h1>MetaMP</h1>
                    <vue3-select v-model="selected" :options="suggestions" @search="fetchSuggestions"
                        @update:modelValue="handleSelection" placeholder="Search using protein code or name" :filterable="false"
                        label="label">
                    </vue3-select>
                    <span>Examples:
                        <span class="btn-link" @click="handleSelection({ 'pdb_code': '1PTH' })">1PTH</span>,
                        <span class="btn-link" @click="handleSelection({ 'pdb_code': '2FNQ' })">2FNQ</span>,
                        <span class="btn-link" @click="handleSelection({ 'pdb_code': '3O8Y' })">3O8Y</span>,
                        <span class="muted-text" href="#">
                            Prostaglandin H2 synthase-1 (cyclooxygenase-1 or COX-1)
                        </span>
                    </span>
                </div>


                <div class="banner-text ">

                    <p>
                        <strong>MetaMP</strong>
                        is a web application that integrates data from the MPstruc, PDB, OPM, 
                        and UniProt databases to enhance enrichment and interoperability among 
                        these resources. The latest update includes metadata for
                        {{ numeral(welcomeStore?.welcome_data?.data?.all_data_mpstruc?.total_rows).format('0,0') }}
                        membrane protein structures from MPstruc,
                        {{ numeral(welcomeStore?.welcome_data?.data?.all_data_pdb?.total_rows).format('0,0') }}
                        from the Protein Data Bank (PDB),
                        {{ numeral(welcomeStore?.welcome_data?.data?.all_data_opm?.total_rows).format('0,0') }}
                        from the Orientations of Proteins in Membranes (OPM) database, and
                        {{ numeral(welcomeStore?.welcome_data?.data?.all_data_uniprot?.total_rows).format('0,0') }}
                        from UniProt. MetaMP is specifically designed to curate structural 
                        determination methods and related features for resolved membrane 
                        protein structures, enriching this data with comprehensive metadata 
                        by combining information from these four databases.
                    </p>
                </div>

                <strong style="font-size: 13pt;"><strong>Last database update: </strong>  2024-03-01T12:11:00</strong>
                <!-- <div class="col-md-4">
                <img src="@/assets/DataLayer.svg" alt="Data Integration Pipeline Diagram"/>
            </div> -->
            </div>
        </div>
        <!-- <img class="banner-image" src="https://preview.ibb.co/bMi5Y6/banner_img.png" alt="monitoring"> -->
    </section>

    <div class="container">
        <div class="row">
            <div class="mb-30 col-md-4 col-lg-4">
                <div class="card">
                    <h3 class="card-title">Database Summary</h3>
                    <p class="card-text">
                    <ul class="list-group list-group-flush font-weight-bold">
                        <li class="list-group-item">Reports of membrane protein structures in database: {{
                            numeral(welcomeStore?.welcome_data?.data?.all_data?.total_rows).format('0,0') }}</li>
                        <li class="list-group-item">Unique proteins in database: {{
                            numeral(welcomeStore?.welcome_data?.data?.get_master_proteins?.total_rows).format('0,0') }}
                        </li>
                        <li class="list-group-item">Reports of membrane protein structures from <strong>OPM:</strong> {{
                            numeral(welcomeStore?.welcome_data?.data?.all_data_opm?.total_rows).format('0,0') }}</li>
                        <li class="list-group-item">Reports of membrane protein structures from
                            <strong>UniProt:</strong> {{
                                numeral(welcomeStore?.welcome_data?.data?.all_data_uniprot?.total_rows).format('0,0') }}
                        </li>

                    </ul>
                    </p>
                </div>
            </div>

            <div class="mb-30 col-md-8 col-lg-8">
                <GraphViewWithoutCard id="group_chart" label="Unique proteins in database"
                    :summary="welcomeStore?.welcome_data?.data?.unique_trend" />
            </div>
            <div class="mb-30 col-md-8 col-lg-8">
                <GraphViewWithoutCard id="method_chart" label="Reports of membrane protein structures in database"
                    :summary="welcomeStore?.welcome_data?.data?.method_chart" />
            </div>
            <div class="mb-30 col-md-6 col-lg-4">
                <div class="card">
                    <h3 class="card-title">Quick Links</h3>
                    <p class="card-text mb-0">

                    <ul class="list-group list-group-flush font-weight-bold">
                        <li class="list-group-item btn-link" @click="gotoDashboard()">Overview</li>
                        <li class="list-group-item btn-link" @click="gotoSummary()">Summary Statistics</li>
                        <li class="list-group-item btn-link" @click="gotoDataDiscrepancy()">Data Discrepancy</li>
                        <li class="list-group-item btn-link" @click="gotoOutlier()">Outlier Detection</li>
                        <li class="list-group-item btn-link" @click="gotoSubmission('feature_request')">Feature Request</li>
                        <!-- <li class="list-group-item btn-link" @click="gotoML()">Make Prediction</li> -->
                        <li class="list-group-item btn-link" @click="gotoSubmission('expert_feedback')">Provide Expert Feedback</li>
                        <li class="list-group-item btn-link" @click="gotoContact()">Contact Us</li>
                        <li class="list-group-item btn-link" @click="gotoAboutMetaMP()">About MetaMP</li>
                        <!-- <li class="list-group-item"></li> -->
                    </ul>
                    </p>
                </div>
            </div>

        </div>
    </div>
    <footer>
        <div class="app-footer" ref="myDiv">
            <div class="row">
                <div class="col-md-12">
                    <div class="footer-bottom ">
                        <span class="flex-grow-1"></span>
                        <div class="d-flex align-items-center">
                            <div style="text-align: center;">
                                <p class="m-0">Copyright | &copy; {{ year }} <strong>MetaMP</strong></p>
                                <p>All rights reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Vue3Select from 'vue3-select';
import dashboardService from '@/services/dashboard.service';
import GraphViewWithoutCard from '@/components/dashboard/GraphViewWithoutCard.vue'
import { useWelcomeStore } from '@/stores/welcome'
import 'vue3-select/dist/vue3-select.css';
import imagePath from '@/assets/image/newLogo.webp';
import numeral from 'numeral';
const d = new Date();
const year = d.getFullYear();
const ddd = ref([
    {
        "comment_disease_name": "Brunner syndrome",
        "expressed_in_species": "Pichia pastoris",
        "exptl_method": "X-RAY DIFFRACTION",
        "group": "MONOTOPIC MEMBRANE PROTEINS",
        "id": 26,
        "name": "Monoamine Oxidase A with bound Clorglycine",
        "pdb_code": "2BXR",
        "rcsentinfo_experimental_method": "X-ray",
        "resolution": "3.00",
        "species": "Homo sapiens (Human) mitochondrial outer membrane",
        "subgroup": "Oxidases",
        "taxonomic_domain": "Eukaryota",
        "uniprot_id": "P21397",
        "label": "2BXR - Monoamine Oxidase A with bound Clorglycine"
    },
    {
        "comment_disease_name": "Brunner syndrome",
        "expressed_in_species": "S. cerevisiae",
        "exptl_method": "X-RAY DIFFRACTION",
        "group": "MONOTOPIC MEMBRANE PROTEINS",
        "id": 27,
        "name": "Monoamine Oxidase A with bound Harmine",
        "pdb_code": "2Z5X",
        "rcsentinfo_experimental_method": "X-ray",
        "resolution": "2.20",
        "species": "Homo sapiens (Human) mitochondrial outer membrane",
        "subgroup": "Oxidases",
        "taxonomic_domain": "Eukaryota",
        "uniprot_id": "P21397",
        "label": "2Z5X - Monoamine Oxidase A with bound Harmine"
    }
])
const router = useRouter();
const welcomeStore = useWelcomeStore()

const selected = ref(null);
const suggestions = ref([]);

const fetchSuggestions = async (searchTerm) => {
    if (searchTerm.length < 3) {
        suggestions.value = [];
        return;
    }

    const data = {
        page: 1,
        search_terms: {
            search_term: searchTerm,
            group: 'All',
            subgroup: 'All',
            taxonomic_domain: 'All',
            experimental_methods: 'All',
            molecular_function: 'All',
            cellular_component: 'All',
            biological_process: 'All',
            family_name: 'All',
            species: 'All',
            membrane_name: 'All',
            super_family: 'All',
            super_family_class_type: 'All',
        },
        download: 'none',
    };

    try {
        const response = await dashboardService.postData('data-list', data);
        // Add a 'label' field combining pdb_code and name
        suggestions.value = response.data?.data?.items.map(item => ({
            ...item,
            label: `${item.pdb_code} - ${item.name} - ${item.comment_disease_name} (Uniprot Id: ${item.uniprot_id})`  // Concatenate pdb_code and name
        })) || [];
        console.log(suggestions.value)
    } catch (error) {
        console.error('Error fetching data:', error);
        suggestions.value = [];
    }
};

// Handle selection and log selected item
const handleSelection = (selectedItem) => {
    // router.push(`/details/${item.pdb_code}`)
    window.open(`/#/details/${selectedItem.pdb_code}`, '_blank');
};

function gotoDashboard() {
    router.push('/dashboard')
}

function gotoSummary() {
    router.push('/summary')
}

function gotoDataDiscrepancy() {
    router.push('/use-cases/discrepancies')
}

function gotoOutlier() {
    router.push('/use-cases/outlier_detection')
}

function gotoML() {
    router.push('/machine-learning-prediction')
}

function gotoAboutMetaMP() {
    router.push('/metamp-about')
}

function gotoSubmission(param) {
    router.push('/make-submission/' + param)
}

function gotoContact() {
    router.push('/contact')
}

onMounted(() => {
    welcomeStore?.loadWelcomePage()
})
</script>
<style lang="scss" scoped>
// variables
$darkPurple: #00106a;
$lightBlue: #dfe9ff;
$activeBlue: #4b71ff;
$white: #ffffff;
$lightPurple: #989dc5;
$footer: white;

// mixins
@mixin box-shadow($top, $left, $blur, $color, $inset: "") {
    -webkit-box-shadow:$top $left $blur $color #{$inset};
    -moz-box-shadow:$top $left $blur $color #{$inset};
    box-shadow:$top $left $blur $color #{$inset};
}

body {
    background: $lightBlue;
    font-family: Lato, sans-serif;
}

// banner styles
.banner {
    height: auto;
    margin: 32px 0px;
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    // z-index: 1;

    @media (min-width: 768px) {
        // height: 450px;
        margin-bottom: 32px;
    }

    .banner-image {
        position: absolute;
        opacity: .25;
        right: 0px;
        top: 0px;
        height: 300px;
        // z-index: -1;
        -webkit-filter: drop-shadow(0 3rem 0.05rem rgba(191, 216, 255, 1));
        filter: drop-shadow(0 3rem 0.05rem rgba(191, 216, 255, 1));

        @media (min-width: 768px) {
            display: inherit;
            height: 400px;
            top: 0px;
            opacity: 0.5;
        }

        @media (min-width: 992px) {
            height: 500px;
            top: -50px;
            opacity: 1;
        }
    }

    .banner-text {
        max-width: 100%;
        float: left;
        text-align: justify;

        h1 {
            color: $darkPurple;
            font-size: 3rem;
            font-weight: 700;
            letter-spacing: 3px;
            margin-bottom: 1rem;
        }

        p {
            color: $darkPurple;
            font-size: 1.05rem;
            line-height: 1.75;
        }
    }

    button {
        border: 0;
        border-radius: 50px;
        padding: .75rem 2.75rem;
        background: $activeBlue;
        color: $white;
        box-shadow: 0 .5rem 1.5rem rgba(0, 0, 0, .25);
        cursor: pointer;
        position: relative;
        font-size: 1rem;
        font-weight: 400;
        letter-spacing: 1px;
        -webkit-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;

        &:hover {
            -webkit-transform: translateY(-5px);
            -ms-transform: translateY(-5px);
            -o-transform: translateY(-5px);
            transform: translateY(-5px);
            box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, .25);
        }
    }
}

// card styles
.mb-30 {
    margin-bottom: 30px;
}

.card {
    padding: 16px 24px;
    background: $white;
    height: 100%;
    position: relative;
    border: none;
    box-shadow: 0 .5rem 1.5rem rgba(0, 0, 0, .15);
    border: 2px solid transparent;
    -webkit-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    // z-index: 10;

    h3.card-title {
        font-weight: 700;
        font-size: 1.3rem;
        color: $darkPurple;
    }

    p {
        color: $lightPurple;
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 72px;
    }

    .card-link {
        position: absolute;
        bottom: 18px;
    }

    &:hover {
        -webkit-transform: translateY(-5px);
        -ms-transform: translateY(-15px);
        -o-transform: translateY(-15px);
        transform: translateY(-15px);
        box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, .15);
        cursor: pointer;
    }

    .card-icon {
        width: 60px;
        margin-bottom: 8px;
        position: relative;
        top: 0;
        left: -12px;
    }
}

// footer styles
footer {
    background: $footer;
    margin: 32px 0 0px;
    padding: 32px 0;
}

.app-footer {
    background-color: white;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
}

/* .seperate-groups{
  margin-top: 200px;
} */

.footer-bottom .d-flex {
    justify-content: center;
}
</style>