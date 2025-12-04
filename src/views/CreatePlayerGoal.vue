<template>
    <v-app>
      <CoachNav />
  
      <v-container class="pa-8 mt-10">
        <h2 class="text-center mb-6">Create Player Goal</h2>
  
        <v-card class="pa-6 mx-auto" max-width="600">
          <v-text-field
            label="Goal Title"
            v-model="goal.title"
            outlined
            required
          />
  
          <v-textarea
            label="Description"
            v-model="goal.description"
            outlined
            rows="3"
          />
  
          <v-select
            label="Assign to Athlete"
            v-model="goal.id_user"
            :items="athletes"
            item-title="name"
            item-value="id_user"
            outlined
            required
          />
  
          <v-select
            label="Exercise"
            v-model="goal.id_exercise"
            :items="exercises"
            item-title="name"
            item-value="id_exercise"
            outlined
            required
          />
  
          <v-text-field
            label="Target Time (optional)"
            v-model="goal.playerTime"
            type="number"
            outlined
          />
  
          <v-text-field
            label="Target Reps (optional)"
            v-model="goal.playerReps"
            type="number"
            outlined
          />
  
          <v-btn
            color="primary"
            block
            class="mt-4"
            @click="saveGoal"
          >
            Save Goal
          </v-btn>
  
          <v-alert
            v-if="message"
            type="success"
            class="mt-4"
            dense
          >
            {{ message }}
          </v-alert>
        </v-card>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import CoachNav from "../components/CoachNav.vue";
  import athleteServices from "../services/athleteServices.js";
  import exerciseServices from "../services/exerciseServices.js";
  import playerGoalServices from "../services/playerGoalServices.js";
  
  const athletes = ref([]);
  const exercises = ref([]);
  
  const goal = ref({
    title: "",
    description: "",
    id_user: null,
    id_exercise: null,
    playerReps: null,
    playerTime: null,
  });
  
  const message = ref("");
  
  onMounted(async () => {
    // Load athlete list
    const aRes = await athleteServices.getAll();
    athletes.value = aRes.data.map((a) => ({
      id_user: a.id_user,
      name: `${a.fName} ${a.lName}`,
    }));
  
    // Load exercises (you may need to adjust this depending on backend structure)
    const eRes = await exerciseServices.getAllExercises();
    exercises.value = eRes.data;

  });
  
  const saveGoal = async () => {
    try {
      await playerGoalServices.create(goal.value);
      message.value = "Goal created successfully!";
    } catch (err) {
      console.error("Error creating goal:", err);
      message.value = "Failed to create goal.";
    }
  };
  </script>
  