<template>
    <v-card>
      <v-card-title>User Answers</v-card-title>
      <!-- Download CSV Button -->
      <v-card-actions>
        <v-btn color="primary" @click="downloadCSV">Download CSV</v-btn>
      </v-card-actions>
      <v-data-table
        :headers="headers"
        :items="sessions"
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ formatTimestamp(item.createdAt) }}
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          {{ formatTimestamp(item.updatedAt) }}
        </template>
      </v-data-table>

      <SUSChart v-if="chartConfigs" :chartConfigs="chartConfigs" />

    </v-card>
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import { format } from 'date-fns'
    import axios from 'axios'
    import SUSChart from '@/components/dashboard/Plotly/SUSChart.vue'

    const sessions = ref([]);
    const headers = ref([
        { title: 'ID', key: 'id' },
        { title: 'Answer ID', key: 'answerId' },
        { title: 'Duration', key: 'duration' },
        { title: 'Time Taken', key: 'timeTaken' },
        { title: 'Question ID', key: 'questionId' },
        { title: 'Start Time', key: 'startTime' },
        { title: 'End Time', key: 'endTime' },
        { title: 'User ID', key: 'userId' },
        { title: 'Is Correct', key: 'isCorrect' },
        { title: 'Created At', key: 'createdAt' },
        { title: 'Updated At', key: 'updatedAt' },
    ]);

    const chartConfigs = ref(null)
    
    


    const questions = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];

    const processChartData = () => {

      const questionScores = new Array(questions.length).fill(0);
      const questionTimes = new Array(questions.length).fill(0);
      const correctAnswers = new Array(questions.length).fill(0);
      const incorrectAnswers = new Array(questions.length).fill(0);
      const questionCounts = new Array(questions.length).fill(0);
      if (sessions.value) {
        sessions.value.forEach(({ id, timeTaken, isCorrect }) => {
          const questionId = parseInt(id.split('_')[2]);
          const questionIndex = questionId - 1;
          questionScores[questionIndex]++;
          questionTimes[questionIndex] += timeTaken;
          questionCounts[questionIndex]++;
          if (isCorrect) {
            correctAnswers[questionIndex]++;
          } else {
            incorrectAnswers[questionIndex]++;
          }
        });
      }

      return {
        questionScores,
        questionTimes,
        correctAnswers,
        incorrectAnswers,
        questionCounts
      };
    };


    
    // Function to format Firestore timestamp
    const formatTimestamp = (timestamp) => {
        const seconds = timestamp._seconds;
        const nanoseconds = timestamp._nanoseconds;
        const date = new Date(seconds * 1000 + nanoseconds / 1000000);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    };

    // Function to download data as CSV
    const downloadCSV = () => {
        const csvHeaders = headers.value.map(header => header.title);

        const csvContent = sessions.value.map(session => {
            return headers.value.map(header => {
            const fieldName = header.key; // Get field name from header key
            if (fieldName === 'createdAt' || fieldName === 'updatedAt') {
                return formatTimestamp(session[fieldName]);
            }
            return session[fieldName] ?? ''; // Use empty string for undefined or null values
            }).join(',');
        });

        // Combine headers and rows into CSV content
        const csvData = [csvHeaders.join(','), ...csvContent].join('\n');

        // Create a Blob object and download link
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'sessions.csv');
        link.click();
    };

  
    // Fetch data from API
    onMounted(async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_MPV_APP_URL}download-data/userResponses`); // Replace with your API endpoint
        sessions.value = response.data; // Assuming the API returns an array of sessions
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }

      const { questionTimes, correctAnswers, incorrectAnswers, questionCounts } = processChartData();
      
      const timeChartData = {
        data: [{
          x: questions,
          y: questionTimes.map((time, index) => time / questionCounts[index]), // Mean time per question
          type: 'bar',
          marker: {
            color: 'lightgreen'
          }
        }],
        layout: {
          title: 'Average Time Taken per Question (seconds)',
          xaxis: {
            title: 'SUS Questions'
          },
          yaxis: {
            title: 'Average Time (seconds)'
          }
        }
      };

      const correctnessChartData = {
        data: [
          {
            x: questions,
            y: correctAnswers,
            name: 'Correct',
            type: 'bar',
            marker: {
              color: 'lightblue'
            }
          },
          {
            x: questions,
            y: incorrectAnswers,
            name: 'Incorrect',
            type: 'bar',
            marker: {
              color: 'salmon'
            }
          }
        ],
        layout: {
          title: 'Correct vs Incorrect Answers per Question',
          barmode: 'stack',
          xaxis: {
            title: 'SUS Questions'
          },
          yaxis: {
            title: 'Count'
          }
        }
      };

      chartConfigs.value = [timeChartData, correctnessChartData];

    });
  </script>
  
  <style scoped>
  /* Add custom styles here if needed */
  </style>
  