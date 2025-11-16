<!-- src/views/ExerciseGoals.vue -->
<script>
import AthleteNav from "../components/AthleteNav.vue";
import Utils from "../config/utils.js";

  export default {
    name: "ExerciseGoals",
    components:{ AthleteNav},
  };
</script>

<template>
    <AthleteNav />

    <v-container class="pa-6">
      <h1>Exercise Goals</h1>
      <p>This page will let athletes and coaches add or edit goals.</p>
    </v-container>
  </template>
  

  
  <style scoped>
  /* Add styling here later */
  </style>
  