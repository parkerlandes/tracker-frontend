<template>
    <v-app>
      <CoachNav />
  
      <v-container class="mt-10">
        <h2 class="mb-6 text-center">All Exercises in System</h2>
  
        <v-progress-circular 
          v-if="loading" 
          indeterminate 
          color="primary" 
          size="48"
          class="d-flex mx-auto my-6" 
        />
  
        <div v-else>
          
          <v-alert v-if="exercises.length === 0" type="warning">
            No exercises found in the system.
          </v-alert>
  
          <v-row>
            <v-col
              v-for="exercise in exercises"
              :key="exercise.id_exercise"
              cols="12" sm="6" md="4"
            >
              <v-card class="pa-4 mb-4">
                <h3>{{ exercise.name }}</h3>
                <p class="text-medium-emphasis">{{ exercise.description }}</p>
                <p><strong>Reps:</strong> {{ exercise.reps }}</p>
                <p><strong>Sets:</strong> {{ exercise.sets }}</p>
                <p><strong>Lesson:</strong> {{ exercise.lesson_title }}</p>
              </v-card>
            </v-col>
          </v-row>
  
        </div>
      </v-container>
  
    </v-app>
  </template>
  
  
  <script setup>
  import { ref, onMounted } from "vue";
  import CoachNav from "../components/CoachNav.vue";
  import lessonServices from "../services/lessonServices.js";
  import exerciseServices from "../services/exerciseServices.js";
  
  const lessons = ref([]);
  const exercises = ref([]);
  const loading = ref(true);
  
  const loadAllExercises = async () => {
    try {
      const lessonsRes = await lessonServices.getLessons();
      lessons.value = lessonsRes.data;
  
      for (const lesson of lessons.value) {
        const exRes = await exerciseServices.getAll(lesson.id_lesson);
        exRes.data.forEach(ex => {
          exercises.value.push({
            ...ex,
            lesson_title: lesson.title
          });
        });
      }
  
    } catch (err) {
      console.error("Error loading exercises:", err);
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(loadAllExercises);
  </script>
  