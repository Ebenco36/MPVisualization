<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getKeyList } from "../../utils/helpers"
import user_placeholder from '@/assets/image/user_placeholder.jpeg'


const router = useRouter()
const authData = useAuthStore()
const user = authData.auth.user

const headers = ref([])
const transformedData = ref([])

function removeUnderscoreAndCapitalize(str = "") {
  // Split the string into words using underscores as separators
  const words = str.split("_");
  // Capitalize each word and join them back together
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  // Join the capitalized words with spaces to form the final result
  const result = capitalizedWords.join(" ");
  return result;
}


function transformData() {
    transformedData.value = user.user_responses.map(item => {
        const question = item.question || {};
        const options = question.options || [];
        const answerId = item.answer_id;

        // Find the answer_text based on answer_id in the options
        const answerOption = options.find(opt => opt.id === answerId);
        const answerText = answerOption ? answerOption.text : null;

        return {
            session_id: item.session_id,
            question_text: question.text,
            answer_text: answerText,
            is_correct: item.is_correct ? "Correct" : "Invalid",
        };
      });
    }

onMounted(() => {
    authData.loadUser()
    transformData()
    const outputArray = getKeyList(transformedData.value).map(item => {
        return { title: removeUnderscoreAndCapitalize(item), value: item };
    });
    headers.value = outputArray
})

</script>

<template>
  <div class="main-content">
    <div class="breadcrumb">
        <h1>User Profile</h1>
        <ul>
            <li><a href="">Pages</a></li>
            <li>User Profile</li>
        </ul>
    </div>
    <div class="separator-breadcrumb border-top"></div>
    <div class="card user-profile o-hidden mb-4">
        <div class="header-cover" style="background-image: url('./src/assets/image/newLogo.webp')"></div>
        <div class="user-info"><img class="profile-picture avatar-lg mb-2" :src="user_placeholder" alt="" />
            <p class="m-0 text-24">{{ user.name }}</p>
            <p class="text-muted m-0">{{ user.is_admin ? "Admin" : "User" }}</p>
        </div>
        <div class="card-body">
            <div class="content" id="">
                <div class="" id="about" role="">
                    <h4>Personal Information</h4>
                    <p>
                        Simple Bio
                    </p>
                    <hr />
                    <div class="row">
                        <div class="col-md-4 col-6">
                            <div class="mb-4">
                                <p class="text-primary mb-1"><i class="i-Calendar text-16 mr-1"></i> Username</p><span>{{ user.username }}</span>
                            </div>
                            <div class="mb-4">
                                <p class="text-primary mb-1"><i class="i-Globe text-16 mr-1"></i> Location</p><span>{{ user.location ? user.location : "NILL" }}</span>
                            </div>
                        </div>
                        <div class="col-md-4 col-6">
                            <div class="mb-4">
                                <p class="text-primary mb-1"><i class="i-MaleFemale text-16 mr-1"></i> Email</p><span>{{ user.email }}</span>
                            </div>
                            <div class="mb-4">
                                <p class="text-primary mb-1"><i class="i-Cloud-Weather text-16 mr-1"></i> Tour?</p><span>{{ user.has_taken_tour ? "Yes" : "No" }}</span>
                            </div>
                        </div>
                        <div class="col-md-4 col-6">
                            <div class="mb-4">
                                <p class="text-primary mb-1"><i class="i-Face-Style-4 text-16 mr-1"></i> Phone</p><span>{{ user.phone ? user.phone : "NILL" }}</span>
                            </div>
                            <div class="mb-4">
                                <p class="text-primary mb-1"><i class="i-Home1 text-16 mr-1"></i> Institute</p><span>{{ user.institute ? user.institute : "NILL" }}</span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <h4>Training </h4>
                    <p class="mb-4"> Training taken so far!</p>
                    <div class="row">
                        <v-data-table
                            :headers="headers"
                            :items="transformedData"
                        ></v-data-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>