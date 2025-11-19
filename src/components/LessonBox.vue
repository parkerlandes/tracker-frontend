<template>
  <v-card class="pa-4" elevation="3">
    <div class="d-flex align-center justify-space-between mb-3">
      <h3 class="text-h6 mb-0">Pinned Lessons</h3>
      <v-btn size="small" variant="text" color="primary" @click="goToLessons">
        Browse
      </v-btn>
    </div>

    <div v-if="loading" class="text-medium-emphasis">Loading lessons…</div>
    <div v-else-if="error" class="text-error">{{ error }}</div>
    <div v-else-if="!lessons.length" class="text-medium-emphasis">No lessons yet.</div>

    <v-list v-else density="compact">
      <v-list-item v-for="lesson in limitedLessons" :key="lesson.id_lesson" class="rounded mb-2" @click="openLesson(lesson.id_lesson)" role="button">
        <v-list-item-avatar color="secondary">
          <v-icon>mdi-clipboard-text</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>{{ lesson.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ lesson.description }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-btn block size="small" color="primary" class="mt-2" variant="outlined" @click="goToLessons">
      Add lesson
    </v-btn>
  </v-card>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import lessonServices from "../services/lessonServices";

const props = defineProps({
  athleteId: {
    type: Number,
    required: true,
  },
});

const router = useRouter();

const lessons = ref([]);
const loading = ref(false);
const error = ref(null);

const limitedLessons = computed(() => lessons.value.slice(0, 3));

const fetchLessons = async () => {
  if (!props.athleteId) {
    error.value = "No athlete found.";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const { data } = await lessonServices.getLessons();
    lessons.value = data || [];
  } catch (err) {
    console.error(err);
    error.value = "Failed to load lessons.";
  } finally {
    loading.value = false;
  }
};

const goToLessons = () => {
  router.push("/catalog");
};

const openLesson = (id) => {
  router.push(`/lesson/${id}`);
};

onMounted(fetchLessons);
</script>
