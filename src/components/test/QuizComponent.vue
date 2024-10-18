<template>
    <div>
        <Question v-if="currentQuestionIndex < questions.length" :question="questions[currentQuestionIndex]"
            @nextQuestion="handleNextQuestion" />
        <div v-else>
            <h2>Quiz Completed!</h2>
            <ul>
                <li v-for="(time, index) in times" :key="index">
                    Question {{ index + 1 }}: {{ time }} seconds
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Question from './Question.vue';

const questions = [
    'What is 2 + 2?',
    'What is the capital of France?',
    'What is the color of the sky?'
];
const currentQuestionIndex = ref(0);
const startTime = ref(null);
const times = ref([]);

const handleNextQuestion = () => {
    const endTime = new Date();
    const timeTaken = (endTime - startTime.value) / 1000; // Convert to seconds
    times.value.push(timeTaken);

    currentQuestionIndex.value += 1;
    startTime.value = new Date();
};

onMounted(() => {
    startTime.value = new Date();
});
</script>

<style scoped>
/* Add some basic styling */
</style>