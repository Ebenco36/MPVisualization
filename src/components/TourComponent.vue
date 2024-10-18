<template>
    <div>
      <v-tour 
        name="myTour" 
        :steps="steps" 
        :option="myOptions" 
        :callbacks="tourCallbacks"
      >
      </v-tour>
    </div>
  </template>
  <script>
  import { useAuthStore } from '../stores/auth';
  export default {
    name: "my-tour",
    props: {
      isVisible: {
        type: Boolean,
        required: false,
        default: true,
      },
      steps: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        tourCallbacks: {
          onFinish: this.handleFinish,
          onSkip: this.handleSkip
        },
        myOptions: {
          highlight: true,
          debug: true,
          useKeyboardNavigation: true,
          labels: {
            buttonSkip: "Skip tour",
            buttonPrevious: "Previous",
            buttonNext: "Next",
            buttonStop: "Finish",
          },
        },
      };
    },
    mounted: function () {
      if (this.isVisible) {
        this.$tours.myTour.start();
        
      }
    },
    methods: {
      updateUserProfile(){
        // implement logic to update user profile
        const data = {
          "has_taken_tour": true
        }
        
        let authData = useAuthStore();
        let current_user = authData?.auth?.user?.id
        authData.updateUser(current_user, data)
      },
      handleSkip() {
        // implement logic
        this.updateUserProfile()
      },
      handleFinish() {
        // implement logic
        this.updateUserProfile()
      }
    },
  };
  </script>
  