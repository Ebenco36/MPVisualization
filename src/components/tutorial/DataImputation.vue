<script setup>
import { ref, onMounted } from 'vue'
import { useTutorialStore } from '@/stores/tutorial'

// Reactive state variables
const tutorialStore = useTutorialStore()

onMounted(() => {
  let dataset = tutorialStore?.tutorial.dataset
  tutorialStore?.TutorialPipeline(dataset + "/impute", {})
})
</script>
<template>
  <div class="main-content">
    <div class="breadcrumb">
      <h1>Sample Dataset Imputation</h1>
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
              <h3 class="card-title">Cancer Dataset Imputation</h3>
            </div>
            <p>
              Imputation is a statistical technique used to handle missing or incomplete values in a dataset. In the context of the
              breast cancer dataset (<em>load_breast_cancer</em>), imputation may be necessary if the dataset contains missing values.
            </p>

            <h6>Steps in Imputation:</h6>

            <ol>
              <li><strong>Identifying Missing Values:</strong> Check the dataset for missing values in each feature.</li>
              <li><strong>Reasons for Missing Values:</strong> Understand why values are missing, whether due to errors or
                unavailability during data collection.</li>
              <li><strong>Imputation Methods:</strong>
                <ul>
                  <li><em>Mean/Median Imputation:</em> Replace missing numeric values with the mean or median of observed values.
                  </li>
                  <li><em>Mode Imputation:</em> Replace missing categorical values with the mode (most frequent value).</li>
                  <li><em>Regression Imputation:</em> Predict missing values using regression models based on other features.</li>
                  <li><em>K-Nearest Neighbors (KNN) Imputation:</em> Impute missing values based on the nearest neighbors in the
                    feature space.</li>
                </ul>
              </li>
              <li><strong>Considerations for the Breast Cancer Dataset:</strong>
                <ul>
                  <li>Apply imputation carefully to avoid biases, considering the binary classification nature of the dataset
                    (malignant or benign).</li>
                  <li>Features related to cell nuclei characteristics may have missing values, impacting analysis and modeling.</li>
                  <li>Assess the impact of imputation on machine learning model performance, as some algorithms may be sensitive to
                    imputed values.</li>
                </ul>
              </li>
              <li><strong>Implementation in Python:</strong> Utilize libraries like scikit-learn for various imputation methods.</li>
            </ol>

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
