<template>
  <v-app>
    <CoachNav />

    <h1 class="text-h5 font-weight-bold mb-6"></h1>
    <h1 class="text-h5 font-weight-bold mb-6"></h1>

    <v-container class="mt-10">
      <div class="d-flex justify-space-between align-center mb-6">
        <h2>Athletes</h2>
        <v-btn color="primary" @click="addAthleteDialog = true">
          <v-icon left>mdi-plus-box</v-icon>
          Add Athlete
        </v-btn>
      </div>

      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="48"
        class="d-flex mx-auto my-6"
      />

      <v-row v-else>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="athlete in athletes"
          :key="athlete.id_user"
        >
          <v-card class="pa-4 mb-4" elevation="4">
            <h3>{{ athlete.fName }} {{ athlete.lName }}</h3>
            <p class="text-medium-emphasis">{{ athlete.email }}</p>

            <strong>Teams:</strong>

            <!-- FIXED CONDITION -->
            <div v-if="athlete?.teams?.length">
              <v-chip
                v-for="t in athlete.teams"
                :key="t.id_team"
                class="ma-1"
                color="primary"
                size="small"
              >
                {{ t.name }}
              </v-chip>
            </div>

            <div v-else class="text-medium-emphasis">No teams assigned</div>

            <v-btn
              class="mt-3"
              color="primary"
              block
              @click="openTeamDialog(athlete)"
            >
              Manage Teams
            </v-btn>

            <v-btn
              class="mt-3"
              color="primary"
              block
              @click="openEditDialog(athlete)"
            >
              Edit
            </v-btn>

            <v-btn
              class="mt-3"
              color="primary"
              block
              @click="openDeleteDialog(athlete)"
            >
              Delete
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <!-- ADD ATHLETE DIALOG -->
      <v-dialog v-model="addAthleteDialog" max-width="600">
        <v-card class="pa-6">
          <h3 class="mb-4">Add New Athlete</h3>

          <v-form ref="addAthleteForm">
            <v-text-field
              v-model="newAthlete.fName"
              label="First Name"
              required
            />

            <v-text-field
              v-model="newAthlete.lName"
              label="Last Name"
              required
            />

            <v-text-field
              v-model="newAthlete.email"
              label="Email"
              type="email"
            />

            <v-select
              v-model="newAthlete.id_team"
              :items="teams"
              item-title="name"
              item-value="id_team"
              label="Assign to Team"
              clearable
            />

            <v-row class="mt-4">
              <v-col cols="6">
                <v-btn
                  block
                  color="grey"
                  variant="text"
                  @click="addAthleteDialog = false"
                >
                  Cancel
                </v-btn>
              </v-col>

              <v-col cols="6">
                <v-btn block color="primary" @click="submitNewAthlete">
                  Save Athlete
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- TEAM MANAGEMENT DIALOG -->
      <v-dialog v-model="teamDialog" max-width="500">
        <v-card class="pa-6">
          <h3 class="mb-4">Manage Teams for {{ selectedAthlete?.fName }}</h3>

          <div v-if="selectedAthlete">
            <h4 class="mb-2">Current Teams</h4>

            <v-list>
              <v-list-item
                v-for="t in selectedAthlete?.teams || []"
                :key="t.id_team"
              >
                <template #prepend>
                  <v-avatar color="secondary">
                    <v-icon color="white">mdi-account-group</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>{{ t.name }}</v-list-item-title>

                <template #append>
                  <v-btn
                    color="error"
                    icon
                    @click="removeFromTeam(selectedAthlete.id_user, t.id_team)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <h4 class="mt-4">Assign to New Team</h4>

            <v-select
              v-model="selectedTeam"
              :items="teams"
              item-title="name"
              item-value="id_team"
              label="Select Team"
            />

            <v-btn
              color="primary"
              block
              class="mt-3"
              :disabled="!selectedTeam"
              @click="assignToTeam(selectedAthlete.id_user, selectedTeam)"
            >
              Add to Team
            </v-btn>
          </div>

          <v-card-actions class="mt-6">
            <v-spacer />
            <v-btn color="grey" variant="flat" @click="teamDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editDialog" max-width="500">
        <v-card class="pa-6">
          <h3 class="mb-4">Edit Athlete</h3>

          <v-text-field
            v-model="editAthlete.fName"
            label="First Name"
            variant="outlined"
          />
          <v-text-field
            v-model="editAthlete.lName"
            label="Last Name"
            variant="outlined"
          />
          <v-text-field
            v-model="editAthlete.email"
            label="Email"
            variant="outlined"
          />

          <v-card-actions class="mt-4">
            <v-spacer />
            <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveAthlete">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" max-width="450">
        <v-card class="pa-6">
          <h3 class="mb-4">Delete Athlete</h3>

          <p>
            Are you sure you want to delete
            <strong
              >{{ selectedAthlete?.fName }} {{ selectedAthlete?.lName }}</strong
            >?
          </p>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="error" @click="deleteAthlete">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CoachNav from "../components/CoachNav.vue";
import athleteServices from "../services/athleteServices.js";
import teamServices from "../services/teamServices.js";

const athletes = ref([]);
const addAthleteDialog = ref(false);
const selectedAthlete = ref(null);
const editDialog = ref(false);
const editAthlete = ref({});
const deleteDialog = ref(false);

const teams = ref([]);
const teamDialog = ref(false);
const selectedTeam = ref(null);

const loading = ref(true);

const loadAthletes = async () => {
  try {
    const athRes = await athleteServices.getAll();
    athletes.value = athRes.data;

    const teamRes = await teamServices.getAllTeams();
    teams.value = teamRes.data;

    // Attach team data
    for (const athlete of athletes.value) {
      const res = await teamServices.getUserTeams(athlete.id_user);
      athlete.teams = res.data.map((t) => ({
        id_team: t.team.id_team,
        name: t.team.name,
      }));
    }
  } catch (err) {
    console.error("Error loading athletes:", err);
  } finally {
    loading.value = false;
  }
};

const newAthlete = ref({
  fName: "",
  lName: "",
  email: "",
  id_team: null,
});

const deleteAthlete = async () => {
  try {
    await athleteServices.delete(selectedAthlete.value.id_user);

    deleteDialog.value = false;

    await loadAthletes(); // refresh list
  } catch (err) {
    console.error("Error deleting athlete:", err);
  }
};

const openTeamDialog = (athlete) => {
  selectedAthlete.value = athlete;
  selectedTeam.value = null;
  teamDialog.value = true;
};

const assignToTeam = async (id_user, id_team) => {
  await teamServices.assignToTeam(id_user, id_team);
  await loadAthletes();
  teamDialog.value = false;

  selectedTeam.value = null;
};

const removeFromTeam = async (id_user, id_team) => {
  await teamServices.removeFromTeam(id_user, id_team);
  await loadAthletes();
  selectedAthlete.value = athletes.value.find((a) => a.id_user === id_user);
};

const submitNewAthlete = async () => {
  try {
    // 1 — create athlete
    const created = await athleteServices.createAthlete({
      fName: newAthlete.value.fName,
      lName: newAthlete.value.lName,
      email: newAthlete.value.email,
    });

    const userId = created.data.id_user;

    // 2 — assign to team
    if (newAthlete.value.id_team) {
      await teamServices.assignToTeam(userId, newAthlete.value.id_team);
    }

    // close dialog
    addAthleteDialog.value = false;

    // reset form
    newAthlete.value = { fName: "", lName: "", email: "", id_team: null };

    // refresh list
    await loadAthletes();
  } catch (err) {
    console.error("Error creating athlete:", err);
  }
};

const saveAthlete = async () => {
  try {
    await athleteServices.update(editAthlete.value.id_user, editAthlete.value);

    editDialog.value = false;

    await loadAthletes(); // refresh page
  } catch (err) {
    console.error("Error updating athlete:", err);
  }
};

const openEditDialog = (athlete) => {
  editAthlete.value = { ...athlete }; // copy values so we don't bind directly
  editDialog.value = true;
};

const openDeleteDialog = (athlete) => {
  selectedAthlete.value = athlete;
  deleteDialog.value = true;
};

onMounted(loadAthletes);
</script>

<style scoped>
.text-medium-emphasis {
  opacity: 0.8;
}
</style>
