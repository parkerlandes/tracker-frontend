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
              <v-col cols="8">
                <strong>{{ lesson.title }}</strong>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-chip color="secondary" label v-if="lesson.difficulty">
                  {{ lesson.difficulty }}
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <p class="mb-4 text-medium-emphasis">{{ lesson.description }}</p>

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
import AthleteNav from "../components/AthleteNav.vue";
import lessonServices from "../services/lessonServices.js";
import exerciseServices from "../services/exerciseServices.js";

const lessons = ref([]);
const exercises = ref({});
const loading = ref(true);
const error = ref("");
const expandedPanels = ref([]);

// Load all lessons
onMounted(async () => {
  try {
    const res = await lessonServices.getLessons();
    lessons.value = res.data;
  } catch (err) {
    console.error("Error fetching lessons:", err);
    error.value = "Failed to load lessons.";
  } finally {
    loading.value = false;
  }
});

// Load exercises when expanding a lesson
const loadLessonAndExercises = async (id) => {
  if (exercises.value[id]) return; // Skip if already loaded

  try {
    const [lessonRes, exercisesRes] = await Promise.all([
      lessonServices.getLesson(id),
      exerciseServices.getAll(id),
    ]);
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
</script>

<style scoped>
.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}
</style>
