<template>
    <div id="app">
        <Quiz />
        {{ posts }}
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Quiz from '../components/test/QuizComponent.vue';
const posts = ref({})
const fetchPosts = async() => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        posts.value = response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

onMounted(async () => {
    fetchPosts()
})
</script>

<style>
/* Add some basic styling */
</style>