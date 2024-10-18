<template>
  <div class="main-content">
    <div class="col-md-12" v-if="!tutorialStore?.tutorial?.dataset">
      <div class="card text-left container d-flex justify-content-center  col-sm-6 col-lg-4">
          <div class="card-body">
              <h4 class="card-title mb-3">Choose Dataset</h4>
              <div class="form-group mb-3">
                <label for="picker1">Select Dataset</label>
                <select class="form-control" v-model="selected_dataset">
                    <option value="">select option...</option>
                    <option 
                        v-for="data in dataset" 
                        :key="data" 
                        :value="data"
                    >
                        {{ data }}
                    </option>
                </select>
            </div>

            <div class="form-group text-right">
                <AppButton
                    label="Submit"
                    class="btn-primary btn-large mt-3"
                    :handleClick="loadDataset"
                />
            </div>
          </div>
          
      </div>
    </div>
    <div class="col-md-12" v-else>
      <div class="card text-left">
          <div class="card-body">
              <h4 class="card-title mb-3">
                Playground 
                <button class="badge badge-info" @click="clearDataset">Unset Dataset</button>
              </h4>
              <ul class="nav nav-pills" id="myPillTab" role="tablist">

                  <li class="nav-item" @click="moveToNextStep(1)">
                    <a class="nav-link active show" 
                      id="home-icon-pill" data-toggle="pill" href="#dataset" 
                      role="tab" aria-controls="homePIll" aria-selected="false"
                    >
                      <i class="nav-icon i-Big-Data mr-1"> </i> Dataset
                    </a>
                  </li>

                  <li class="nav-item" @click="moveToNextStep(2)">
                    <a 
                      class="nav-link" id="profile-icon-pill" data-toggle="pill" 
                      href="#imputation" role="tab" aria-controls="profilePIll" 
                      aria-selected="false"
                    >
                      <i class="nav-icon i-File-Edit mr-1"></i> Imputations
                    </a>
                  </li>

                  <li class="nav-item" @click="moveToNextStep(3)">
                    <a 
                      class="nav-link" id="contact-icon-pill" data-toggle="pill" 
                      href="#normalization" role="tab" aria-controls="contactPIll" 
                      aria-selected="true"
                    >
                      <i class="nav-icon i-Arrow-Refresh mr-1"></i> Normalization
                    </a>
                  </li>

                  <li class="nav-item" @click="moveToNextStep(4)">
                    <a 
                      class="nav-link" id="contact-icon-pill" data-toggle="pill" 
                      href="#dimensionality" role="tab" aria-controls="contactPIll" 
                      aria-selected="true"
                    >
                      <i class="nav-icon i-Down1 mr-1"></i> Dimensionality Reduction
                    </a>
                  </li>

                  <li class="nav-item" @click="moveToNextStep(5)">
                    <a 
                      class="nav-link" id="contact-icon-pill" data-toggle="pill" 
                      href="#clustering" role="tab" aria-controls="contactPIll" 
                      aria-selected="true"
                    >
                      <i class="nav-icon i-Line-Chart mr-1"></i> Clustering
                    </a>
                  </li>

              </ul>
              <div class="tab-content" id="myPillTabContent">
                  <div 
                    class="tab-pane fade active show" 
                    id="dataset" role="tabpanel" 
                    aria-labelledby="home-icon-pill"
                    v-if="tutorialStore?.tutorial.step === 1"
                  >
                    <Dataset/>

                  </div>
                  <div 
                    class="tab-pane fade" id="imputation" 
                    role="tabpanel" aria-labelledby="profile-icon-pill"
                    v-if="tutorialStore?.tutorial.step === 2"
                  >
                    <DataImputation/>
                  </div>
                  <div 
                    class="tab-pane fade" id="normalization" 
                    role="tabpanel" aria-labelledby="contact-icon-pill"
                    v-if="tutorialStore?.tutorial.step === 3"
                  >
                    <DataNormalization/>
                  </div>
                  <div 
                    class="tab-pane fade" id="dimensionality" 
                    role="tabpanel" aria-labelledby="contact-icon-pill"
                    v-if="tutorialStore?.tutorial.step === 4"
                  >
                    <DimensionalityReduction/>
                  </div>
                  <div 
                    class="tab-pane fade" id="clustering" 
                    role="tabpanel" aria-labelledby="contact-icon-pill"
                    v-if="tutorialStore?.tutorial.step === 5"
                  >
                    <Clustering/>
                  </div>
              </div>
              <div class="container d-flex justify-content-between">
                <v-btn @click="prevStep">Previous</v-btn>
                <v-btn @click="nextStep">Next</v-btn>
              </div>
          </div>
          
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import Dataset from '@/components/tutorial/Dataset.vue';
import DataImputation from '@/components/tutorial/DataImputation.vue';
import DataNormalization from '@/components/tutorial/DataNormalization.vue';
import Clustering from '@/components/tutorial/Clustering.vue';
import DimensionalityReduction from '@/components/tutorial/DimensionalityReduction.vue';
import { useTutorialStore } from '@/stores/tutorial'


// select dataset
const dataset = ref(['cancer', 'diabetes'])

const selected_dataset = ref("")

function loadDataset() {
  tutorialStore?.chooseDataset(selected_dataset.value)
}

function clearDataset() {
  tutorialStore?.unsetDataset()
}

// Reactive state variables
const tutorialStore = useTutorialStore()

function moveToNextStep(step_number) {
  tutorialStore?.updateStep(step_number)
}

function prevStep() {
  if(tutorialStore?.tutorial.step > 1)
    tutorialStore?.updateStep(tutorialStore?.tutorial.step - 1)
}

function nextStep() {
  if(tutorialStore?.tutorial.step < 5)
    tutorialStore?.updateStep(tutorialStore?.tutorial.step + 1)
}

onMounted(() => {
})
</script>

<!-- Make sure you have Vuetify styles loaded -->
<style>
</style>
