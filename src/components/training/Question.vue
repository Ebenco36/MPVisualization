<template>
  <div>
    <HeaderCrumbs :label="(
      training.trainingData.questionList[
        training.trainingData.questCategoryNumber
      ]?.questions[
        training.trainingData.questionNumber
      ]?.question_type === 'test'
    ) ? 'Testing' : ((training.trainingData.questionList[
      training.trainingData.questCategoryNumber
    ]?.questions[
      training.trainingData.questionNumber
    ]?.question_type === 'training'
    ) ? 'Training' : 'Proceed')" />

    <div class="question">
      <div class="qs-header" id="category-desc">
        <div class="row justify-content-between">
          <div class="col-lg-12 " style="text-align: justify;" v-if="training.trainingData.status != 'submit'">
            <div class="card mb-2 p-3">
              <h2>
                {{ training.trainingData.questionList[training.trainingData.questCategoryNumber]?.name }}
              </h2>
              <p v-if="(
                training.trainingData.questionList[
                  training.trainingData.questCategoryNumber
                ]?.questions[
                  training.trainingData.questionNumber
                ]?.question_type
              )" v-html="training.trainingData.questionList[training.trainingData.questCategoryNumber]?.description">
              </p>
            </div>
          </div>
          <!--
          <div class="col-lg-3"><h3 class="text-right">00:00:00</h3></div>
          -->
        </div>
      </div>
      <div class="qs-body">
        <div class="row">
          <div class="col-lg-8" v-if="!(training.trainingData.status === 'submit' && training.trainingData.questionList[
                training.trainingData.questCategoryNumber
              ]?.questions[
                training.trainingData.questionNumber
              ]?.question_type === 'test')">
            <div class="card chart-card col-md-12 center" :class="{ fullView: viewToggle }" id="chart-view">
              <span @click="handleScale" class="view-option i-Full-Screen-2"></span>
              <div class="content mt-5" ref="chartCard" v-if="training.trainingData.status != 'submit'" id="chart-filters">
                <!--Form tool-->
                <form v-if="training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                  training.trainingData.questionNumber
                ]?.filter_tools" id="filter-form" @submit.prevent="postChart">
                  <div class="row">
                    <div
                      :class="{ 'form-group col-md-6 col-lg-6': training.trainingData.questionList[training.trainingData.questCategoryNumber]?.name == 'Data Filtering', 'form-group col-md-12 col-lg-12': training.trainingData.questionList[training.trainingData.questCategoryNumber]?.name != 'Data Filtering' }"
                      v-for="tool in training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                        training.trainingData.questionNumber
                      ]?.filter_tools" :key="tool.value">
                      <div v-if="((tool.parent && switchSelectOption(tool.parent)) || !tool.parent || tool.parent == '*')">
                        <label>Select <strong>{{ tool.title }}</strong></label>
                        <select :disabled="true" ref="form_input" v-if="(training.trainingData.questionIndex == (training.trainingData.totalQuestions - 2)) || training.trainingData.questionIndex == (training.trainingData.totalQuestions - 1)" :multiple="true" class="form-control" v-model="tool.selected_option" name="categorical_variable">
                          <option :selected="true" v-for="option in tool.filter_tool_options" :key="option.value" :value="option.value">
                            {{ option.text }}
                          </option>
                        </select>
                        <select v-else ref="form_input" class="form-control" v-model="tool.selected_option" name="categorical_variable">
                          <option v-for="option in tool.filter_tool_options" :key="option.value" :value="option.value">
                            {{ option.text }}</option>
                        </select>
                        <button id="filter-button" class="btn btn-sm btn-primary mt-2">Apply Changes</button>
                      </div>
                    </div>
                  </div>
                </form>
                <!--Form tool ends here-->

                <GraphView
                  v-if="training.trainingData.questionList[training.trainingData.questCategoryNumber]?.name != 'Data Filtering'"
                  id="questionChart" :summary="chart" label="" :show_loading="false" />
                <div v-else>
                  <v-data-table :items="chart?.items" :items-per-page="chart?.per_page"
                    :server-items-length="chart?.total_rows" :no-data-text="noDataText" class="elevation-1">
                    <template v-slot:top>
                      <v-toolbar flat>
                        <v-toolbar-title>Membrane Proteins</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>

                    <template v-slot:bottom>
                      <div class="text-center pt-2">
                        <v-pagination v-model="currentPage" :length="chart?.total_pages"></v-pagination>
                      </div>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon class="me-2" size="small" @click="viewItem(item)">
                        mdi-eye
                      </v-icon>
                    </template>
                  </v-data-table>
                </div>
              </div>
              <div class="content mt-5" v-else>
                <div class="" v-if="training.trainingData.questionList[
                    training.trainingData.questCategoryNumber
                  ]?.questions[
                    training.trainingData.questionNumber
                  ]?.question_type === 'sstraining'">
                  <b class="qs-topic" style="font-size: medium;">Overview</b>
                  <hr />
                  <ul class="ml-5">
                    <li v-for="question in training.trainingData.selectedAnswers" :key="question.id">
                      <div>{{ question.question }}</div>
                      <ul>
                        <li
                          :class="{ 'correct-answer': question.is_correct, 'incorrect-answer': !question.is_correct }">
                          {{ question.text }}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div else>
                  
                  <div class="wrapp-center">
                    <div class="app-model-card success">
                      <div class="icon-wrapper">
                        <svg
                          width="150"
                          height="150"
                          viewBox="0 0 150 150"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="75" cy="75" r="75" fill="#64B25C" />
                          <path
                            d="M51.9004 74.4044L66.4029 88.9069L105.136 50.1736"
                            stroke="white"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <h2 class="title">Great job!</h2>
                      <p>You’re almost done! Please proceed with the SUS (System Usability Scale) user evaluation. Your feedback is crucial.</p>
                      <p>Click on the <strong>"Next"</strong> button to proceed.</p>
                    </div>
                  </div>


                </div>
              </div>

            </div>
            <div class="topic-list" id="topic-list">
              <div class="topic-item" v-for="(item, index) in training.trainingData.questionList" :key="item.id" :class="{
                current:
                  training.trainingData.questionList[training.trainingData.questCategoryNumber]?.name === item.name
              }">
                <span>{{ index + 1 }}</span>
                <p>{{ item.name }}</p>
              </div>
            </div>
          </div>

          <div
            :class="{ 'col-lg-4': (training.trainingData.status === 'submit' && training.trainingData.questionList[
                  training.trainingData.questCategoryNumber
                ]?.questions[
                  training.trainingData.questionNumber
                ]?.question_type === 'training' || training.trainingData.status != 'submit'), 'col-lg-12': (training.trainingData.status === 'submit' && training.trainingData.questionList[
                  training.trainingData.questCategoryNumber
                ]?.questions[
                  training.trainingData.questionNumber
                ]?.question_type === 'test'), 'col-md-4': (training.trainingData.status === 'submit') }"
            id="question-frame">
            <div class="question-card card">
              <div class="qs-topic" v-if="training.trainingData.status != 'submit' && training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                training.trainingData.questionNumber
              ]?.text">Question {{ training.trainingData.questionIndex + 1 }} of {{ training.trainingData.totalQuestions }}</div>
              <div class="qs-topic" v-else-if="!
                training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                  training.trainingData.questionNumber
                ]?.text
              ">Proceed</div>
              <div class="qs-topic" v-else>Submit</div>
              <div class="qs-main">
                <div v-if="training.trainingData.status != 'submit'">
                  
                  <p v-if="
                    training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                      training.trainingData.questionNumber
                    ]?.instruction && training.trainingData.questionList[
                      training.trainingData.questCategoryNumber
                    ]?.questions[
                      training.trainingData.questionNumber
                    ]?.question_type 
                  " v-html="training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                    training.trainingData.questionNumber
                  ]?.instruction">
                  </p>

                  <br/>
                  <p class="font-weight-bold" v-if="
                    training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                      training.trainingData.questionNumber
                    ]?.text
                  " v-html="'Q' + (training.trainingData.questionIndex + 1) +'. '+ training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                    training.trainingData.questionNumber
                  ]?.text">
                  </p>
                  <p v-else>Section {{ training.trainingData.questCategoryNumber + ":" +
                    training.trainingData.questionList[training.trainingData.questCategoryNumber]?.name }}</p>
                </div>
                <div class="" v-else>
                  <div class="alert alert-info">
                    Click on the <strong>"Next"</strong> button to proceed.
                  </div>
                </div>
              </div>
              <OptionPanel :type="training.trainingData.questionList[
                  training.trainingData.questCategoryNumber
                ]?.questions[
                  training.trainingData.questionNumber
                ]?.question_type" :questionOptions="training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                training.trainingData.questionNumber
              ]?.options
                " :question="training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                  training.trainingData.questionNumber
                ]" />

                <div class="col-md-12">
                   <!-- Display hints if there exist any -->
                   <br/>
                  <p style="font-size: 9pt;" v-if="
                    training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                      training.trainingData.questionNumber
                    ]?.hints && training.trainingData.questionList[
                      training.trainingData.questCategoryNumber
                    ]?.questions[
                      training.trainingData.questionNumber
                    ]?.question_type 
                  " v-html="training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[
                    training.trainingData.questionNumber
                  ]?.hints">
                  </p>
                  <div class="video_class" v-if="[4].includes(training.trainingData.questionIndex)">
                    <img :src="gifUrl" alt="Animated GIF" width="100%" height="auto" />
                  </div>
                </div>
            </div>
          </div>
          
        </div>
      </div>
      <TourComponent :steps="steps" />
    </div>
  </div>
</template>
<script setup>
import Swal from 'sweetalert2'
import { ref, toRefs, watch, onMounted } from 'vue'
import { useTrainingStore } from '../../stores/training'
import GraphView from '@/components/dashboard/GraphView.vue'
import TourComponent from "../../components/TourComponent.vue"
import OptionPanel from '../../components/training/OptionPanel.vue'
import HeaderCrumbs from '@/components/dashboard/HeaderCrumbs.vue'
import gifUrl from '@/assets/git1.gif';

const steps = ref([
  {
    target: '#category-desc',
    header: {
      title: 'Section description'
    },
    content: `This section provides background and context on the questions to be addressed.`,
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#filter-form',
    content: `Chart filters streamlines the process of customizing your charts.`,
    params: {
      placement: 'top',
      highlight: true
    }
  },

  {
    target: '#filter-button',
    content: `Click the button to apply changes based on the selected option.`,
    params: {
      placement: 'right',
      highlight: true
    }
  },
  {
    target: '.card-chart-bottom',
    header: {
      title: 'Chart View'
    },
    content: `This feature allows you to effortlessly display charts based on your selected filters.`,
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#topic-list',
    content:
      `Explore our Topic List to discover a wide array of question categories.`,
    params: {
      placement: 'top',
      highlight: true
    }
  },
  {
    target: '#question-frame',
    content:
      `The Question Frame displays the current question, instructions, and related options at a given moment.`,
    params: {
      placement: 'top',
      highlight: true
    }
  }
])

const props = defineProps({
  type: String,
})
const { type } = toRefs(props)

const width = ref(0)
const chart = ref({})
const currentPage = ref(1)
const chartCard = ref(null)
const form_input = ref(null)
const viewToggle = ref(false)
const training = useTrainingStore()
const noDataText = ref('No data available')

function handleScale() {
  viewToggle.value = !viewToggle.value
}

const getSelectedOptions = (questions) => {
  const selectedOptionsObject = {};

  for (const category of questions) {
    for (const question of category.questions) {
      for (const filterTool of question.filter_tools) {
        const { name, selected_option } = filterTool;
        if (selected_option != "") {
          selectedOptionsObject[name] = selected_option;
        }
      }
    }
  }
  return selectedOptionsObject;
}

const searchAndGetValue = (keyToSearch) => {
  const value = getSelectedOptions(training.trainingData.questionList)[keyToSearch];
  if (value !== undefined) {
    return value
  } else {
    return keyToSearch
  }
}

const switchSelectOption = (selected_option) => {
  const valueML = searchAndGetValue("ML");
  const valueDRT = searchAndGetValue("DRT");
  return (valueML === selected_option || valueDRT === selected_option) ? true : false
}

const updateOptions = (questionId, value) => {
  const question = training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions.find(q => q.id === questionId)
  const option_list = []
  question.options.forEach((item, index) => {
    const split_text = item.text.split(" ")
    option_list.push({ "location_id": index, "value": parseInt(split_text[1]) })
  })

  const foundItem = option_list.find(item => item.value === value?.total_rows);
  console.log(option_list)

  if (foundItem) {
    question.options[foundItem.location_id].is_correct = true
  }
  if (!option_list.map(item => item.value).includes(value?.total_rows)) {
    question.options[0].is_correct = true
    question.options[0].text = "A. " + value?.total_rows + " Record(s)"

  } else {
    // remove true from every other.
    question.options.forEach((item, index) => {
      if (index !== foundItem.location_id) {
        item.is_correct = false;
      }
    });
  }
};

async function postChart(val, allow = false) {
  if ((form_input.value[0].value && form_input.value[0].value != "") || allow) {
    let question = training.trainingData.questionList[training.trainingData.questCategoryNumber]?.questions[training.trainingData.questionNumber]
    let payload = {
      "type": question?.question_type,
      "question": parseInt(training.trainingData.questionIndex) + 1,
      "variable": form_input.value[0].value,
      "variables": getSelectedOptions(training.trainingData.questionList),
      "page": currentPage.value,
      "chart_width": width.value
    }
    await training.loadCharts(payload).then((res) => {
      chart.value = training.trainingDataChart

      if (question && question.id && training.trainingData.questionList[training.trainingData.questCategoryNumber]?.name == 'Data Filtering') {
        updateOptions(question.id, chart.value)
      }
    })
  } else {
    Swal.fire({
      title: 'Info',
      text: "Select from the list of options",
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }
}

watch(() => training.trainingData.questionIndex, (newValue, oldValue) => {
  // console.log(`Question Index changed from ${oldValue} to ${newValue}`);
  if (oldValue !== newValue) {
    chart.value = {}
  }
  
  if ([4, 5].includes(newValue)) {
    console.log("we are shoiwing question number here: " + newValue)
    // We are doing this so that we can load content by default
    form_input.value[0].value == "emt_molecular_weight"
    postChart({}, true)
    console.log(document.querySelectorAll('p p.show-for-question-5-and-6'))
    document.querySelectorAll('p p.show-for-question-5-and-6').forEach(element => {
        console.log(element.style.display)
        element.style.display = "block";
        console.log(element.style.display)
    });
    document.querySelectorAll('p p.show-for-question-6').forEach(element => {
        element.style.display = "block";
    });
    document.querySelectorAll('p p.show-for-question-3-4-and-5').forEach(element => {
        element.style.display = "none";
    });
    
  }
});

watch(() => currentPage.value, (newValue, oldValue) => {
  // console.log('currentPage changed from', oldValue, 'to', newValue);
  if (oldValue > newValue) {
    currentPage.value = 1
  }
  postChart({}, true)
});

onMounted(() => {
  if (chartCard.value) {
    width.value = chartCard.value.clientWidth;
  }
  
  window.addEventListener('resize', () => {
    if (chartCard.value) {
      width.value = chartCard.value.clientWidth;
    }
  });

  if ([4, 5].includes(training.trainingData.questionIndex)) {
    document.querySelectorAll('p p.show-for-question-5-and-6').forEach(element => {
        element.style.display = "block";
    });
    document.querySelectorAll('p p.show-for-question-6').forEach(element => {
        element.style.display = "block";
    });
    document.querySelectorAll('p p.show-for-question-3-4-and-5').forEach(element => {
        element.style.display = "none";
    });
    
  }
});

</script>
<style>
.correct-answer {
  color: green;
  /* Set the color for correct answers */
  font-weight: bold;
  /* Optionally, make correct answers bold */
}

.incorrect-answer {
  color: red;
  font-weight: bold;
}

.question-card .qs-main {
  overflow-y: auto;
  max-height: 530px !important;
}
</style>