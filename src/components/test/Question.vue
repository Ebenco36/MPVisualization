<template>
    <div>
        <h2>{{ question }}</h2>
        <!-- Add input or selection elements for the question -->
        <button @click="nextQuestion">Next</button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    question: String
});

const emits = defineEmits(['nextQuestion']);

const nextQuestion = () => {
    emits('nextQuestion');
};
</script>

<style scoped>
/* Add some basic styling */
</style>