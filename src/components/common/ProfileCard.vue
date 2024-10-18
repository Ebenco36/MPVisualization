<template>
    <div class="card profile-card mb-5">
      <div class="prof-card-header">
        <div class="img-wrapper">
          <img :src="profile?.img" alt="avatar" />
        </div>
      </div>
      <div class="card-body">
        <h5>{{ profile?.name }}</h5>
        <p>{{ profile?.position }} </p> 
        <p><b>{{ profile?.institution }}</b></p>
        <p>{{ profile?.email }}</p>
      </div>
    </div>
  </template>
  <script setup>
  defineProps({
    profile: Object
  })
  </script>