<script>
import AthleteNav from "../components/CoachNav.vue";
import userService from "../services/userServices.js"; 
import exerciseGoalsService from "../services/exerciseGoalsServices.js"; 

export default {
  name: "ExerciseGoals",
  components: { AthleteNav },

  data() {
    return {
      selectedAthlete: null, // Stores the 'id' of the selected athlete
      athletes: [],          // Populated by fetchAthletes()
      goals: [],             // Stores the goals for the selected athlete
      exercises: [],        // Stores the exercises for the dropdown menu

      dialogNew: false,
      dialogEdit: false,
      editGoal: null,
      confirmDeleteDialog: false,
      goalToDelete: null,

      editGoal: { 
        id_player_goal: null,
        id_user: null,        // Required for saving back to the correct user
        id_exercise: null,
        title: "",
        description: "",
        target: "",
        deadline: "",
        status: "",
      },

      newGoal: {
        title: "",
        description: "",
        category: "",
        target: "",
        deadline: "",
        status: "",
        id_exercise: null,
      },
    };
  },

  methods: {
    async fetchAthletes() {
      try {
        const res = await userService.getAllUsers();

        this.athletes = res.data.map(user => ({
          id: user.id_user,
          name: `${user.fName} ${user.lName}`
        }));
      } catch (err) {
        console.error("Error fetching athletes:", err);
        
        this.athletes = [];
      }
    },

    openEdit(goal) {
      this.editGoal = { 
        ...goal,
        id_player_goal : goal.id_player_goal
      };
      this.dialogEdit = true;
    },

    async fetchExercises() {
      try {
        const res = await exerciseGoalsService.getAllExercises();

        this.exercises = res.data.map(exercise => ({
          id: exercise.id_exercise, 
          title: exercise.name 
        }));
      } catch (err) {
        console.error("Error fetching exercises:", err);
        this.exercises = [];
      }
    },

    async fetchGoalsForSelected() {
      if (!this.selectedAthlete) return;

      try {
        const res = await exerciseGoalsService.getGoalsForUser(this.selectedAthlete);
        this.goals = res.data;
      } catch (err) {
        console.error("Error fetching goals:", err);
        this.goals = [];
      }
    },

    async saveNewGoal() {
        if (!this.selectedAthlete) {
            console.error("Cannot save goal: No athlete selected.");
            return;
        }

        const goalToSave = {
            ...this.newGoal,
            id_user: this.selectedAthlete
        };

        try {
            await exerciseGoalsService.createGoal(goalToSave);
            
            await this.fetchGoalsForSelected();

            this.dialogNew = false;
            this.newGoal = {
                title: "",
                description: "",
                category: "",
                target: "",
                deadline: "",
                status: "",
            };
            
        } catch (err) {
            console.error("Error creating new goal:", err);
        }
    },

    async saveEditedGoal() {
      const id = this.editGoal.id_player_goal;
        
      const goalData = {
        title: this.editGoal.title,
        description: this.editGoal.description,
        id_exercise: this.editGoal.id_exercise,
        target: this.editGoal.target,
        deadline: this.editGoal.deadline,
        status: this.editGoal.status,
      };

      try {
        await exerciseGoalsService.updateGoal(id, goalData);
            
        this.dialogEdit = false;

        await this.fetchGoalsForSelected();

      } catch (error) {
        console.error("Error updating goal:", error.response?.data || error);
        this.errorMessage = `Failed to update goal. Status: ${error.response?.status || 'Network Error'}. Check console for details.`;
        this.errorDialog = true;
      }
    },

    openDeleteConfirmation(goal) {
      this.goalToDelete = goal;
      this.confirmDeleteDialog = true;
    },

    async executeDelete() {
      const goal = this.goalToDelete;
    
      this.confirmDeleteDialog = false;

      if (!goal) return;

      const id = goal.id_player_goal; 
    
      try {
        await exerciseGoalsService.deleteGoal(id);
        
        this.goals = this.goals.filter(g => (g.id_player_goal) !== id);
        
        console.log(`Goal ID ${id} deleted successfully.`);
        
        this.goalToDelete = null;

      } catch (error) {
        console.error("DELETE Request Error:", error.response?.data || error);
        this.errorMessage = `Failed to delete goal. Status: ${error.response?.status || 'Network Error'}. Check console for details.`;
        this.errorDialog = true;
      }
    },
  },

  mounted() {
    this.fetchAthletes();
    this.fetchExercises();
  },
};
</script>

<template>
  <AthleteNav />

  <v-container class="pa-6" style="max-width: 900px;">
    <h1 class="text-h4 font-weight-bold mb-6">Coach Goals</h1>

    <v-card class="pa-4 mb-8 rounded-xl elevation-3">
      <h2 class="text-h6 mb-4">Select Athlete</h2>

      <div class="d-flex align-center" style="gap: 12px;">
        <v-select
          v-model="selectedAthlete"
          :items="athletes"
          item-title="name"
          item-value="id"
          label="Choose an athlete"
          variant="outlined"
          class="rounded-lg"
          style="flex: 1"
          >
        </v-select>

        <v-btn 
          color="primary" 
          class="rounded-xl"
          height="56"
          @click="fetchGoalsForSelected"
          :disabled="!selectedAthlete"
          >
          Go
        </v-btn>
      </div>
    </v-card>

    <div v-if="selectedAthlete && goals.length > 0">
      <div class="d-flex justify-space-between align-center mb-4">
        <h2 class="text-h5 font-weight-bold">Goals</h2>

        <v-btn 
          color="primary" 
          class="rounded-xl" 
          @click="dialogNew = true"
          :disabled="!selectedAthlete" >
          <v-icon left>mdi-plus</v-icon>
          Add Goal
        </v-btn>
      </div>
      <v-row dense>
        <v-col cols="12" v-for="goal in goals" :key="goal.id">
          <v-card class="pa-4 rounded-xl elevation-2">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h3 class="text-h6 font-weight-bold">{{ goal.title }}</h3>
                <p class="text-body-2">
                  Category: {{ goal.category }} | Target: {{ goal.target }}
                </p>
                <p class="text-body-2">Deadline: {{ goal.deadline }}</p>
                <p class="text-body-2 font-italic">Status: {{ goal.status }}</p>
              </div>

              <div class="d-flex align-center">
                <v-btn icon class="mr-2" @click="openEdit(goal)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click.stop="openDeleteConfirmation(goal)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else-if="selectedAthlete && goals.length === 0">
      <v-alert type="info" variant="tonal">
        This athlete currently has no goals assigned. Click "Add Goal" to create one.
      </v-alert>
    </div>
    
    <div v-else>
      <v-alert type="warning" variant="tonal">
        Please select an athlete and click "Go" to view their goals.
      </v-alert>
    </div>

    <v-dialog v-model="dialogNew" max-width="500px">
      <v-card class="pa-4 rounded-xl">
        <h2 class="text-h6 font-weight-bold mb-4">Add New Goal</h2>

        <v-text-field label="Goal Title" v-model="newGoal.title" />
        <v-textarea label="Description" v-model="newGoal.description" />
        <v-select
          label="Select Exercise"
          :items="exercises"
          item-title="title"
          item-value="id"
          v-model="newGoal.id_exercise" 
          required
        />
        <v-text-field label="Target" v-model="newGoal.target" />
        <v-text-field label="Deadline" type="date" v-model="newGoal.deadline" />
        <v-select
          label="Status"
          :items="['Not Started', 'In Progress', 'Completed']"
          v-model="newGoal.status"
        />

        <div class="d-flex justify-end mt-4">
          <v-btn text @click="dialogNew = false">Cancel</v-btn>
          <v-btn color="primary" class="ml-2" @click="saveNewGoal">Save</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card class="pa-4 rounded-xl" v-if="editGoal">
        <h2 class="text-h6 font-weight-bold mb-4">Edit Goal</h2>

        <v-text-field label="Goal Title" v-model="editGoal.title" />
        <v-textarea label="Description" v-model="editGoal.description" />
        <v-select
          label="Select Exercise"
          :items="exercises"
          item-title="title"
          item-value="id"
          v-model="editGoal.id_exercise"
          required
        />
        <v-text-field label="Target" v-model="editGoal.target" />
        <v-text-field label="Deadline" type="date" v-model="editGoal.deadline" />
        <v-select
          label="Status"
          :items="['Not Started', 'In Progress', 'Completed']"
          v-model="editGoal.status"
        />

        <div class="d-flex justify-end mt-4">
          <v-btn text @click="dialogEdit = false">Cancel</v-btn>
          <v-btn color="primary" class="ml-2" @click="saveEditedGoal">Save Changes</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="errorDialog" max-width="400">
      <v-card color="error" class="pa-2 rounded-xl">
        <v-card-title class="text-h6 text-white d-flex align-center">
          <v-icon left class="mr-2">mdi-alert-circle</v-icon>
          Operation Failed
        </v-card-title>
        <v-card-text class="text-subtitle-1 text-white">
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="white" 
            variant="outlined" 
            @click="errorDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 error-text">
          Confirm Deletion
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete the goal: 
          <strong v-if="goalToDelete">{{ goalToDelete.title }}</strong>? 
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDeleteDialog = false">Cancel</v-btn>
          <v-btn 
            color="error" 
            class="ml-2" 
            @click="executeDelete"
          >
            Yes, Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
</style>