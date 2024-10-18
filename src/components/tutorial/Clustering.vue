<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTutorialStore } from '@/stores/tutorial'
import GraphView from '@/components/dashboard/GraphView.vue'
import AppButton from '@/components/common/AppButton.vue'


// Reactive state variables
const tutorialStore = useTutorialStore()

// props
const options = ref([
    { 
        name: "n_clusters", 
        parent: ["apply_kmeans", "apply_agglomerative" ], 
        value: null, 
        options: [
            { name: 2, value: 2 },
            { name: 3, value: 3 },
            { name: 4, value: 4 },
            { name: 5, value: 5 },
            { name: 6, value: 6 },
        ]
    },
    { 
        name: "linkage", 
        parent: ["apply_agglomerative" ], 
        value: null, 
        options: [
            { name: "ward", value: "ward"},
            { name: "average", value: "average"},
            { name: "complete", value: "complete"},
            { name: "single", value: "single"}
        ]
    },
    { 
        name: "distance_threshold", 
        parent: ["apply_agglomerative" ], 
        value: null, 
        options: [
            { name: 0, value: 0},
            { name: 0.1, value: 0.1},
            { name: 0.2, value: 0.2},
            { name: 0.3, value: 0.3}
        ]
    },
    { 
        name: "max_iter", 
        parent: ["apply_kmeans" ], 
        value: null, 
        options: [
            { name: 100, value: 100},
            { name: 200, value: 200},
            { name: 300, value: 300}
        ]
    },
    { 
        name: "n_init", 
        parent: ["apply_kmeans" ], 
        value: null, 
        options: [
            { name: "auto", value: "auto"},
        ]
    },
    { 
        name: "eps", 
        parent: ["apply_dbscan" ], 
        value: null, 
        options: [
            { name: 0.1, value: 0.1},
            { name: 0.2, value: 0.2},
            { name: 0.3, value: 0.3}
        ]
    },
    { 
        name: "min_samples", 
        parent: ["apply_dbscan" ], 
        value: null, 
        options: [
            { name: 10, value: 10 },
            { name: 20, value: 20 },
            { name: 30, value: 30}
        ]
    },
    { 
        name: "metric", 
        parent: ["apply_dbscan" ], 
        value: null, 
        options: [
            { name: "euclidean", value: "euclidean"}
        ]
    },
    { 
        name: "algorithm", 
        parent: ["apply_dbscan" ], 
        value: null, 
        options: [
            { name: "auto", value: "auto"},
            { name: "ball_tree", value: "ball_tree"},
            { name: "kd_tree", value: "kd_tree"},
            { name: "brute", value: "brute"}
        ]
    }
]);

const optionsWithNonNullValues = computed(() => options.value.filter(option => option.value !== null));

const formattedObject = computed(() => {
    return optionsWithNonNullValues.value.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
    }, {});
});


const dr_options = ref([
    { 
        name: "n_components", 
        parent: ["tsne", "pca" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.n_components, 
        options: [
            { name: 2, value: 2 },
            { name: 3, value: 3 },
            { name: 4, value: 4 },
            { name: 5, value: 5 },
            { name: 6, value: 6 },
        ]
    },
    { 
        name: "perplexity", 
        parent: ["tsne" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.perplexity, 
        options: [
            { name: 20, value: 20 },
            { name: 30, value: 30 },
            { name: 40, value: 40 },
            { name: 50, value: 50 },
            { name: 60, value: 60 },
        ]
    },
    { 
        name: "early_exaggeration", 
        parent: ["tsne" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.early_exaggeration, 
        options: [
            { name: 12, value: 12 },
            { name: 15, value: 15 },
            { name: 18, value: 18 },
            { name: 20, value: 20 },
            { name: 25, value: 25 },
        ]
    },
    { 
        name: "learning_rate", 
        parent: ["tsne" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.learning_rate,
        options: [
            { name: "auto", value: "auto" },
            { name: 10, value: 10 },
            { name: 20, value: 20 },
            { name: 30, value: 30 },
            { name: 40, value: 40 },
        ]
    },
    { 
        name: "metric", 
        parent: ["tsne", "umap" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.metric,
        options: [
            { name: "euclidean", value: "euclidean"}
        ]
    },
    { 
        name: "method", 
        parent: ["umap" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.method,
        options: [
            { name: "barnes_hut", value: "barnes_hut"},
            { name: "exact", value: "exact"}
        ]
    },
    { 
        name: "n_neighbors", 
        parent: ["umap" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.n_neighbors,
        options: [
            { name: 15, value: 15 },
            { name: 30, value: 30 },
            { name: 35, value: 35 },
            { name: 40, value: 40 },
        ]
    },
    { 
        name: "min_dist", 
        parent: ["umap" ], 
        value: tutorialStore?.dimensionality_reduction_selection_options?.min_dist,
        options: [
            { name: 0.1, value: 0.1},
            { name: 0.2, value: 0.2},
            { name: 0.3, value: 0.3}
        ]
    }
])

const optionsWithNonNullValuesDR = computed(() => dr_options.value.filter(option => option.value !== null));

const formattedObjectDR = computed(() => {
    return optionsWithNonNullValuesDR.value.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
    }, {});
});

const dr_methods = ref([
  {name: "PCA", value: "pca"},
  {name: "TSNE", value: "tsne"},
  {name: "UMAP", value: "umap"}
])

const dr_selected_method = ref("")



const methods = ref([
  {name: "KMeans Clustering", value: "apply_kmeans"},
  {name: "Agglomerative Clustering", value: "apply_agglomerative"},
  {name: "DBSCAN", value: "apply_dbscan"}
])

const selected_method = ref("")

function clustering() {
    const mergedParam = { ...formattedObject.value, ...formattedObjectDR.value };
    let params = { ...mergedParam, dimension_method: dr_selected_method.value };

    let dataset = tutorialStore?.tutorial.dataset
    tutorialStore?.TutorialPipeline(dataset + "/" + selected_method.value, params)
    
}

const getSelectedDimensionalityReduction = computed(() =>  {
    return tutorialStore?.dimensionality_reduction_selection.split("_")[1]
})

onMounted(() => {
    let dataset = tutorialStore?.tutorial.dataset
    tutorialStore?.TutorialPipeline(dataset + "/apply_kmeans", {})
    dr_selected_method.value = getSelectedDimensionalityReduction
})
</script>
<template>
  <div class="main-content">
    <div class="breadcrumb">
      <h1>Machine Learning Clustering</h1>
      <ul>
        <li><a href="">Database</a></li>
        <li>Cancer</li>
      </ul>
    </div>
    <div class="separator-breadcrumb border-top"></div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              <h3 class="card-title">Clustering Chart</h3>
            </div>

            <p>
                Clustering is a type of unsupervised learning that involves grouping similar data points together. It helps identify
                patterns and structures within a dataset. Here, we'll explore three clustering algorithms: Agglomerative Clustering,
                K-Means Clustering, and DBSCAN (Density-Based Spatial Clustering of Applications with Noise).
            </p>

            <h6>Agglomerative Clustering</h6>

            <p>
                Agglomerative Clustering is a hierarchical clustering algorithm that starts with individual data points as separate
                clusters and progressively merges them based on their similarity. The process continues until all data points belong
                to a single cluster.
            </p>

            <div>
                <h6>Arguments:</h6>
                <ul>
                <li><strong>n_clusters:</strong> The number of clusters to form.</li>
                <li><strong>linkage:</strong> The linkage criterion to determine the distance between sets of observations. Options includes (ward, average, complete, single)</li>
                <li><strong>distance_threshold:</strong> The linkage distance threshold at or above which clusters will not be merged. If not None, n_clusters must be None and compute_full_tree must be True.</li>
                </ul>
            </div>

            <h6>K-Means Clustering</h6>

            <p>
                K-Means Clustering partitions the dataset into a predefined number of clusters (K) by iteratively assigning data
                points to the nearest cluster centroid and updating the centroids based on the mean of the assigned points.
            </p>

            <div>
                <h6>Arguments:</h6>
                <ul>
                <li><strong>n_clusters:</strong> The number of clusters to form.</li>
                <li><strong>init:</strong> The method for initialization.</li>
                <li><strong>max_iter:</strong> The maximum number of iterations.</li>
                <li><strong>n_init:</strong> The number of times the algorithm will be run with different centroid seeds.</li>
                </ul>
            </div>

            <h6>DBSCAN (Density-Based Spatial Clustering of Applications with Noise)</h6>

            <p>
                DBSCAN is a density-based clustering algorithm that groups together data points that are close to each other and
                separates regions with lower point density. It can identify outliers as noise.
            </p>

            <div>
                <h6>Arguments:</h6>
                <ul>
                <li><strong>eps:</strong> The maximum distance between two samples for one to be considered as in the neighborhood of the other.</li>
                <li><strong>min_samples:</strong> The number of samples in a neighborhood for a point to be considered as a core point.</li>
                <li><strong>metric:</strong> The metric to use when calculating distance between instances.</li>
                <li><strong>algorithm:</strong> The algorithm used for nearest neighbors' search.</li>
                </ul>
            </div>

            <p>
                We grouped similar membrane proteins together, helping us identify potential functional categories or similarities without relying on prior knowledge.
            </p>

            <div class="form-group mb-3">
                <label for="picker1">Select Dimensionality Reduction Method this is where we are: {{ dr_selected_method }} {{ dr_selected_method }}</label>
                <select class="form-control" v-model="dr_selected_method" :value="getSelectedDimensionalityReduction">
                    <option value="">select option...</option>
                    <option 
                        v-for="data in dr_methods" 
                        :key="data.name" 
                        :value="data.value"
                        selected
                    >
                        {{ data.name }}
                    </option>
                </select>
            </div>

            <div class="form-group mb-3 ml-10" v-for="option in dr_options" :key="option.name">
                <div v-if="option.parent.includes(dr_selected_method)">
                    <label for="picker1">{{ option.name }} </label>
                    <select class="form-control" v-model="option.value">
                        <option value="">select option...</option>
                        <option 
                            v-for="item in option.options" 
                            :key="item.name" 
                            :value="item.value"
                        >
                            {{ item.name }}
                        </option>
                    </select>
                </div>
            </div>


            <div class="form-group mb-3">
                <label for="picker1">Select Clustering Method</label>
                <select class="form-control" v-model="selected_method">
                    <option value="">select option...</option>
                    <option 
                        v-for="data in methods" 
                        :key="data.name" 
                        :value="data.value"
                    >
                        {{ data.name }}
                    </option>
                </select>
            </div>

            <div class="form-group mb-3 ml-10" v-for="option in options" :key="option.name">
                <div v-if="option.parent.includes(selected_method)">
                    <label for="picker1">{{ option.name }}</label>
                    <select class="form-control" v-model="option.value">
                        <option value="">select option...</option>
                        <option 
                            v-for="item in option.options" 
                            :key="item.name" 
                            :value="item.value"
                        >
                            {{ item.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-group text-right">
                <AppButton
                    label="Submit"
                    class="btn-primary btn-large mt-3"
                    :handleClick="clustering"
                />
            </div>

            <GraphView 
              id="dimensionReduction" :summary="tutorialStore?.tutorial?.chart" 
              label="Dimensionality Reduction"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-10">
      <div class="col-lg-12 col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              <h3 class="card-title">Clustered Data</h3>
            </div>
            <v-data-table
                :headers="tutorialStore?.tutorial?.headers"
                :items="tutorialStore?.tutorial?.data"
                items-per-page="5"
                v-if="!tutorialStore.isLoading"
              ></v-data-table>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style lang=""></style>
