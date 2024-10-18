<script setup>
import { ref, onMounted } from 'vue'
import { useTutorialStore } from '@/stores/tutorial'

// Reactive state variables
const tutorialStore = useTutorialStore()

onMounted(() => {
  let dataset = tutorialStore?.tutorial.dataset
  tutorialStore?.TutorialPipeline(dataset + "/data_view", {})
})
</script>
<template>
  <div class="main-content">
    <div class="breadcrumb">
      <h1>Sample Dataset</h1>
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
              <h3 class="card-title">Cancer Dataset</h3>
            </div>
            <div v-if="tutorialStore?.tutorial?.dataset === 'cancer'">
              <p>
                <strong>Description:</strong> load_breast_cancer is a dataset available in the popular machine learning library
                scikit-learn. This dataset is specifically designed for binary classification tasks and is commonly used for
                practicing and demonstrating various machine learning algorithms.
              </p>

              <h6><b>Dataset Details:</b></h6>

              <dl>
                <dt>Name:</dt>
                <dd>Breast Cancer Wisconsin (Diagnostic) dataset</dd>

                <dt>Source:</dt>
                <dd>This dataset is derived from a digitized image of a fine needle aspirate (FNA) of a breast mass. The features
                  are computed from a digitized image of a fine needle aspirate (FNA) of a breast mass.</dd>

                <dt>Number of Instances:</dt>
                <dd>569</dd>

                <dt>Number of Features:</dt>
                <dd>30 numeric, real-valued features computed from cell nuclei characteristics.</dd>

                <dt>Target Variable:</dt>
                <dd>The target variable is binary, indicating whether the breast mass is malignant (cancerous) or benign
                  (non-cancerous). Malignant is encoded as 0, and benign is encoded as 1.</dd>
              </dl>
            </div>
            <div v-if="tutorialStore?.tutorial?.dataset === 'diabetes'">
              <p>
                The <strong>load_diabetes</strong> dataset is a built-in dataset in scikit-learn, specifically designed for regression
                tasks. It contains information about 442 diabetes patients, with ten baseline variables and a quantitative measure of
                disease progression one year after baseline.
              </p>

              <h6>Dataset Details:</h6>

              <dl>
                <dt>Name:</dt>
                <dd>Diabetes dataset</dd>

                <dt>Source:</dt>
                <dd>Bradley Efron, Trevor Hastie, Iain Johnstone, and Robert Tibshirani, "Least Angle Regression," Annals of Statistics
                  (with discussion), 2004.</dd>

                <dt>Number of Instances:</dt>
                <dd>442</dd>

                <dt>Number of Features:</dt>
                <dd>10 baseline variables, including age, sex, BMI, average blood pressure, and six blood serum measurements.</dd>

                <dt>Target Variable:</dt>
                <dd>A quantitative measure of disease progression one year after baseline.</dd>
              </dl>
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
