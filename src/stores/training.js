import { ref } from 'vue'
import { defineStore } from 'pinia'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import TrainingService from '../services/training.service'


export const useTrainingStore = defineStore('training', () => {
  const trainingData = ref({
    status: '',
    isLoading: false,
    questCategoryNumber: 0,
    questionNumber: 0,
    totalQuestions: 0,
    questionList: [],
    selectedAnswers: [],
    questionIndex: 0,
    startTime: "",
    endTime: "",
    duration: "",
    timeForEachQuestion: [],
    timeForEachQuestionStartTime: ""
  })

  const $toast = useToast();

  const trainingDataChart = ref({})

  function updateTrainingStatus(status) {
    trainingData.value.status = status
  }

  async function loadQuestion(type) {
    trainingData.value.isLoading = true;
    /*
    setTimeout(() => {
      trainingData.value.isLoading = false;
      trainingData.value.status = 'ongoing'
      trainingData.value.questionList = question;
    }, 2000);
    */

      await TrainingService.loadTrainingData(type)
        .then(res => {
          trainingData.value.questionList = res?.data
          trainingData.value.isLoading = false;
          trainingData.value.status = 'ongoing'
          getQuestionCounts(trainingData.value.questionList)
        })
        .catch(err => {
          trainingData.value.isLoading = false;
          trainingData.value.error = err.message;
          setTimeout(() => {
            trainingData.value.error = null;
          }, 3000)
      })
  }

  async function submitTraining(userData) {
     await TrainingService.postTraing(userData)
      .then(res => {
        /*
        $toast.success("Not too challenging, is it? Let's move on to the next stage—the testing phase.", {
          "duration": 10000,
          "position": "top-right"
        });
        */
      })
      .catch(err => {
        trainingData.value.isLoading = false;
        trainingData.value.error = err.message;
        setTimeout(() => {
          trainingData.value.error = null;
        }, 3000)
      })
  }

  async function loadCharts(data) {
    await TrainingService.loadTrainingCharts(data)
     .then(res => {
       trainingDataChart.value = res.data
       console.log(trainingDataChart.value)
       return res.data
     })
     .catch(err => {
       trainingData.value.isLoading = false;
       trainingData.value.error = err.message;
       setTimeout(() => {
         trainingData.value.error = null;
       }, 3000)
     })
  }

  async function getQuestionCounts(questionList){
    let count = 0
    questionList.forEach(item => {
      count += item.questions.length
    });
    trainingData.value.totalQuestions = count
  }

  function nextTrainingQuestionNumber() {
    if (!trainingData.value.questionList[trainingData.value.questCategoryNumber]?.questions[trainingData.value.questionNumber]?.options) {
      trainingData.value.questCategoryNumber = trainingData.value.questCategoryNumber + 1;
      trainingData.value.questionNumber = 0;
      console.log("First place")
    }
    else if (trainingData.value.questionNumber <= (trainingData.value.questionList[trainingData.value.questCategoryNumber].questions.length - 1) && (trainingData.value.questionNumber !== (trainingData.value.questionList[trainingData.value.questCategoryNumber].questions.length - 1))) {
      trainingData.value.questionNumber = trainingData.value.questionNumber + 1
      console.log("Second place")
      if (!trainingData.value.questionList[trainingData.value.questCategoryNumber]?.questions[trainingData.value.questionNumber]?.options) {
        trainingData.value.questCategoryNumber = trainingData.value.questCategoryNumber + 1;
        trainingData.value.questionNumber = 0;
        console.log("Third place")
      }
    } else if (trainingData.value.questionNumber === trainingData.value.questionList[trainingData.value.questCategoryNumber].questions.length - 1) {
      trainingData.value.questCategoryNumber = trainingData.value.questCategoryNumber + 1;
      trainingData.value.questionNumber = 0;
      console.log("Fourth place")
    }
    
    if ((trainingData.value.questionIndex === trainingData.value.totalQuestions - 1)) {
      trainingData.value.status = 'submit'
      console.log("Fifth place")
    }
    trainingData.value.questionIndex += 1
    console.log("Question number: " + trainingData.value.questionNumber)
    console.log("Question number Index: " + trainingData.value.questionIndex)

    // Add implementation for time to complete each question
    handleNextQuestionTimer()
  }
  
  const handleNextQuestionTimer = () => {
      const endTime = new Date();
      const timeTaken = (endTime - trainingData.value.timeForEachQuestionStartTime) / 1000; // Convert to seconds
      
      // Push the time taken for the current question to the timeForEachQuestion array
      trainingData.value.timeForEachQuestion.push({
          [trainingData.value.questionIndex]: timeTaken
      });
      
      // Reset the start time for the next question
      trainingData.value.timeForEachQuestionStartTime = new Date();
  };

  function updateTrainingQuestions(questions) {
    trainingData.value.questionList = questions
  }

  function updateTrainingAnswers(answer_object) {
    trainingData.value.selectedAnswers.push(answer_object)
  }

  function trainingStartTime(){
    trainingData.value.startTime = new Date().toLocaleTimeString();
    trainingData.value.timeForEachQuestionStartTime = new Date();
  }

  function trainingEndTime() {
    trainingData.value.endTime = new Date().toLocaleTimeString();
  }

  // property to calculate training duration
  async function trainingDuration() {
    // Calculate the duration by subtracting start time from end time
    const startTime = new Date(`2000-01-01T${trainingData.value.startTime}`);
    const endTime = new Date(`2000-01-01T${trainingData.value.endTime}`);

    // Calculate the time difference in milliseconds
    const durationMs = endTime - startTime;

    // Convert milliseconds to seconds
    const durationSeconds = durationMs / 1000;

    // Return the difference in seconds (you can adjust this as needed)
    trainingData.value.duration = durationSeconds
  }

  function getTimeDuration() {
    let data = {
      "startTime": trainingData.value.startTime, 
      "endTime": trainingData.value.endTime, 
      "duration": trainingData.value.duration
    }
    console.log(data)
    return data
  }

  return {
    trainingData,
    updateTrainingStatus,
    loadQuestion, nextTrainingQuestionNumber,
    updateTrainingQuestions, updateTrainingAnswers,
    submitTraining, loadCharts, trainingDataChart, trainingStartTime, 
    trainingEndTime, trainingDuration, getTimeDuration
  }
})