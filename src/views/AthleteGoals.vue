<template>
  <v-app>
    <AthleteNav />
    <h1 class="text-h5 font-weight-bold mb-6"></h1>

    <v-container class="pa-8 mt-10">
      <div class="d-flex justify-space-between align-center mb-6">
        <h2>My Goals</h2>

        <v-btn color="primary" @click="openAddDialog">
          <v-icon left>mdi-plus</v-icon>
          Add Goal
        </v-btn>
      </div>

      <!-- Loading Spinner -->
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="48"
        class="d-flex mx-auto my-6"
      />

      <!-- Goals List -->
      <v-row v-else>
        <v-col
          cols="12"
          md="6"
          v-for="goal in goals"
          :key="goal.id_player_goal"
        >
          <v-card class="pa-6 mb-4" elevation="4">
            <h3>{{ goal.title }}</h3>
            <p class="text-medium-emphasis">{{ goal.description }}</p>

            <v-chip color="green" small class="mr-2">
              Exercise: {{ goal.exerciseName || "Unknown" }}
            </v-chip>

            <v-chip v-if="goal.playerTime" color="blue" small class="mr-2">
              Time Goal: {{ goal.playerTime }}
            </v-chip>

            <v-chip v-if="goal.playerReps" color="purple" small>
              Rep Goal: {{ goal.playerReps }}
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

      <!-- If No Goals -->
      <v-alert v-if="!loading && goals.length === 0" type="info" class="mt-4">
        You do not have any goals yet.
      </v-alert>

      <!-- ADD GOAL POPUP -->
      <v-dialog v-model="addDialog" max-width="600">
        <v-card class="pa-6">
          <h3>Add New Goal</h3>

          <v-text-field
            v-model="newGoal.title"
            label="Goal Title"
            class="mb-4"
          />

          <v-textarea
            v-model="newGoal.description"
            label="Description"
            rows="3"
            class="mb-4"
          />

          <v-select
            v-model="newGoal.id_exercise"
            :items="allExercises"
            item-title="name"
            item-value="id_exercise"
            label="Exercise"
            required
            class="mb-4"
          />

          <v-text-field
            v-model="newGoal.playerTime"
            type="number"
            label="Target Time"
            class="mb-4"
          />

          <v-text-field
            v-model="newGoal.playerReps"
            type="number"
            label="Target Reps"
            class="mb-4"
          />

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="addDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveNewGoal">Save Goal</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
            v-model="editGoal.id_exercise"
            :items="allExercises"
            item-title="name"
            item-value="id_exercise"
            label="Exercise"
            required
            class="mb-4"
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
          <p>
            Are you sure you want to delete <b>{{ deleteGoal?.title }}</b
            >?
          </p>

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
import AthleteNav from "../components/AthleteNav.vue";
import Utils from "../config/utils.js";
import goalServices from "../services/goalServices.js";
import exerciseServices from "../services/exerciseServices.js";

// -------------------- STATE --------------------
const goals = ref([]);
const loading = ref(true);

const addDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

const newGoal = ref({
  title: "",
  description: "",
  id_exercise: null,
  playerTime: null,
  playerReps: null,
});

const editGoal = ref({});
const deleteGoal = ref(null);

const allExercises = ref([]);

// -------------------- LOAD GOALS --------------------
const loadGoals = async () => {
  loading.value = true;

  try {
    const user = Utils.getStore("user");

    if (!user?.id_user) {
      console.error("No logged-in user");
      loading.value = false;
      return;
    }

    const res = await goalServices.getUserGoals(user.id_user);
    const exercises = await exerciseServices.getAllExercises();

    const exerciseMap = Object.fromEntries(
      exercises.data.map((e) => [e.id_exercise, e.name])
    );

    goals.value = res.data.map((goal) => ({
      ...goal,
      exerciseName: exerciseMap[goal.id_exercise],
    }));

    allExercises.value = exercises.data;
  } catch (err) {
    console.error("Error loading goals:", err);
  }

  loading.value = false;
};

// -------------------- ADD GOAL --------------------
const openAddDialog = () => {
  newGoal.value = {
    title: "",
    description: "",
    id_exercise: null,
    playerTime: null,
    playerReps: null,
  };
  addDialog.value = true;
};

const saveNewGoal = async () => {
  try {
    const user = Utils.getStore("user");

    const payload = {
      ...newGoal.value,
      id_user: user.id_user, // <-- FORCE athlete id
    };

    await goalServices.createGoal(payload);

    addDialog.value = false;
    await loadGoals();
  } catch (err) {
    console.error("Error creating goal:", err);
  }
};

// -------------------- EDIT GOAL --------------------
const openEditDialog = (goal) => {
  editGoal.value = { ...goal };
  editDialog.value = true;
};

const saveEditedGoal = async () => {
  try {
    await goalServices.updateGoal(
      editGoal.value.id_player_goal,
      editGoal.value
    );

    editDialog.value = false;
    await loadGoals();
  } catch (err) {
    console.error("Error updating goal:", err);
  }
};

// -------------------- DELETE GOAL --------------------
const openDeleteDialog = (goal) => {
  deleteGoal.value = goal;
  deleteDialog.value = true;
};

const confirmDeleteGoal = async () => {
  try {
    await goalServices.deleteGoal(deleteGoal.value.id_player_goal);

    deleteDialog.value = false;
    await loadGoals();
  } catch (err) {
    console.error("Error deleting goal:", err);
  }
};

// -------------------- INIT --------------------
onMounted(loadGoals);
</script>

<style scoped></style>
