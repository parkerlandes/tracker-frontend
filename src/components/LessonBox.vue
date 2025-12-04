<template>
  <v-card class="pa-4" elevation="3">
    <div class="d-flex align-center justify-space-between mb-3">
      <h3 class="text-h6 mb-0">Workouts</h3>
      <v-btn size="small" variant="text" color="primary" @click="goToLessons">
        View all
      </v-btn>
    </div>

    <div v-if="loading" class="text-medium-emphasis">Loading workouts…</div>
    <div v-else-if="error" class="text-error">{{ error }}</div>
    <div v-else-if="!lessons.length" class="text-medium-emphasis">No workouts assigned yet.</div>

    <v-expansion-panels v-else v-model="openPanels" multiple>
      <v-expansion-panel
        v-for="lesson in limitedLessons"
        :key="lesson.id_lesson"
        @group:selected="loadExercises(lesson.id_lesson)"
      >
        <v-expansion-panel-title>
          <v-avatar color="secondary" class="mr-3">
            <v-icon color="white">mdi-clipboard-text</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="font-weight-medium">{{ lesson.title }}</div>
            <div class="text-medium-emphasis text-caption">
              {{ lesson.description || "No description" }}
            </div>
          </div>
          <v-chip class="ma-1" variant="outlined" color="primary">
            {{ exercises[lesson.id_lesson]?.length || 0 }} exercises
          </v-chip>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list v-if="exercises[lesson.id_lesson]?.length" density="compact">
            <v-list-item
              v-for="exercise in exercises[lesson.id_lesson]"
              :key="exercise.id_exercise"
              class="rounded"
            >
              <v-list-item-title>{{ exercise.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ exercise.reps }} reps · {{ exercise.sets }} sets
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-alert v-else type="info" variant="tonal" class="mb-2">
            No exercises found for this workout.
          </v-alert>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>


<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import lessonServices from "../services/lessonServices";
import exerciseServices from "../services/exerciseServices";
import Utils from "../config/utils";

const props = defineProps({
  athleteId: {
    type: Number,
    required: true,
  },
});

const router = useRouter();

const lessons = ref([]);
const exercises = ref({});
const loading = ref(false);
const error = ref(null);
const openPanels = ref([]);

const limitedLessons = computed(() => lessons.value.slice(0, 3));

const fetchLessons = async () => {
  if (!props.athleteId) {
    error.value = "No athlete found.";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const { data } = await lessonServices.getLessonsForUser(props.athleteId);
    // API may return { lesson } objects or lessons directly
    lessons.value = (data || []).map((entry) => entry.lesson || entry);
  } catch (err) {
    console.error(err);
    error.value = "Failed to load workouts.";
  } finally {
    loading.value = false;
  }
};

const loadExercises = async (id) => {
  if (exercises.value[id]) return;
  try {
    const { data } = await exerciseServices.getAll(id);
    exercises.value[id] = data || [];
  } catch (err) {
    console.error(`Failed to load exercises for lesson ${id}`, err);
    exercises.value[id] = [];
  }
};

const goToLessons = () => {
  Utils.navigate(router, "/athlete/workouts");
};

const openLesson = (id) => {
  Utils.navigate(router, `/athlete/workout/${id}`);
};

onMounted(fetchLessons);
</script>
