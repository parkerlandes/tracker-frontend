<template>
    <v-app>
      <v-container class="mt-10">
        <v-card v-if="exercise" class="pa-6" elevation="3">
          <h2>{{ exercise.title }}</h2>
          <p class="text-medium-emphasis mb-4">{{ exercise.description }}</p>
  
          <p><strong>Reps:</strong> {{ exercise.reps }}</p>
          <p><strong>Sets:</strong> {{ exercise.sets }}</p>
          <p><strong>Weight:</strong> {{ exercise.weight }}</p>
        </v-card>
  
        <v-alert v-else type="info" class="mt-6">
          Loading exercise details...
        </v-alert>
  
        <v-btn color="secondary" class="mt-6" @click="$router.back()">← Back to Lesson</v-btn>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import ExerciseDetails from "../services/exerciseDetailsServices";
  
  const route = useRoute();
  const exercise = ref(null);
  
  onMounted(async () => {
    try {
      const { id_lesson, id_exercise } = route.params;
      const res = await ExerciseDetails.get();
      exercise.value = res.data;
    } catch (err) {
      console.error("Error loading exercise:", err);
    }
  });
  </script>
  