<script setup>
  import SocialLogin from '../components/SocialLogin.vue';
</script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  .blur-card {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }
  </style>
  
  
  
<template>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="pa-8 text-center blur-card" elevation="8" max-width="400">
        <v-icon color="primary" size="48">mdi-dumbbell</v-icon>
        <h2 class="mt-4 mb-2">Welcome to Exercise Tracker</h2>
        <p class="mb-6 text-medium-emphasis">
          Log in or create an account to get started with your personalized fitness tracking.
        </p>
        <SocialLogin />
      </v-card>
    </v-container>
  </template>
  
  