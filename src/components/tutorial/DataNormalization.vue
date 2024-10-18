<script setup>
import { ref, onMounted } from 'vue'
import { useTutorialStore } from '@/stores/tutorial'

// Reactive state variables
const tutorialStore = useTutorialStore()

onMounted(() => {
  let dataset = tutorialStore?.tutorial.dataset
  tutorialStore?.TutorialPipeline(dataset + "/normalize", {})
})
</script>
<template>
  <div class="main-content">
    <div class="breadcrumb">
      <h1>Sample Dataset Normalization</h1>
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
              <h3 class="card-title">Cancer Dataset Normalization</h3>
            </div>
            <p>
              Normalization is a preprocessing technique used in data analysis and machine learning to scale and transform features
              in a dataset. It ensures that the data falls within a specific range, making it more suitable for algorithms that
              are sensitive to the scale of features.
            </p>

            <h6>Steps in Normalization:</h6>

            <ol>
              <li><strong>Identify Features:</strong> Select the features in the dataset that require normalization.</li>
              <li><strong>Scaling Techniques:</strong>
                <ul>
                  <li><em>Min-Max Scaling:</em> Transform values to a specific range, often between 0 and 1.</li>
                  <li><em>Z-score (Standardization):</em> Transform values to have a mean of 0 and a standard deviation of 1.</li>
                  <li><em>Robust Scaling:</em> Scale features based on the interquartile range, making it robust to outliers.</li>
                  <li><em>Log Transformation:</em> Apply logarithmic transformation to handle skewed distributions.</li>
                </ul>
              </li>
              <li><strong>Normalization Considerations:</strong>
                <ul>
                  <li>Normalize features to prevent certain features from dominating others in algorithms that rely on distances or
                    gradients.</li>
                  <li>Normalization may not be necessary for all algorithms, but it can significantly impact performance for some
                    models.</li>
                </ul>
              </li>
              <li><strong>Implementation in Python:</strong> Utilize libraries like scikit-learn for applying normalization
                techniques to datasets.</li>
            </ol>

            <p>
              We've ensured that all the data is on a consistent scale, making it easier for us to compare and analyze membrane protein features.
            </p>

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
