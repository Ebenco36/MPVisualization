<template>
  <div class="main-content">
    <StartPad :type="trainingType" v-if="training.trainingData?.status === ''" />

    <Question :type="trainingType" v-if="training.trainingData?.status === 'ongoing' || training.trainingData?.status === 'submit'" />

    <CompleteModal :type="trainingType" v-if="training.trainingData?.status === 'success'" />

    <Feedback :type="trainingType" v-if="training.trainingData?.status === 'completed'" />

    <FinalPage :type="trainingType" v-if="training.trainingData?.status === 'done'" />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTrainingStore } from '@/stores/training'
import Question from '@/components/training/Question.vue'
import Feedback from '@/components/training/Feedback.vue'
import StartPad from '@/components/training/StartPad.vue'
import CompleteModal from '@/components/training/CompleteModal.vue'
import FinalPage from '../../components/training/FinalPage.vue'

const route = useRoute()
const training = useTrainingStore()
const trainingType = computed(() => route.params.type || 'training')
</script>
<style lang=""></style>
