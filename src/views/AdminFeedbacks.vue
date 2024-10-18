<template>
  <v-card>
    <v-card-title>
      User Data
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="downloadCSV">Download CSV</v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="transformedUsers"
      item-key="id"
      class="elevation-1"
    ></v-data-table>

    <div v-if="feedbackGroups.length">
      <h2>Feedback Analysis</h2>
      <div v-for="(group, index) in feedbackGroups" :key="index" class="feedback-group">
        <h3>{{ group.title }}</h3>
        <SUSChart v-if="group.chartConfigs" :chartConfigs="group.chartConfigs" />
      </div>
    </div>
    <div v-else>
      <p>No feedback data available.</p>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SUSChart from '@/components/dashboard/Plotly/SUSChart.vue'; // Adjust import path as per your project

// Initialize reactive variables
const users = ref([]);
const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Gender', key: 'gender' },
  { title: 'Years of Experience', key: 'yearsOfExperience' },
  { title: 'Domain', key: 'domain' },
  { title: 'Response ID', key: 'responses_id' },
  { title: 'Response Question Text', key: 'responses_questionText' },
  { title: 'Response Option', key: 'responses_option' },
  { title: 'Comment', key: 'comment' },
  { title: 'User ID', key: 'userId' },
  { title: 'Is Student', key: 'isStudent' },
  { title: 'Created At', key: 'createdAt' },
  { title: 'Updated At', key: 'updatedAt' },
]);
// Transformed users data for the table
const transformedUsers = ref([]);

const feedbackGroups = ref([]);

const processFeedbackData = () => {
  if (transformedUsers.value.length > 0) {
    // Group by Gender
    const genderGroups = groupBy(transformedUsers.value, 'gender');
    processGroups(genderGroups, 'Gender');

    // Group by Domain
    const domainGroups = groupBy(transformedUsers.value, 'domain');
    processGroups(domainGroups, 'Domain');

    // Group by Years of Experience
    const expGroups = groupBy(transformedUsers.value, 'yearsOfExperience');
    processGroups(expGroups, 'Years of Experience');

    // Group by Question Text
    const questionGroups = groupBy(transformedUsers.value, 'responses_questionText');
    processGroups(questionGroups, 'Response Question Text');
  }
};

const groupBy = (data, key) => {
  return data.reduce((groups, entry) => {
    const value = entry[key];
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(entry);
    return groups;
  }, {});
};

const processGroups = (groups, titleKey) => {
  for (const [key, value] of Object.entries(groups)) {
    const chartConfigs = generateChartConfigs(value);
    feedbackGroups.value.push({
      title: `${titleKey}: ${key}`,
      chartConfigs
    });
  }
};

const generateChartConfigs = (data) => {
  const chartData = data.map(entry => ({
    questionId: entry['responses_id'],
    answerId: parseInt(entry['responses_option']),
    timeTaken: calculateTimeTaken(entry['createdAt'], entry['updatedAt']),
  }));

  const meanAverage = calculateMeanAverage(data, 'responses_option');

  return {
    dataView: chartData,
    meanAverage // Include meanAverage if needed by SUSChart
  };
};

const calculateMeanAverage = (data, optionKey) => {
  const totalOptions = data.reduce((sum, entry) => {
    return sum + parseInt(entry[optionKey]);
  }, 0);
  return totalOptions / data.length;
};

const calculateTimeTaken = (createdAt, updatedAt) => {
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);
  return (updatedDate - createdDate) / 1000; // Time in seconds
};

// Fetch data function
const fetchData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_MPV_APP_URL}download-data/feedback`);
    const result = await response.json();
    users.value = result; // Update users array with fetched data
    transformData();
    processFeedbackData();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Function to transform the users data
const transformData = () => {
  transformedUsers.value = users.value.flatMap(user =>
    user.responses.map(response => ({
      id: user.id,
      name: user.name,
      gender: user.gender,
      yearsOfExperience: user.yearsOfExperience,
      domain: user.domain,
      responses_id: response.questionId,
      responses_questionText: response.questionText,
      responses_option: response.option.value,
      comment: user.comment,
      userId: user.userId,
      isStudent: user.isStudent,
      createdAt: new Date(user.createdAt._seconds * 1000).toLocaleString(),
      updatedAt: new Date(user.updatedAt._seconds * 1000).toLocaleString(),
    }))
  );
};

// Function to download data as CSV
const downloadCSV = () => {
  const csvContent = [
    headers.value.map(header => header.title).join(','), // Header row
    ...transformedUsers.value.map(row =>
      [
        row.id,
        row.name,
        row.gender,
        row.yearsOfExperience,
        row.domain,
        row.responses_id,
        row.responses_questionText,
        row.responses_option,
        row.comment,
        row.userId,
        row.isStudent,
        row.createdAt,
        row.updatedAt,
      ].map(value => `"${value}"`).join(',') // Add quotes to handle commas in data
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', 'user_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fetch data and process users on component mount
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.feedback-group {
  margin-top: 20px;
}
</style>
