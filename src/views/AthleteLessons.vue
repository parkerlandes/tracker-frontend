<template>
  <v-app>
    <AthleteNav />

  <v-container class="pa-8 mt-10">
      <h2 class="mb-6 text-center">Workouts</h2>

      <!-- Loading Spinner -->
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="48"
        class="d-flex mx-auto my-6"
      />

      <!-- Expandable Lessons -->
      <v-expansion-panels v-else v-model="expandedPanels" multiple>
        <v-expansion-panel
          v-for="lesson in lessons"
          :key="lesson.id_lesson"
          @group:selected="loadLessonAndExercises(lesson.id_lesson)"
        >
          <v-expansion-panel-title>
            <v-row no-gutters align="center" justify="space-between" class="w-100">
              <v-col cols="8" class="d-flex align-center">
                <v-avatar color="secondary" class="mr-3">
                  <v-icon color="white">mdi-clipboard-text</v-icon>
                </v-avatar>
                <div>
                  <strong>{{ lesson.title }}</strong>
                  <div class="text-caption text-medium-emphasis">
                    {{ lesson.description || "No description" }}
                  </div>
                </div>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-chip
                  class="ma-1"
                  color="secondary"
                  variant="outlined"
                  v-if="lesson.difficulty"
                >
                  {{ lesson.difficulty }}
                </v-chip>
                <v-chip class="ma-1" variant="outlined" color="primary">
                  {{ exercises[lesson.id_lesson]?.length || 0 }} exercises
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-list v-if="exercises[lesson.id_lesson]?.length">
              <v-list-item
                v-for="exercise in exercises[lesson.id_lesson]"
                :key="exercise.id_exercise"
                class="mb-2"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <strong>{{ exercise.name }}</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ exercise.description }}
                  </v-list-item-subtitle>
                  <p class="text-medium-emphasis mb-1">
                    Reps: {{ exercise.reps }} | Sets: {{ exercise.sets }}
                  </p>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    :color="exercise.completed ? 'success' : 'primary'"
                    @click="toggleCompleted(lesson.id_lesson, exercise.id_exercise)"
                  >
                    {{ exercise.completed ? 'Completed' : 'Complete' }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-alert v-else type="info" class="mt-2">
              No exercises found for this lesson.
            </v-alert>

            <div class="d-flex justify-end mt-2">
              <v-btn
                size="small"
                variant="text"
                color="primary"
                @click="openWorkout(lesson.id_lesson)"
              >
                Open workout
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AthleteNav from "../components/AthleteNav.vue";
import lessonServices from "../services/lessonServices.js";
import exerciseServices from "../services/exerciseServices.js";
import Utils from "../config/utils.js";

const lessons = ref([]);
const exercises = ref({});
const loading = ref(true);
const error = ref("");
const expandedPanels = ref([]);
const router = useRouter();

const user = Utils.getStore("user");

// Load all lessons assigned to the athlete
onMounted(async () => {
  if (!user?.id_user) {
    error.value = "Please sign in again to view workouts.";
    loading.value = false;
    return;
  }
  try {
    const res = await lessonServices.getLessonsForUser(user.id_user);
    lessons.value = (res.data || []).map((entry) => entry.lesson || entry);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    error.value = "Failed to load workouts.";
  } finally {
    loading.value = false;
  }
});

// Load exercises when expanding a lesson
const loadLessonAndExercises = async (id) => {
  if (exercises.value[id]) return; // Skip if already loaded

  try {
    const exercisesRes = await exerciseServices.getAll(id);
    exercises.value[id] = exercisesRes.data.map((ex) => ({
      ...ex,
      completed: false, // Add completed flag
    }));
  } catch (err) {
    console.error(`Error loading exercises for lesson ${id}:`, err);
    exercises.value[id] = [];
  }
};

// Toggle completion state
const toggleCompleted = (lessonId, exerciseId) => {
  const exList = exercises.value[lessonId];
  if (!exList) return;

  const exercise = exList.find((e) => e.id_exercise === exerciseId);
  if (exercise) exercise.completed = !exercise.completed;
};

const openWorkout = (id) => {
  Utils.navigate(router, `/athlete/workout/${id}`);
};
</script>

<style scoped>
.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}
</style>
