<template>
  <div class="qs-footer">
    <div class="qs-ans" v-if="trainingData.status != 'submit'">
      <div
        class="qs-ans-item"
        @click="!selectedAnswer && handleSelectOption(item)"
        v-for="(item, index) in questionOptions.sort((a, b) => a.id - b.id)"
        :key="item.id + '__' + index"
        :class="[
          (selectedAnswer === null) ? '' : trainingData.questionList[trainingData.questCategoryNumber]?.questions[
          trainingData.questionNumber
        ]?.question_type === 'training' ? ((selectedAnswer && item.is_correct) ? 'correct' : 'wrong') : '',
          selectedAnswer && (selectedAnswer?.is_correct === item.is_correct) && (selectedAnswer?.id === item.id) ? 'selected' : ''
        ]"
      >
        <div v-if="(selectedAnswer === null) ? '' : trainingData.questionList[trainingData.questCategoryNumber]?.questions[
          trainingData.questionNumber
          ]?.question_type === 'training'">
          <span class="ans-check" v-if="selectedAnswer && item.is_correct" style="font-size: x-large;">&#10003;</span>
          <span class="ans-check" v-else-if="selectedAnswer && !item.is_correct">&#10005;</span>
          <span class="ans-check" style="font-size: x-large;" v-else>&middot;</span>
        </div>
        <div v-else>
          <span class="ans-check" style="color: grey!important; font-size: x-large;">&middot;</span> 
          <!-- <span class="ans-check" style="color: grey!important; font-size: x-large;" v-if="selectedAnswer && item.is_correct">&#10003;</span>
          <span class="ans-check" style="color: grey!important;" v-else-if="selectedAnswer && !item.is_correct">&#10005;</span>
          <span class="ans-check" style="color: grey!important; font-size: x-large;" v-else>&middot;</span> -->
        </div>
        <p>{{ item.text }}</p>
        <!-- <span>
          {{ selectedAnswer && (item.is_correct) ? '&#10003;' : '&#10005;' }}
        </span> -->
      </div>
    </div>
    <AppButton
      :label="trainingData.status === 'submit' ? 'Next' : 'Next'"
      class="btn-primary btn-large"
      :handleClick="handleNext"
      :disabled="
        ((trainingData.status !== 'submit') && (selectedAnswer === null &&
        trainingData.questionList[trainingData.questCategoryNumber]?.questions[
          trainingData.questionNumber
        ]?.options?.length > 0))
      "
    />
  </div>
</template>
<script setup>
import { ref, watchEffect, toRefs } from 'vue'
import { useTrainingStore } from '../../stores/training'
import AppButton from '../common/AppButton.vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


const props = defineProps({
  questionOptions: Array,
  question: Object,
  type: String,
})

const $toast = useToast();

const router = useRouter()
const selectedAnswer = ref(null)
const classLoader = ref('')

const { 
  trainingData, nextTrainingQuestionNumber, 
  updateTrainingAnswers, updateTrainingStatus, 
  submitTraining, trainingEndTime, trainingDuration,
  getTimeDuration
} = useTrainingStore()
const { questionOptions, question, type } = toRefs(props)

function handleSelectOption(selectedOption) {
  console.log({ selectedOption })
  let compiledAnswer = selectedOption
  compiledAnswer["question"] = question.value.text;
  updateTrainingAnswers(compiledAnswer)
  selectedAnswer.value = selectedOption
}

function handleNext() {
  if (trainingData.status === 'submit') {
    trainingEndTime()
    // submit result for review
    trainingDuration().then(() => {
      let data = {
        "answers": trainingData.selectedAnswers,
        "time": getTimeDuration(),
        "questionBasedTimer": trainingData.timeForEachQuestion
      }
      submitTraining(data)
      
        $toast.info('Thank you for submitting. Redirecting you to the feedback page ...', {
          "duration": 10000
        });
        updateTrainingStatus('completed')
    })

  } else {
    selectedAnswer.value = null
    nextTrainingQuestionNumber()
  }
}

watchEffect(async () => {})
</script>
<style scoped>
  .qs-ans-item.selected{
    border: 2px solid grey;
  }
</style>