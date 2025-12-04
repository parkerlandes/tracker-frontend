<template>
  <v-app>
    <CoachNav />

    <v-container>
      <h1 class="text-h4 font-weight-bold mt-8 mb-6">Exercises</h1>

      <v-text-field
        v-model="search"
        label="Search exercises"
        prepend-inner-icon="mdi-magnify"
        outlined
        clearable
        class="mb-4"
      />

      <v-row>
        <v-col
          v-for="exercise in filteredExercises"
          :key="exercise.id_exercise"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="pa-4 hoverable" @click="viewExercise(exercise.id_exercise)">
            <h3 class="font-weight-bold">{{ exercise.name }}</h3>
            <p class="text-medium-emphasis">{{ exercise.description }}</p>

            <v-chip size="small" class="ma-1" color="primary">{{ exercise.muscleGroup }}</v-chip>
          </v-card>
        </v-col>
      </v-row>
      
    </v-container>
  </v-app>
</template>

<script>
import exerciseServices from "../services/exerciseServices.js";
import CoachNav from "../components/CoachNav.vue";

export default {
  components: { CoachNav },

  data() {
    return {
      exercises: [],
      search: "",
    };
  },

  computed: {
    filteredExercises() {
      return this.exercises.filter(e => 
        e.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  mounted() {
    exerciseServices.getAll().then(res => {
      this.exercises = res.data;
    });
  },

  methods: {
    viewExercise(id) {
      this.$router.push(`/coach/exercise/${id}`);
    },
  },
};
</script>

<style scoped>
.hoverable:hover {
  transform: translateY(-4px);
  transition: 0.2s;
  cursor: pointer;
}
</style>
