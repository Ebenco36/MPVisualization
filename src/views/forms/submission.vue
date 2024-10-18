<template>
    <section class="main-content">
        <div class="breadcrumb">
            <h1>Submission</h1>
            <ul>
                <li><a href="">MetaMP</a></li>
                <li>Submission</li>
            </ul>
        </div>
        <div class="separator-breadcrumb border-top"></div>
        <div class="row">
            <div class="card protein-form">
                <h2>Request Submission Form</h2>
                <form @submit.prevent="submitForm" class="form">
                    <!-- Name -->
                    <div class="row p-0 m-0">
                        <div class="col-md-12 font-weight-bold">
                            <p>
                                To help us keep these resources up to date, please send any missing information to: awotoroe@rki.de or hattabg@rki.de

                                <span> <strong>OR </strong> fill the form below.</span>
                            </p>
                        </div>
                        <div class="col-md-6 form-group">
                            <label for="name">Name:</label>
                            <input type="text" id="name" v-model="form.name"
                                :class="{ 'is-invalid': errors.name, 'form-control': true }" />
                            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
                        </div>

                        <!-- Contact Email -->
                        <div class="form-group col-md-6">
                            <label for="email">Contact Email:</label>
                            <input type="email" id="email" v-model="form.email"
                                :class="{ 'is-invalid': errors.email, 'form-control': true }" />
                            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                        </div>

                        <!-- Institution -->
                        <div class="form-group col-md-6">
                            <label for="institution">Institution:</label>
                            <input type="text" id="institution" v-model="form.institution"
                                :class="{ 'is-invalid': errors.institution, 'form-control': true }" />
                            <div v-if="errors.institution" class="error-message">{{ errors.institution }}</div>
                        </div>

                        <!-- Request Type -->
                        <div class="form-group col-md-6">
                            <label for="request_type">Request Type:</label>
                            <select id="request_type" v-model="form.request_type"
                                :class="{ 'is-invalid': errors.request_type, 'form-control': true }">
                                <option disabled value="">Select a request type</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Provide Expert Feedback">Provide Expert Feedback</option>
                            </select>
                            <div v-if="errors.request_type" class="error-message">{{ errors.request_type }}</div>
                        </div>

                        <!-- Protein Code or Name -->
                        <div class="form-group col-md-12">
                            <label for="protein_code_or_name">Protein Code or Name:</label>
                            <input type="text" id="protein_code_or_name" v-model="form.protein_code_or_name"
                                :class="{ 'is-invalid': errors.protein_code_or_name, 'form-control': true }" />
                            <div v-if="errors.protein_code_or_name" class="error-message">
                                {{ errors.protein_code_or_name }}
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="form-group col-md-12">
                            <label for="description">Description:</label>
                            <QuillEditor v-model="form.description" :options="editorOptions"
                                v-model:content="form.description" content-type="html" />
                            <div v-if="errors.description" class="error-message">
                                {{ errors.description }}
                            </div>
                        </div>
                    </div>
                    <div class="form-group col-md-12 mt-15 pt-10">
                        <button type="submit" class="btn btn-primary submit-button" style="color:white;">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as Yup from 'yup';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Swal from 'sweetalert2'
import { useSubmissionStore } from '@/stores/submission';
import { useRouter } from 'vue-router'

const router = useRouter()

const submissionStore = useSubmissionStore();
// Form state
const form = ref({
    name: '',
    email: '',
    institution: '',
    request_type: '',
    protein_code_or_name: '',
    description: '',
});
const reason = ref(null)
const editorOptions = {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
        ],
    },
    placeholder: 'Compose your text...',
    readOnly: false,
};

// Validation errors state
const errors = ref({});

// Yup validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Contact email is required'),
    institution: Yup.string().required('Institution is required'),
    request_type: Yup.string().required('Request type is required'),
    protein_code_or_name: Yup.string().required('Protein code or name is required'),
    description: Yup.string().required('Description is required'),
});

// Form submission handler
const submitForm = async () => {
    try {
        errors.value = {}; // Clear errors before validation

        await validationSchema.validate(form.value, { abortEarly: false });
        form.value.submitted = true;
        let payload = {
            "name": form.value.name, 
            "email": form.value.email,
            "institution": form.value.institution, 
            "request_type": form.value.request_type,
            "protein_code_or_name": form.value.protein_code_or_name, 
            "description": form.value.description
        }
        await submissionStore.submitSubmission(payload).then(() =>{
            
            Swal.fire({
                title: 'Success',
                text: 'Successfully submitted request.',
                icon: 'success',
                confirmButtonText: 'OK'
            })

            // Optionally reset form after submission
            form.value.name = '';
            form.value.email = '';
            form.value.institution = '';
            form.value.request_type = '';
            form.value.protein_code_or_name = '';
            form.value.description = '';
            
        })
        

    } catch (validationErrors) {
        validationErrors.inner.forEach((error) => {
            errors.value[error.path] = error.message;
        });
    }
};


onMounted(() => {
    reason.value = router.currentRoute.value.params?.reason;
    if (reason.value != "" && reason.value == "expert_feedback") {
        form.value.request_type = "Provide Expert Feedback"
    } else if (reason.value != "" && reason.value == "feature_request") {
        form.value.request_type = "Feature Request"
    }
})
</script>

<style scoped>
.protein-form {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-group {
    margin-bottom: 20px;
    /* Add margin between form groups */
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input,
textarea,
select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.is-invalid {
    border-color: red;
}

.error-message {
    color: red;
    font-size: 0.875em;
}

.QuillEditor {
    height: 200px;
    /* Adjust the height of the editor */
    margin-bottom: 20px;
    /* Add margin to prevent overlapping */
}

button[type="submit"] {
    margin-top: 20px;
}

.submitted-data {
    margin-top: 20px;
    padding: 15px;
    background-color: #f4f4f4;
    border-radius: 5px;
}

.submitted-data h3 {
    margin-bottom: 10px;
}
</style>