<template>
    <v-app>
      <CoachNav />

      <h1 class="text-h5 font-weight-bold mb-6"></h1>
  
      <v-container class="pa-8 mt-10">
        <div class="d-flex justify-space-between align-center mb-6">
          <h2>Player Goals</h2>
  
          <v-btn color="primary" @click="$router.push('/coach/goals/create')">
            <v-icon left>mdi-plus-box</v-icon>
            Add Goal
          </v-btn>
        </div>
  
        <!-- LOADING SPINNER -->
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="48"
          class="d-flex mx-auto my-6"
        />
  
        <!-- GOAL LIST -->
        <v-row v-else>
          <v-col cols="12" md="6" v-for="goal in goals" :key="goal.id_player_goal">
            <v-card class="pa-6 mb-4" elevation="4">
              <h3>{{ goal.title }}</h3>
              <p class="text-medium-emphasis">{{ goal.description }}</p>
  
              <v-chip color="blue" small class="mr-2">
                Athlete: {{ goal.athleteName || "Unknown" }}
              </v-chip>
  
              <v-chip color="green" small>
                Exercise: {{ goal.exerciseName || "Unknown" }}
              </v-chip>
  
              <div class="mt-4 d-flex">
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="mr-3"
                  @click="openEditDialog(goal)"
                >
                  Edit
                </v-btn>
  
                <v-btn
                  color="error"
                  variant="tonal"
                  @click="openDeleteDialog(goal)"
                >
                  Delete
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- EDIT GOAL POPUP -->
        <v-dialog v-model="editDialog" max-width="600">
          <v-card class="pa-6">
            <h3>Edit Goal</h3>
  
            <v-text-field
              v-model="editGoal.title"
              label="Goal Title"
              class="mb-4"
            />
  
            <v-textarea
              v-model="editGoal.description"
              label="Description"
              rows="3"
              class="mb-4"
            />
  
            <v-select
              v-model="editGoal.id_user"
              :items="allAthletes"
              item-title="name"
              item-value="id_user"
              label="Assign to Athlete"
              class="mb-4"
              required
            />
  
            <v-select
              v-model="editGoal.id_exercise"
              :items="allExercises"
              item-title="name"
              item-value="id_exercise"
              label="Exercise"
              class="mb-4"
              required
            />
  
            <v-text-field
              v-model="editGoal.playerTime"
              type="number"
              label="Target Time"
              class="mb-4"
            />
  
            <v-text-field
              v-model="editGoal.playerReps"
              type="number"
              label="Target Reps"
              class="mb-4"
            />
  
            <v-card-actions>
              <v-spacer></v-spacer>
  
              <v-btn text @click="editDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="saveEditedGoal">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- DELETE POPUP -->
        <v-dialog v-model="deleteDialog" max-width="400">
          <v-card class="pa-6">
            <h3>Delete Goal?</h3>
            <p>Are you sure you want to delete <b>{{ deleteGoal?.title }}</b>?</p>
  
            <v-card-actions class="mt-4">
              <v-spacer></v-spacer>
  
              <v-btn text @click="deleteDialog = false">Cancel</v-btn>
              <v-btn color="error" @click="confirmDeleteGoal">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import CoachNav from "../components/CoachNav.vue";
  import goalServices from "../services/goalServices.js";
  import exerciseServices from "../services/exerciseServices.js";
  import userServices from "../services/userServices.js";
  import { nextTick } from "vue";
  
  // ---------------------------
  // STATE
  // ---------------------------
  const goals = ref([]);
  const loading = ref(true);
  
  const editDialog = ref(false);
  const deleteDialog = ref(false);
  
  const editGoal = ref({});
  const deleteGoal = ref(null);
  
  const allAthletes = ref([]);
  const allExercises = ref([]);
  
  // ---------------------------
  // LOAD GOALS
  // ---------------------------
  const loadGoals = async () => {
    loading.value = true;
  
    try {
      const res = await goalServices.getAllGoals();
      const users = await userServices.getAllUsers();
      const exercises = await exerciseServices.getAllExercises();
  
      const userMap = Object.fromEntries(
        users.data.map(u => [u.id_user, `${u.fName} ${u.lName}`])
      );
  
      const exerciseMap = Object.fromEntries(
        exercises.data.map(e => [e.id_exercise, e.name])
      );
  
      goals.value = res.data.map(goal => ({
        ...goal,
        athleteName: userMap[goal.id_user],
        exerciseName: exerciseMap[goal.id_exercise],
      }));
    } catch (err) {
      console.error("Error loading goals:", err);
    }
  
    loading.value = false;
  };
  
  // ---------------------------
  // EDIT POPUP
  // ---------------------------
  const openEditDialog = async (goal) => {
    editGoal.value = { ...goal };
  
    // Populate dropdowns
    const users = await userServices.getAllUsers();
    allAthletes.value = users.data.map(a => ({
      id_user: a.id_user,
      name: `${a.fName} ${a.lName}`
    }));
  
    const exercises = await exerciseServices.getAllExercises();
    allExercises.value = exercises.data;
  
    editDialog.value = true;
  };
  
    const saveEditedGoal = async () => {
    try {
        const id = editGoal.value.id_player_goal;
        const payload = { ...editGoal.value };

        // Close the edit popup immediately
        editDialog.value = false;

        // Update backend
        await goalServices.updateGoal(id, payload);

        // FORCE Vue to refresh data after backend confirms
        await loadGoals();

        // Deep clone to force Vue reactivity
        goals.value = JSON.parse(JSON.stringify(goals.value));

    } catch (err) {
        console.error("Error updating goal:", err);
    }
    };



  
  // ---------------------------
  // DELETE POPUP
  // ---------------------------
  const openDeleteDialog = (goal) => {
    deleteGoal.value = goal;
    deleteDialog.value = true;
  };
  
  const confirmDeleteGoal = async () => {
    try {
      await goalServices.deleteGoal(deleteGoal.value.id_player_goal);
  
      deleteDialog.value = false;      // CLOSE POPUP
      await loadGoals();               // REFRESH LIST
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };
  
  // ---------------------------
  onMounted(loadGoals);
  </script>
  