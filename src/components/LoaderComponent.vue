<template>
    <div v-if="loading" class="loader-overlay">
      <div class="loader"></div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import globalFigs from "../config/constants"
  export default {
    data() {
      return {
        loading: false,
      };
    },
    mounted() {
      // Set up Axios interceptors
      this.setupInterceptors();
    },
    methods: {
      setupInterceptors() {
        // Request interceptor
        axios.interceptors.request.use(
          (config) => {
            this.loading = true;
            return config;
          },
          (error) => {
            this.loading = false;
            return Promise.reject(error);
          }
        );
  
        // Response interceptor
        axios.interceptors.response.use(
          (response) => {
            this.loading = false;
            return response;
          },
          (error) => {
            this.loading = false;
            if (error.response && error.response.status === 401) {
                setTimeout(() => {
                    window.location.href = '/login';
                    localStorage.removeItem(globalFigs.token);
                    localStorage.removeItem(globalFigs.user);
                }, 2000);
            }

            return Promise.reject(error);
          }
        );
      },
    },
  };
  </script>
  
  <style scoped>
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  