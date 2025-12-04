<template>
  <v-app>
    <CoachNav />

    <v-container class="mt-10">
      <v-card class="pa-6" elevation="3">
        <h2 class="mb-4">Add Exercise to Lesson</h2>

        <v-form v-model="valid">
          <v-text-field
            v-model="exercise.name"
            label="Exercise Name"
            required
          />
          <v-textarea
            v-model="exercise.description"
            label="Description"
            auto-grow
            required
          />

          <v-text-field
            v-model="exercise.reps"
            label="Reps"
            type="number"
          />

          <v-text-field
            v-model="exercise.sets"
            label="Sets"
            type="number"
          />

          <v-row class="mt-4">
            <v-col cols="6">
              <v-btn block color="grey" @click="cancel">Cancel</v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn
                block
                color="primary"
                :disabled="!exercise.name || !exercise.description"
                @click="saveExercise"
              >
                Save Exercise
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

      </v-card>
    </v-container>
  </v-app>
</template>


<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import exerciseServices from "../services/exerciseServices.js";
import CoachNav from "../components/CoachNav.vue";

const router = useRouter();
const route = useRoute();

const valid = ref(false);

const exercise = ref({
  name: "",
  description: "",
  reps: "",
  sets: "",
});

const saveExercise = async () => {
  const id_lesson = route.params.id_lesson;

  try {
    await exerciseServices.addExercise(id_lesson, { ...exercise.value });

    router.push(`/coach/lesson/${id_lesson}`);
  } catch (err) {
    console.error("Error creating exercise:", err);
  }
};

const cancel = () => {
  const id_lesson = route.params.id_lesson;
  router.push(`/coach/lesson/${id_lesson}`);
};
</script>
