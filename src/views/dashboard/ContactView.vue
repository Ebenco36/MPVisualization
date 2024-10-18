<template>
  <div class="main-content">
    <h1 class="mb-4">Contact Us</h1>
    <div class="card">
      <div class="card-body">
        <div class="row">
          
          <div class="col-md-12">
            <p class="text" style="font-size: 13pt;">
              Thank you for your interest in MetaMP! We are committed to providing you with the best tools and 
              resources for curating and analyzing membrane protein structures. 
              Whether you have a question, need support, or have feedback to share, we are here to support you.
            </p>
          </div>
          <div class="col-md-6">
            
            <div id="map" style="height: 500px;"></div>
          </div>
          <div class="col-md-6">
            <h2 class="mb-5 mt-3">Let's connect</h2>

            <!--Error message from backend is here.-->
            <div class="form-group" v-if="contactStore.contact.error" :serv={True}>
              <ErrorMessage :errorMessage="contactStore.contact.error" />
            </div>
            <div class="alert alert-success" v-if="contactStore.contact.message">
              <small class="text-success">{{ contactStore.contact.message }}</small>
            </div>

            <form action="" @submit.prevent="handleContact">
              <div class="form-group mb-2">
                <label for="">Fullname</label>
                <input type="text" class="form-control" name="name" v-bind="name"/>
                <ErrorMessage v-if="errors.name" :errorMessage="errors.name" />
              </div>
              <div class="form-group mb-2">
                <label for="">Email</label>
                <input type="text" class="form-control" name="email" v-bind="email"/>
                <ErrorMessage v-if="errors.email" :errorMessage="errors.email" />
              </div>
              <div class="form-group mb-2">
                <label for="">Institute</label>
                <input type="text" class="form-control" name="company" v-bind="company"/>
                <ErrorMessage v-if="errors.company" :errorMessage="errors.company" />
              </div>
              <div class="form-group mb-2">
                <label for="">Message</label>
                <textarea class="form-control" rows="5" name="name" v-bind="message"></textarea>
                <ErrorMessage v-if="errors.message" :errorMessage="errors.message" />
              </div>
              <div class="form-group text-right">
                <AppButton
                  label="Submit"
                  class="btn btn-primary"
                  style="color:white;"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as yup from 'yup'
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate'
import { useContactStore } from '@/stores/contact'
import AppButton from '../../components/common/AppButton.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import LControlGeocoder from 'leaflet-control-geocoder';

// Welcome to my world of greatness and great achievment. 
const contactStore = useContactStore()

const map = ref(null);

const initializeMap = (lat, lng) => {
  map.value = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);

  L.marker([lat, lng]).addTo(map.value)
    // .bindPopup('Robert-Koch-Institute: Center for Artificial Intelligence in Public Health Research, Ludwig-Witthöft-Straße 14, 15745 Wildau')
    // .openPopup();
};

const geocodeLocation = async (locationName) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`);
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      initializeMap(lat, lon);
    } else {
      console.error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }
};

/* Effects */
const { errors, handleSubmit, defineInputBinds, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email is required'),
    company: yup.string().required('Institution is required'),
    message: yup.string().min(50, 'Too short').required('Message is required.')
  })
})

const name = defineInputBinds('name')
const email = defineInputBinds('email')
const company = defineInputBinds('company')
const message = defineInputBinds('message')

const handleContact = handleSubmit((vals) => {
  contactStore.submitContact(vals).then(() => {
    resetForm()
  });
})

onMounted(() => {
  geocodeLocation('Ludwig-Witthöft-Straße 14, 15745 Wildau'); // Replace with your desired location
});
</script>
<style lang=""></style>