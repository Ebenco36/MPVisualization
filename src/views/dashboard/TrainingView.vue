<template>
  <div class="main-content">
    <StartPad :type="router.currentRoute.value.params.type" v-if="training.trainingData?.status === ''" />

    <Question :type="router.currentRoute.value.params.type" v-if="training.trainingData?.status === 'ongoing' || training.trainingData?.status === 'submit'" />

    <CompleteModal :type="router.currentRoute.value.params.type" v-if="training.trainingData?.status === 'success'" />

    <Feedback :type="router.currentRoute.value.params.type" v-if="training.trainingData?.status === 'completed'" />

    <FinalPage :type="router.currentRoute.value.params.type" v-if="training.trainingData?.status === 'done'" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTrainingStore } from '@/stores/training'
import Question from '@/components/training/Question.vue'
import Feedback from '@/components/training/Feedback.vue'
import StartPad from '@/components/training/StartPad.vue'
import CompleteModal from '@/components/training/CompleteModal.vue'
import FinalPage from '../../components/training/FinalPage.vue'

const router = useRouter()

const training = useTrainingStore()
const sectionTitle = ref('')

const type = ref('')
onMounted(() => {
    type.value = router.currentRoute.value.params.type || 'training';
})

</script>
<style lang=""></style>