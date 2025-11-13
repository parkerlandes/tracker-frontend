<template>
    <v-app>
      <!-- ✅ Always show Coach Navigation -->
      <CoachNav />
  
      <v-container class="mt-10">
        <!-- Lesson Info -->
        <v-card v-if="lesson" class="pa-6 mb-8" elevation="3">
            <h1></h1>
          <h2>{{ lesson.title }}</h2>
          <p class="text-medium-emphasis mb-4">{{ lesson.description }}</p>
        </v-card>
  
        <!-- Add Exercise Form -->
        <v-card class="pa-6 mb-8" elevation="2">
          <h3 class="mb-4">Add New Exercise</h3>
          <v-text-field v-model="newExercise.name" label="Name" outlined dense></v-text-field>
          <v-textarea v-model="newExercise.description" label="Description" outlined dense auto-grow></v-textarea>
          <v-text-field v-model="newExercise.reps" label="Reps" type="number" outlined dense></v-text-field>
          <v-text-field v-model="newExercise.sets" label="Sets" type="number" outlined dense></v-text-field>
  
          <v-btn color="primary" class="mt-2" block @click="addExercise">Add Exercise</v-btn>
        </v-card>
  
        <!-- Existing Exercises -->
        <h3>Exercises</h3>
        <v-row v-if="exercises.length">
          <v-col
            v-for="exercise in exercises"
            :key="exercise.id_exercise"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="pa-4 mb-4" elevation="3">
              <h4>{{ exercise.name }}</h4>
              <p class="text-medium-emphasis">{{ exercise.description }}</p>
              <p><strong>Reps:</strong> {{ exercise.reps }}</p>
              <p><strong>Sets:</strong> {{ exercise.sets }}</p>
  
              <v-row class="mt-3">
                <v-col cols="6">
                  <v-btn color="primary" block @click="openEditDialog(exercise)">Edit</v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn color="error" block @click="openDeleteDialog(exercise)">Delete</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
  
        <v-alert v-else type="info" class="mt-6">No exercises found for this lesson.</v-alert>
  
        <!-- 🧩 Edit Dialog -->
        <v-dialog v-model="editDialog" max-width="500px">
          <v-card class="pa-6">
            <h3 class="mb-4">Edit Exercise</h3>
            <v-text-field v-model="editExercise.name" label="Name" outlined dense></v-text-field>
            <v-textarea v-model="editExercise.description" label="Description" outlined dense auto-grow></v-textarea>
            <v-text-field v-model="editExercise.reps" label="Reps" type="number" outlined dense></v-text-field>
            <v-text-field v-model="editExercise.sets" label="Sets" type="number" outlined dense></v-text-field>
  
            <v-row class="mt-3">
              <v-col cols="6">
                <v-btn color="grey" block @click="editDialog = false">Cancel</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="primary" block @click="saveEdit">Save</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
  
        <!-- 🗑️ Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="400px">
          <v-card class="pa-6 text-center">
            <v-icon color="error" size="48">mdi-alert-circle</v-icon>
            <h3 class="my-3">Delete Exercise</h3>
            <p>Are you sure you want to delete <strong>{{ deleteExerciseTarget?.name }}</strong>?</p>
  
            <v-row class="mt-4">
              <v-col cols="6">
                <v-btn color="grey" block @click="deleteDialog = false">Cancel</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="error" block @click="confirmDelete">Delete</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import axios from "axios";
  import Utils from "../config/utils.js";
  import CoachNav from "../components/CoachNav.vue"; // ✅ include navigation
  
  const route = useRoute();
  const lesson = ref(null);
  const exercises = ref([]);
  const newExercise = ref({ name: "", description: "", reps: "", sets: "" });
  const editExercise = ref({});
  const editDialog = ref(false);
  const deleteDialog = ref(false);
  const deleteExerciseTarget = ref(null);
  const API = "http://localhost:3100/tracker-t9";
  
  const loadLessonAndExercises = async () => {
    const id = route.params.id;
    const user = Utils.getStore("user");
    try {
      const lessonRes = await axios.get(`${API}/lessons/${id}`);
      lesson.value = lessonRes.data;
  
      const exercisesRes = await axios.get(`${API}/lesson/${id}/exercises`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      exercises.value = exercisesRes.data;
    } catch (err) {
      console.error("Error loading lesson or exercises:", err);
    }
  };
  
  onMounted(loadLessonAndExercises);
  
  const addExercise = async () => {
    const id = route.params.id;
    const user = Utils.getStore("user");
    try {
      await axios.post(`${API}/lesson/${id}/exercises`, newExercise.value, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      newExercise.value = { name: "", description: "", reps: "", sets: "" };
      await loadLessonAndExercises();
    } catch (err) {
      console.error("Error adding exercise:", err);
    }
  };
  
  const openEditDialog = (exercise) => {
    editExercise.value = { ...exercise };
    editDialog.value = true;
  };
  
  const saveEdit = async () => {
    const user = Utils.getStore("user");
    try {
      await axios.put(
        `${API}/lesson/${editExercise.value.id_lesson}/exercises/${editExercise.value.id_exercise}`,
        editExercise.value,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      editDialog.value = false;
      await loadLessonAndExercises();
    } catch (err) {
      console.error("Error saving exercise:", err);
    }
  };
  
  const openDeleteDialog = (exercise) => {
    deleteExerciseTarget.value = exercise;
    deleteDialog.value = true;
  };
  
  const confirmDelete = async () => {
    const exercise = deleteExerciseTarget.value;
    const user = Utils.getStore("user");
  
    try {
      await axios.delete(
        `${API}/lesson/${exercise.id_lesson}/exercises/${exercise.id_exercise}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      deleteDialog.value = false;
      await loadLessonAndExercises();
    } catch (err) {
      console.error("Error deleting exercise:", err);
    }
  };
  </script>
  
  <style scoped>
  .mb-8 {
    margin-bottom: 2rem;
  }
  .mb-4 {
    margin-bottom: 1.25rem;
  }
  </style>
  