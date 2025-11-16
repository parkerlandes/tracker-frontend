<script setup>
import { ref, onMounted, computed } from "vue";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import CoachNav from "../components/CoachNav.vue";
import AthleteNav from "../components/AthleteNav.vue";
import LessonServices from "../services/lessonServices.js";

const user = Utils.getStore("user");
const isCoach = computed(() => user?.role === "coach");

const lessons = ref([]);
const loading = ref(true);
const error = ref("");
const router = useRouter();

onMounted(async () => {
  try {
    const { data } = await LessonServices.getLessons();
    lessons.value = data;
  } catch (err) {
    console.error("Error fetching lessons:", err);
    error.value = "Failed to load lessons.";
  } finally {
    loading.value = false;
  }
});

const goToLesson = (id) => router.push(`/lesson/${id}`);
</script>


<template>
  <v-app>
    <CoachNav v-if="isCoach" />
    <AthleteNav v-else />

    <v-container class="pa-8 mt-10">
      <h2 class="mb-6 text-center">Lesson Catalog</h2>
      <v-progress-circular v-if="loading" indeterminate color="primary" size="48"
        class="d-flex mx-auto my-6" />
      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="lesson in lessons" :key="lesson.id_lesson">
          <v-card class="pa-6 text-center hoverable" elevation="4">
            <v-icon size="48" color="primary">mdi-book-open-page-variant</v-icon>
            <h3 class="mt-3">{{ lesson.title }}</h3>
            <p class="text-medium-emphasis">{{ lesson.description }}</p>
            <v-chip v-if="lesson.difficulty" color="secondary" label>
              {{ lesson.difficulty }}
            </v-chip>
            <v-btn color="primary" class="mt-4" @click="goToLesson(lesson.id_lesson)">
              View Lesson
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    </v-container>
  </v-app>
</template>
