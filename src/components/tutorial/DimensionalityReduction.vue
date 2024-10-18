<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTutorialStore } from '@/stores/tutorial'
import GraphView from '@/components/dashboard/GraphView.vue'
import AppButton from '@/components/common/AppButton.vue'


const dr_options = ref([
    { 
        name: "n_components", 
        parent: ["apply_tsne", "apply_pca" ], 
        value: null, 
        options: [
            { name: 2, value: 2 },
            
        ]
    },
    { 
        name: "perplexity", 
        parent: ["apply_tsne" ], 
        value: null, 
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
        parent: ["apply_tsne" ], 
        value: null, 
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
        parent: ["apply_tsne" ], 
        value: null, 
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
        parent: ["apply_tsne", "apply_umap" ], 
        value: null, 
        options: [
            { name: "euclidean", value: "euclidean"}
        ]
    },
    { 
        name: "method", 
        parent: ["apply_umap" ], 
        value: null, 
        options: [
            { name: "barnes_hut", value: "barnes_hut"},
            { name: "exact", value: "exact"}
        ]
    },
    { 
        name: "n_neighbors", 
        parent: ["apply_umap" ], 
        value: null, 
        options: [
            { name: 15, value: 15 },
            { name: 30, value: 30 },
            { name: 35, value: 35 },
            { name: 40, value: 40 },
        ]
    },
    { 
        name: "min_dist", 
        parent: ["apply_umap" ], 
        value: null, 
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

const methods = ref([
  {name: "PCA", value: "apply_pca"},
  {name: "TSNE", value: "apply_tsne"},
  {name: "UMAP", value: "apply_umap"}
])

const selected_method = ref("")

function dimensionalityReduction() {
    let dataset = tutorialStore?.tutorial.dataset
    tutorialStore?.TutorialPipeline(dataset + "/" + selected_method.value, formattedObjectDR.value)
    tutorialStore?.updateDimensionalityReductionData(selected_method.value)
    tutorialStore?.updateDimensionalityReductionDataOptions(formattedObjectDR.value)
}
// Reactive state variables
const tutorialStore = useTutorialStore()

onMounted(() => {
  let dataset = tutorialStore?.tutorial.dataset
  tutorialStore?.TutorialPipeline(dataset + "/apply_pca", {})
})
</script>
<template>
  <div class="main-content">
    <div class="breadcrumb">
      <h1>Dimensionality Reduction</h1>
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
              <h3 class="card-title">Dimensionality Reduction Chart</h3>
            </div>
            <p>
              Dimensionality reduction is a technique used to reduce the number of features or dimensions in a dataset while
              preserving essential information. It is commonly employed in machine learning and data visualization to handle
              high-dimensional data and improve computational efficiency.
            </p>

            <h6>t-SNE (t-distributed Stochastic Neighbor Embedding):</h6>
            <p>
              t-SNE is a nonlinear dimensionality reduction technique that is particularly effective for visualizing high-dimensional
              data in two or three dimensions. It preserves local relationships between data points, making it useful for
              maintaining the structure of clusters.
            </p>

            <h6>UMAP (Uniform Manifold Approximation and Projection):</h6>
            <p>
              UMAP is another nonlinear dimensionality reduction algorithm known for its ability to preserve both local and global
              structures in the data. It is effective for various types of data and is particularly useful for preserving
              neighborhood relationships.
            </p>

            <h6>PCA (Principal Component Analysis):</h6>
            <p>
              PCA is a linear dimensionality reduction technique that transforms the data into a new coordinate system, capturing
              the directions of maximum variance. It is widely used and provides a good balance between simplicity and
              effectiveness.
            </p>
            <p>
              We simplified the complex data into a visual representation, making it easier to observe patterns and potential groupings among membrane proteins.
            </p>
            <div class="form-group mb-3">
                <label for="picker1">Select Method</label>
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

            <div class="form-group mb-3 ml-10" v-for="option in dr_options" :key="option.name">
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
                    :handleClick="dimensionalityReduction"
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
              <h3 class="card-title">Dimensionality Reduction Data</h3>
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
