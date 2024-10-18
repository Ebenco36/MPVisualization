<template>
    <div class="main-content">
        <HeaderCrumbs label="MetaMP Grouping View" title="" />
        <div class="center-div card mb-4">

            <!-- The Modal for protein -->
            <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">Membrane Protein Codes</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <form>
                    <div class="form-group">
                        <label for="inputText">Protein collection (e.g. HA89, HA78, ...):</label>
                        <input type="text" class="form-control" id="inputText" placeholder="Type something..." v-model="pdb_codes">
                    </div>
                    </form>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" style="color:white!important;" id="saveButton" @click="downloadSampleFile">{{ load_status ? "Loading ..." : "Download Sample!" }}</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>

                </div>
            </div>
            </div>

            <!--  Modal -->
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle-2" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle-2">Performance Metrics</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        </div>
                        <div class="modal-body">
                            <h2>Classifier Performance</h2>
                            <table class="table table-striped table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                    <th>Classifier</th>
                                    <th>Accuracy</th>
                                    <th>Precision</th>
                                    <th>Recall</th>
                                    <th>F1-score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="(item, index) in accuracy_data"
                                        :key="index"
                                        :class="{
                                            'table-success': isTopAccuracy(item) || isTopF1Score(item)
                                        }"
                                    >
                                    <td>{{ item.Classifier }}</td>
                                    <td>{{ item.Accuracy }}</td>
                                    <td>{{ item.Precision }}</td>
                                    <td>{{ item.Recall }}</td>
                                    <td>{{ item['F1-score'] }}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-body" style="text-align: justify;">
                <!-- <div class="form-group mb-3">
                    <h4>Membrane Protein Group Prediction</h4>
                </div>
                <h5>Upload your test dataset</h5><br/> -->
                <!-- <form @submit.prevent="uploadFile" class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="">Machine Learning Methods *</label>
                            <select v-model="model_" class="form-control">
                                <option value="1">Select option</option>
                                <option :value="item" v-for="(item, index) in machine_learning_algorithms" :key="index">
                                    {{ item }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="">Dimensionality Reduction Methods *</label>
                            <select v-model="dim_reduction" class="form-control">
                                <option value="1">Select option</option>
                                <option :value="item" v-for="(item, index) in dimensionality_reduction_algorithms"
                                    :key="index">{{ item.toUpperCase() }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-md-12">
                        <label for="">Upload Sample File *</label>
                        <input type="file" @change="onFileChange" class="form-control" />
                    </div>
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-primary btn-large mt-3" style="color: white;"> {{ load_status ? "Loading ..." : "Predict Now!" }}</button>
                    </div>
                </form>
                
                <div v-if="error" class="alert alert-danger">
                    <pre>{{ error }}</pre>
                </div>
                <br/>
                <div v-if="result" class="alert alert-success">
                    <pre>{{ result }}</pre>
                </div>
                <br />

                <div>
                    
                    <a class="btn btn-link" data-toggle="modal" data-target="#myModal">Download sample CSV file</a> OR
                    <a class="btn btn-link" @click="downloadCSV" download>use template file </a>
                    <a class="badge badge-info text-white p-2 cursor-pointer" v-if="!isEmpty(accuracy_data)" data-toggle="modal" data-target="#exampleModalCenter">View metrics based on {{ dim_reduction.toUpperCase() }}</a>
                </div>
                <br/>
            
            -->

                <h1>Grouping View</h1>
                <p>
                    The <span class="highlight">Grouping View</span> leverages artificial intelligence (AI) to assist experts in categorizing MP structures into predefined groups based on the following attributes including thickness, membrane topology in
                    tilt, membrane topology out, and subunit segment.
                </p>
                <p>
                    The target groups considered in this work are the three groups includng monotopic, transmembrane alpha-helical and transmembrane beta-barrel, as inherited from the MPstruc database.
                    
                </p>
                <p>
                    While the AI provides initial grouping suggestions, researchers remain actively involved in reviewing these classifications to ensure accuracy and relevance.
                    By combining automated efficiency with potential expert oversight, this collaborative approach improves the analytical process of efficiently organizing data according to predefined criteria, enabling more nuanced data curation.
                </p>
                <p>
                    With respect to the images below, t-SNE seems to be the best dimensionality reduction technique
                    However, there exist some overlap which could be as a result of expert misclassification of 
                    membrane protein into their respective groups. 
                </p>
                
                <div class="content">
                    <div style="text-align: center;">
                        <h5 class="title">Dimensionality Reduction Charts Using PCA, t-SNE, and UMAP</h5><br/>
                    </div>
                    <div class="row">
                        
                        <div class="col-md-6">
                            <GraphView 
                                id="pca_chart" :summary="dimensionality_reduction_chart?.pca_chart" 
                                label="Principal Component Analysis (PCA)"
                            />
                        </div>
                        <div class="col-md-6">
                            <GraphView 
                                id="t-SNE_chart" :summary="dimensionality_reduction_chart?.t_sne_chart" 
                                label="t-Distributed Stochastic Neighbor Embedding (t-SNE)"
                            />
                        </div>
                        <div class="col-md-6">
                            <GraphView 
                                id="umap_chart" :summary="dimensionality_reduction_chart?.umap_chart" 
                                label="Uniform Manifold Approximation and Projection (UMAP)"
                            />
                        </div>
                    </div>
                </div> 

            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref, watch, computed, onMounted } from 'vue';
import GraphView from '@/components/dashboard/GraphView.vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'

const file = ref(null);
const result = ref(null);
const error = ref(null);
const model_ = ref("")
const accuracy_data = ref({})
const load_status = ref(false)
const dim_reduction = ref("")
const pdb_codes = ref("")
const machine_learning_algorithms = ref([])
const dimensionality_reduction_chart = ref({})
const dimensionality_reduction_algorithms = ref([])

const sample_data = ref([
    [
        "pdb_code", "subunit_segments", "thickness", 
        "tilt", "membrane_topology_in", 
    ],
    ["A123", 24.0, 22.4, 7.0, "cytoplasmic side"],
    ["B123", 24.0, 21.2, 5.0, "cytoplasmic side"],
])

const onFileChange = (e) => {
    file.value = e.target.files[0];
};

const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
        sample_data.value.map(row => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
}

const downloadSampleFile = async () => {
    const formData = new FormData();
    formData.append('pdb_codes', pdb_codes.value);
    load_status.value = true
    try {
        const response = await fetch(`${import.meta.env.VITE_MPV_APP_URL}ml-get-sample-real-data`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();

            // Create a link element for downloading the CSV file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'MetaMP_Real_Sample_Data.csv'); // Set the file name
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            link.remove();

            result.value = 'CSV file downloaded successfully';
            error.value = null;
        } else {
            const resultJson = await response.json();
            error.value = JSON.stringify(resultJson.errors, null, 2);
            result.value = null;
        }
        load_status.value = false
    } catch (err) {
        console.log(err)
        error.value = err.toString();
        result.value = null;
        load_status.value = false
    }
};

const uploadFile = async () => {
    if (!file.value) {
        error.value = "No file selected";
        return;
    }

    const formData = new FormData();
    formData.append('data_file', file.value);
    formData.append('dim_reduction', dim_reduction.value);
    formData.append('model', model_.value);
    load_status.value = true
    try {
        const response = await fetch(`${import.meta.env.VITE_MPV_APP_URL}ml-predictions-post`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();

            // Create a link element for downloading the CSV file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'MetaMP_Predictions_'+ model_.value +'_'+ dim_reduction.value +'.csv'); // Set the file name
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            link.remove();

            result.value = 'CSV file downloaded successfully';
            error.value = null;
        } else {
            const resultJson = await response.json();
            error.value = JSON.stringify(resultJson.errors, null, 2);
            result.value = null;
        }
        load_status.value = false
    } catch (err) {
        console.log(err)
        error.value = err.toString();
        result.value = null;
        load_status.value = false
    }
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Computed properties to find the top 2 rows with max Accuracy and F1-score
const topAccuracyRows = computed(() => {
  return accuracy_data.value
    .slice()
    .sort((a, b) => b.Accuracy - a.Accuracy)
    .slice(0, 2);
});

const topF1ScoreRows = computed(() => {
  return accuracy_data.value
    .slice()
    .sort((a, b) => b['F1-score'] - a['F1-score'])
    .slice(0, 2);
});

// Methods to check if an item is in the top 2 rows for Accuracy or F1-score
const isTopAccuracy = (item) => topAccuracyRows.value.includes(item);
const isTopF1Score = (item) => topF1ScoreRows.value.includes(item);

// Watch for changes in dm reduction
watch(dim_reduction, (newValue, oldValue) => {
    if (newValue){
        fetchAccuracy()
    } 
});

const fetchAccuracy = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_MPV_APP_URL}ml-predictions-accuracy?dim_reduction=${dim_reduction.value}`)
        // Update the data ref with the fetched data
        let data = response.data?.data
        accuracy_data.value = data.data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

const getDMCharts = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_MPV_APP_URL}machine-learning-dm-charts`)
        // Update the data ref with the fetched data
        let data = response.data?.data
        dimensionality_reduction_chart.value = data
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

onMounted(async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_MPV_APP_URL}ml-predictions`)
        // Update the data ref with the fetched data
        let data = response.data
        machine_learning_algorithms.value = data.data.models.sort()
        dimensionality_reduction_algorithms.value = data.data.dim_reductions.sort()
    } catch (error) {
        console.error('Error fetching data:', error)
    }

    await getDMCharts()
})
</script>

<style>
.center-div {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.table-success {
    border: 2px solid green;
}
</style>