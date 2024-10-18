<template>
  <div class="wrapp-center">
    <div class="app-model-card left-content feedback">
      <h4>Feedback</h4>

      <!-- Global validation error message -->
      <div v-if="validationError" class="alert alert-danger">{{ validationError }}</div>
      <!-- Form fields -->
      <form @submit.prevent="handleFeedback">
        <div class="row col-md-12 p-0 m-0">
          <div class="form-group col-md-6 p-1">
            <label for="gender">Gender *</label>
            <select v-model="gender" class="form-control" id="gender">
              <option value="">Select option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <div v-if="validationErrors['gender']" class="invalid-feedback">{{ validationErrors['gender'] }}</div>
          </div>
          <div class="form-group col-md-6 p-1">
            <label for="is_student">Are you a Student ? *</label>
            <select v-model="is_student" class="form-control" id="is_student">
              <option value="">Select option</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <div v-if="validationErrors['is_student']" class="invalid-feedback">{{ validationErrors['is_student'] }}</div>
          </div>
        </div>

        <div class="row col-md-12 p-0 m-0">
          <div class="form-group col-md-6 p-1">
            <label for="domain">Enter your domain of expertise (e.g. Structural Biology, Biochemistry, Biophysics, and others) * </label>
            
            <select v-model="domain" class="form-control" id="domain">
              <option value="">Select option</option>
              <option :value="option" v-for="option in membraneProteinFields" :key="option">{{option}}</option>
            </select>

            <div v-if="validationErrors['domain']" class="invalid-feedback">{{ validationErrors['domain'] }}</div>
          </div>
          <div class="form-group col-md-6 p-1">
            <label for="years_of_experience">How many years of experience do you have working with membrane proteins? *</label>
            <select v-model="years_of_experience" class="form-control" id="years_of_experience">
              <option value="">Select option</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="More than 10 years">More than 10 years</option>
            </select>
            <div v-if="validationErrors['years_of_experience']" class="invalid-feedback">{{ validationErrors['years_of_experience'] }}</div>
          </div>
        </div>

        <!-- Dynamic radio options -->
        <div class="form-group" v-for="question in feedbackStore?.feedback?.feedbackQuestion?.data" :key="question.id">
          <label>{{ question.question_text }} *</label>
          <div class="radio-list">
            <label class="radio radio-outline-primary" v-for="(option, index) in question.options" :key="index">
              <input type="radio" :name="'question'+question.id" :value="option.value" v-model="selectedOptions[question.id]"/>
              <span>{{ option.text }}</span>
              <span class="checkmark"></span>
            </label>
          </div>
          <div v-if="validationErrors[`question${question.id}`]" class="invalid-feedback">{{ validationErrors[`question${question.id}`] }}</div>
        </div>

        <div class="form-group">
          <label for="comment"> Please add a comment on how to enhance our user experience ? </label>
          <textarea class="form-control" rows="5" v-model="comment" id="comment" aria-label="With textarea"></textarea>
          <div v-if="validationErrors['comment']" class="invalid-feedback">{{ validationErrors['comment'] }}</div>
        </div>

        <div class="row col-md-12 p-0 m-0">
          <div class="form-group col-md-12 p-1">
            <label for="first_name">Please enter your name if you wish to be acknowledged or want to be involved in future projects </label>
            <input type="text" class="form-control" v-model="name" id="name" aria-label="name"/>
            <div v-if="validationErrors['name']" class="invalid-feedback">{{ validationErrors['name'] }}</div>
          </div>
        </div>

        <div class="form-group text-right">
          <button type="submit" class="btn btn-primary btn-large mt-3" style="color: white;" :disabled="isLoading">
            {{ isLoading ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useFeedbackStore } from '@/stores/feedback';
import { useTrainingStore } from '@/stores/training'
import { useRouter } from 'vue-router'
const training = useTrainingStore()
const router = useRouter()
import * as Yup from 'yup';
import Swal from 'sweetalert2'

const feedbackStore = useFeedbackStore();
const isLoading = ref(false);
const comment = ref('');
const name = ref('');
const gender = ref('');
const domain = ref('');
const is_student = ref('');
const years_of_experience = ref('');
const selectedOptions = ref({});
const validationError = ref(null);
const validationErrors = ref({});

const membraneProteinFields = [
  "Biochemistry",
  "Bioinformatics",
  "Biophysics",
  "Biotechnology",
  "Cell Biology",
  "Chemical Biology",
  "Computer Science",
  "Immunology",
  "Microbiology",
  "Molecular Biology",
  "Others",
  "Pharmacology",
  "Physiology",
  "Structural Biology"
];


const basicSchema = {
  name: Yup.string().trim(),
  gender: Yup.string().trim().required('Gender is required.'),
  is_student: Yup.string().trim().required('Are you a Student? is required.'),
  domain: Yup.string().trim().required('Domain of expertise is required.'),
  years_of_experience: Yup.string().trim().required('Years of experience is required.'),
  comment: Yup.string().trim(),
};

const validationSchema = ref(Yup.object().shape(basicSchema));

const updateValidationSchema = () => {
  const dynamicFields = feedbackStore.feedback.feedbackQuestion.data.reduce((schema, question) => {
    schema[`question${question.id}`] = Yup.string().required('This field is required.');
    return schema;
  }, {});

  validationSchema.value = Yup.object().shape({
    ...basicSchema,
    ...dynamicFields,
  });
};

// Watch feedbackStore to update the validation schema dynamically
watch(
  () => feedbackStore.feedback.feedbackQuestion.data,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      updateValidationSchema();
    }
  },
  { immediate: true }
);

const handleFeedback = async() => {
  validationErrors.value = {};
  validationError.value = '';

  await validationSchema.value.validate({
    name: (name.value && name.value != "") ? name.value : "No Name",
    gender: gender.value,
    is_student: is_student.value,
    domain: domain.value,
    years_of_experience: years_of_experience.value,
    comment: comment.value,
    ...(Object.keys(selectedOptions.value).reduce((acc, key) => {
      acc[`question${key}`] = selectedOptions.value[key] || '';
      return acc;
    }, {})),
  }, { abortEarly: false })
    .then(validatedData => {
      const formattedOptions = Object.entries(selectedOptions.value).map(([questionId, optionValue]) => {
      const question = feedbackStore.feedback.feedbackQuestion.data.find(q => q.id === parseInt(questionId))
      return {
        questionId: parseInt(questionId),
        questionText: question.question_text,
        option: { id: parseInt(questionId), value: optionValue }
      }
    })

      const feedbackData = {
        questionId: feedbackStore.feedback.feedbackQuestion[0]?.data?.id,
        responses: formattedOptions,
        comment: validatedData.comment,
        years_of_experience: validatedData.years_of_experience,
        domain: validatedData.domain,
        is_student: validatedData.is_student,
        gender: validatedData.gender,
        name: validatedData.name,
      }

      feedbackStore.submitFeedback(feedbackData).then((data) =>{
        console.log(data)
        Swal.fire({
          title: 'Success',
          text: 'Feedback submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        
        setTimeout(() => {
          training.updateTrainingStatus('done')
        }, 1000)
      
      });
      validationError.value = null;
    })
    .catch(error => {
      if (error.inner) {
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        validationErrors.value = errors;
        console.log('Validation errors:', errors);
      } else {
        validationError.value = error.message;
        console.error('Validation error:', error.message);
      }
    });
};

onMounted(() => {
  feedbackStore.loadFeedbackData()
})
</script>

<style scoped>
.invalid-feedback {
  color: red;
  display: block !important;
}
</style>