<template lang="">
  <div class="wrapp-center">
    <div class="app-model-card" style="text-align:justify!important">
      <div class="training-contents">
        <h2 class="title" style="text-align:center; font-size: 25px;">Welcome to MetaMP</h2>
    
        <div class="sections">
            <p>
              The aim of <strong>MetaMP</strong> is to advance membrane protein research through interactive 
              visualizations and machine learning. MetaMP integrates databases 
              such as MPstruc (Membrane Protein Structural Database), 
              UniProt (Universal Protein Resource), 
              PDB (Protein Data Bank), and OPM (Orientations of Proteins in Membranes) to provide researchers with comprehensive 
              data, offering an up-to-date view and contextual visual information on 
              purification techniques, structure determination methods, and more.
            </p>
            
            <h5><strong>Use cases:</strong></h5>
            <strong>Summary Statistics</strong><br>
            <strong>Outlier Identification/Detection</strong><br><br>

            <p>
              <strong>Note: </strong>
              This survey consists of seven questions: two on summary statistics and five on 
              outlier identification/detection. 
              Each test includes a training step to enhance understanding. 
              At the end, you can evaluate the tool and provide feedback.
            </p>
        </div>

        <!-- <div class="section">
            <h2><strong>Tips:</strong></h2>
            <ul style="padding-left: 25px;">
                <li>Take the MetaMP tour to learn how to use the system effectively. </li>
                <li>Please carefully read each question, follow the instructions provided in the training section, and ensure you have a clear understanding before responding.</li>
            </ul>
        </div> -->
      </div>
      <strong class="titles" style="text-align:center;">Take your time to answer as accurately as possible.</strong>
      <p>
        Please click on 'Start' button when you are ready.</p>
      <AppButton
        label="Start"
        class="btn-primary btn-large mt-3 mb-3 font-weight-bold"
        :isLoading="training.trainingData?.isLoading"
        :handleClick="handleStart"
      />

      <p class="mt-5" style="font-size: 12pt;">
        This should take about <strong>10 minutes</strong>.
      </p>
      <!-- <span class="" style="font-weight: 900;">OR</span> 
      <p class="mt-5">
        try our playground <a href="javascript:void(0)" @click="gotoPlayground">here</a>
      </p>
       -->
    </div>
  </div>
</template>
<script setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useTrainingStore } from '../../stores/training'
import AppButton from '../common/AppButton.vue';


const props = defineProps({
  type: String,
})
const { type } = toRefs(props)

const router = useRouter()

const training = useTrainingStore()

function handleStart() {
  /* Call start training */
  training.loadQuestion(type.value)
  training.trainingStartTime()
}

function gotoPlayground() {
  router.push("/tutorial")
}

</script>
<style scoped>
h1 {
    text-align: center;
}
.section {
    margin-bottom: 20px;
}
.section h2 {
    font-size: 1em;
}
.section p {
    margin-bottom: 10px;
}
.button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
}
.button:hover {
    background-color: #0056b3;
}
</style>
