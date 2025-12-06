<template>
  <v-app>
    <CoachNav />

    <h1 class="text-h5 font-weight-bold mb-6"></h1>
    <h1 class="text-h5 font-weight-bold mb-6"></h1>
    <h1 class="text-h5 font-weight-bold mb-6"></h1>

    <!-- LESSON INFO -->
    <v-container v-if="lesson" class="pa-6 mb-8" elevation="3">
      <div class="d-flex justify-space-between align-center mb-6">
        <!-- LEFT SIDE: TITLE + DESCRIPTION STACKED -->
        <div>
          <h2 class="mb-1">{{ lesson.title }}</h2>
          <p class="text-medium-emphasis mb-0">{{ lesson.description }}</p>
        </div>

        <!-- RIGHT SIDE: BUTTON -->
        <v-btn color="primary" @click="showAddDialog = true">
          <v-icon left>mdi-plus-box</v-icon>
          Add New Exercise
        </v-btn>
      </div>

      <!-- ADD EXERCISE BUTTON -->

      <!-- EXERCISES GRID -->
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
            <p>{{ exercise.description }}</p>
            <p><strong>Reps:</strong> {{ exercise.reps }}</p>
            <p><strong>Sets:</strong> {{ exercise.sets }}</p>

            <v-row class="mt-3">
              <v-col cols="6">
                <v-btn color="grey" block @click="openEditDialog(exercise)"
                  >Edit</v-btn
                >
              </v-col>
              <v-col cols="6">
                <v-btn color="error" block @click="openDeleteDialog(exercise)"
                  >Delete</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-else type="info" class="mt-6">
        No exercises found for this lesson.
      </v-alert>

      <!-- ADD EXERCISE DIALOG -->
      <v-dialog v-model="showAddDialog" max-width="500">
        <v-card class="pa-6">
          <h3 class="mb-4">Add New Exercise</h3>
          <v-text-field
            v-model="newExercise.name"
            label="Name"
            outlined
            dense
          />
          <v-textarea
            v-model="newExercise.description"
            label="Description"
            outlined
            dense
            auto-grow
          />
          <v-text-field
            v-model="newExercise.reps"
            label="Reps"
            type="number"
            outlined
            dense
          />
          <v-text-field
            v-model="newExercise.sets"
            label="Sets"
            type="number"
            outlined
            dense
          />

          <v-row class="mt-4">
            <v-col cols="6">
              <v-btn block color="grey" @click="showAddDialog = false"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn block color="primary" @click="addExercise">Save</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- EDIT DIALOG -->
      <v-dialog v-model="editDialog" max-width="500">
        <v-card class="pa-6">
          <h3 class="mb-4">Edit Exercise</h3>
          <v-text-field
            v-model="editExercise.name"
            label="Name"
            outlined
            dense
          />
          <v-textarea
            v-model="editExercise.description"
            label="Description"
            outlined
            dense
            auto-grow
          />
          <v-text-field
            v-model="editExercise.reps"
            label="Reps"
            type="number"
            outlined
            dense
          />
          <v-text-field
            v-model="editExercise.sets"
            label="Sets"
            type="number"
            outlined
            dense
          />

          <v-row class="mt-4">
            <v-col cols="6">
              <v-btn block color="grey" @click="editDialog = false"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn block color="primary" @click="saveEdit">Save</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- DELETE DIALOG -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card class="pa-6 text-center">
          <v-icon color="error" size="48">mdi-alert-circle</v-icon>
          <h3 class="my-3">Delete Exercise</h3>
          <p>
            Are you sure you want to delete
            <strong>{{ deleteExerciseTarget?.name }}</strong
            >?
          </p>

          <v-row class="mt-4">
            <v-col cols="6">
              <v-btn block color="grey" @click="deleteDialog = false"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn block color="error" @click="confirmDelete">Delete</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-container>
    <v-btn class="ma-4" variant="text" color="primary" @click="goBack">
      <v-icon left>mdi-arrow-left</v-icon>
      Back to Plans
    </v-btn>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import lessonServices from "../services/lessonServices.js";
import exerciseServices from "../services/exerciseServices.js";
import CoachNav from "../components/CoachNav.vue";

const route = useRoute();
const lesson = ref(null);
const exercises = ref([]);
const newExercise = ref({ name: "", description: "", reps: "", sets: "" });
const editExercise = ref({});
const showAddDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const deleteExerciseTarget = ref(null);

const loadLessonAndExercises = async () => {
  const id_lesson = route.params.id_lesson;

  try {
    const [lessonRes, exercisesRes] = await Promise.all([
      lessonServices.getLesson(id_lesson),
      exerciseServices.getAll(id_lesson),
    ]);

    lesson.value = lessonRes.data;
    exercises.value = exercisesRes.data;
  } catch (err) {
    console.error("Error loading lesson or exercises:", err);
  }
};

// ADD
const addExercise = async () => {
  const id_lesson = route.params.id_lesson;

  console.log("Adding exercise to lesson:", id_lesson);

  try {
    await exerciseServices.addExercise(id_lesson, {
      ...newExercise.value,
      id_lesson,
    });

    showAddDialog.value = false;
    newExercise.value = { name: "", description: "", reps: "", sets: "" };
    await loadLessonAndExercises();
  } catch (err) {
    console.error("Error adding exercise:", err);
  }
};

// EDIT
const openEditDialog = (exercise) => {
  editExercise.value = { ...exercise };
  editDialog.value = true;
};

const saveEdit = async () => {
  try {
    await exerciseServices.updateExercise(
      editExercise.value.id_lesson,
      editExercise.value.id_exercise,
      { ...editExercise.value }
    );
    editDialog.value = false;
    await loadLessonAndExercises();
  } catch (err) {
    console.error("Error saving exercise:", err);
  }
};

// DELETE
const openDeleteDialog = (exercise) => {
  deleteExerciseTarget.value = exercise;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  const e = deleteExerciseTarget.value;
  try {
    await exerciseServices.deleteExercise(e.id_lesson, e.id_exercise);
    deleteDialog.value = false;
    await loadLessonAndExercises();
  } catch (err) {
    console.error("Error deleting exercise:", err);
  }
};

const goBack = () => {
  window.location.href = "http://localhost:8081/coach/plans";
};


onMounted(loadLessonAndExercises);
</script>

<style scoped>
.mt-10 {
  margin-top: 2.5rem;
}
</style>
