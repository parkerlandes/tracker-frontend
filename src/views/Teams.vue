<template>
  <v-app>
    <CoachNav />

    <h1 class="text-h5 font-weight-bold mb-6"></h1>
    <h1 class="text-h5 font-weight-bold mb-6"></h1>

    <v-container class="mt-10">
      <div class="d-flex justify-space-between align-center mb-6">
        <h2>Teams</h2>

        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus-box</v-icon>
          Add Team
        </v-btn>
      </div>

      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="48"
        class="d-flex mx-auto my-6"
      />

      <v-expansion-panels v-model="openPanels" multiple>
        <v-expansion-panel v-for="team in teams" :key="team.id_team">
          <v-expansion-panel-title>
            <h3>{{ team.name }}</h3>
            <v-spacer />

            <v-chip class="ma-1"
              >{{ team.members?.length || 0 }} athletes</v-chip
            >
            <v-chip class="ma-1" variant="outlined" color="secondary">
              {{ team.plans?.length || 0 }} plans
            </v-chip>

            <v-btn
              size="small"
              color="grey"
              variant="text"
              @click.stop="openEditDialog(team)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div class="d-flex align-center mb-2">
              <h4 class="mr-3 mb-0">Athletes</h4>
              <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click="openAssignDialog(team)"
              >
                Assign Athletes
              </v-btn>
            </div>

            <v-alert v-if="!team.members?.length" type="info" class="mb-4">
              No athletes assigned to this team yet.
            </v-alert>

            <v-list v-else class="mb-4">
              <v-list-item
                v-for="athlete in team.members"
                :key="athlete.id_user"
              >
                <template #prepend>
                  <v-avatar color="blue">
                    <v-icon color="white">mdi-account</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title>
                  {{ athlete.fName }} {{ athlete.lName }}
                </v-list-item-title>

                <template #append>
                  <v-btn
                    icon
                    color="error"
                    @click="removeFromTeam(team.id_team, athlete.id_user)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <!-- PLANS SECTION -->
            <div class="d-flex align-center mb-2">
              <h4 class="mr-3 mb-0">Exercise Plans</h4>
              <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click.stop="openPlansDialog(team)"
              >
                Manage Plans
              </v-btn>
            </div>

            <v-alert v-if="!team.plans?.length" type="info">
              No exercise plans assigned.
            </v-alert>

            <v-list v-else>
              <v-list-item v-for="plan in team.plans" :key="plan.id_lesson">
                <v-list-item-title>{{ plan.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- CREATE TEAM DIALOG -->
      <v-dialog v-model="createDialog" max-width="500">
        <v-card class="pa-6">
          <h3 class="mb-4">Create New Team</h3>

          <v-text-field
            v-model="newTeamName"
            label="Team Name"
            variant="outlined"
          />

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="createDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="createTeam">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- EDIT TEAM DIALOG -->
      <v-dialog v-model="editDialog" max-width="500">
        <v-card class="pa-6">
          <h3 class="mb-4">Edit Team</h3>

          <v-text-field
            v-model="editTeamName"
            label="Team Name"
            variant="outlined"
          />

          <v-card-actions>
            <v-btn color="error" text @click="deleteTeam(selectedTeam.id_team)">
              <v-icon left>mdi-delete</v-icon>
              Delete Team
            </v-btn>
            <v-spacer />
            <v-btn text @click="editDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="updateTeam">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- MANAGE PLANS DIALOG (unchanged from before) -->
      <v-dialog v-model="plansDialog" max-width="600">
        <v-card class="pa-6">
          <h3 class="mb-4">Manage Plans for {{ selectedTeam?.name }}</h3>

          <div v-if="selectedTeam">
            <!-- CURRENT PLANS -->
            <h4 class="mb-2">Current Plans</h4>

            <v-alert v-if="!selectedTeam.plans?.length" type="info"
              >No exercise plans assigned.</v-alert
            >

            <v-list v-else class="mb-4">
              <v-list-item
                v-for="plan in selectedTeam.plans"
                :key="plan.id_lesson"
              >
                <v-list-item-title>{{ plan.title }}</v-list-item-title>

                <template #append>
                  <v-btn
                    icon
                    color="error"
                    @click="
                      removePlanFromTeam(selectedTeam.id_team, plan.id_lesson)
                    "
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <h4 class="mb-2">Assign New Plan</h4>

            <v-select
              v-model="selectedLesson"
              :items="allLessons"
              item-title="title"
              item-value="id_lesson"
              label="Select Lesson"
              variant="outlined"
              class="mb-3"
            />

            <v-btn
              color="primary"
              block
              :disabled="!selectedLesson"
              @click="assignPlanToTeam(selectedTeam.id_team, selectedLesson)"
            >
              Add Plan to Team
            </v-btn>
          </div>

          <v-card-actions class="mt-6">
            <v-spacer />
            <v-btn color="grey" variant="flat" @click="plansDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="assignDialog" max-width="500">
        <v-card class="pa-6">
          <h3 class="mb-4">Assign Athletes to {{ selectedTeam?.name }}</h3>

          <v-select
            v-model="selectedAthletes"
            :items="allAthletes"
            item-title="fullName"
            item-value="id_user"
            label="Select Athletes"
            multiple
            chips
            clearable
          ></v-select>

          <v-btn
            class="mt-3"
            color="primary"
            block
            :disabled="selectedAthletes.length === 0"
            @click="assignAthletesToTeam"
          >
            Assign Selected Athletes
          </v-btn>

          <v-card-actions class="mt-4">
            <v-spacer />
            <v-btn variant="tonal" @click="assignDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CoachNav from "../components/CoachNav.vue";
import teamServices from "../services/teamServices.js";
import lessonServices from "../services/lessonServices.js";
import athleteServices from "../services/athleteServices.js";

const teams = ref([]);
const loading = ref(true);
const openPanels = ref([]);

// dialog states
const createDialog = ref(false);
const editDialog = ref(false);
const plansDialog = ref(false);
const assignDialog = ref(false);
const assignSelected = ref([]); // array of athlete IDs

// form models
const newTeamName = ref("");
const editTeamName = ref("");
const selectedAthletes = ref([]);
const selectedAthleteIds = ref([]);
const athletes = ref([]);
const allAthletes = ref([]);
const selectedTeam = ref(null);
const selectedTeamObj = ref(null);
const selectedLesson = ref(null);
const allLessons = ref([]);

// ---- LOAD DATA ----
const loadTeamsAndMembers = async () => {
  loading.value = true;
  try {
    const teamsRes = await teamServices.getAllTeams();

    teams.value = await Promise.all(
      teamsRes.data.map(async (team) => {
        // --- MEMBERS ---
        const memberRes = await teamServices.getTeamMembers(team.id_team);

        const members = memberRes.data.map((m) => {
          const user = m.user || m; // supports both shapes
          return {
            id_user: Number(user.id_user), // force number
            fName: user.fName,
            lName: user.lName,
          };
        });

        // --- PLANS (unchanged except for safety) ---
        const plansRes = await teamServices.getTeamPlans(team.id_team);
        const plans = plansRes.data.map((p) => p.lesson || p);

        return {
          ...team,
          members, // normalized members
          plans,
        };
      })
    );
  } catch (err) {
    console.error("Error loading teams:", err);
  } finally {
    loading.value = false;
  }
};

const loadAllLessons = async () => {
  try {
    const res = await lessonServices.getLessons();
    allLessons.value = res.data;
  } catch (err) {
    console.error("Error loading lessons:", err);
  }
};

const loadAllAthletes = async () => {
  const res = await athleteServices.getAll();
  allAthletes.value = res.data.map((a) => ({
    id_user: Number(a.id_user),
    fullName: `${a.fName} ${a.lName}`,
  }));
};

// ---- CREATE ----
const openCreateDialog = () => {
  newTeamName.value = "";
  createDialog.value = true;
};

const createTeam = async () => {
  if (!newTeamName.value.trim()) return;

  await teamServices.createTeam({ name: newTeamName.value });
  createDialog.value = false;

  await loadTeamsAndMembers();
};

// ---- EDIT ----
const openEditDialog = (team) => {
  selectedTeam.value = team;
  editTeamName.value = team.name;
  editDialog.value = true;
};

const openAssignDialog = async (team) => {
  selectedTeam.value = team;
  assignDialog.value = true;

  await loadAllAthletes();

  // Extract IDs of athletes already on this team
  selectedAthletes.value = team.members.map((m) => Number(m.id_user));
};

const updateTeam = async () => {
  await teamServices.updateTeam(selectedTeam.value.id_team, {
    name: editTeamName.value,
  });

  editDialog.value = false;
  await loadTeamsAndMembers();
};

const assignAthletesToTeam = async () => {
  try {
    if (!selectedTeam.value?.id_team) {
      console.error("No team selected");
      return;
    }

    console.log(
      "Assigning:",
      selectedAthletes.value,
      "to team:",
      selectedTeam.value.id_team
    );

    for (const athleteId of selectedAthletes.value) {
      await teamServices.assignToTeam(
        Number(athleteId),
        Number(selectedTeam.value.id_team)
      );
    }

    // preserve open panels
    const prevOpen = [...openPanels.value];

    await loadTeamsAndMembers();

    openPanels.value = prevOpen;
    assignDialog.value = false;
  } catch (err) {
    console.error("Error assigning athletes:", err);
  }
};

const saveAssignedAthletes = async () => {
  const team = currentTeam.value;
  if (!team) return;

  // Existing members for this team (numbers)
  const existingIds = new Set(
    (team.members || []).map((m) => Number(m.id_user))
  );

  // Desired members from the multi-select (numbers)
  const desiredIds = new Set(selectedAthleteIds.value.map((id) => Number(id)));

  const toAdd = [...desiredIds].filter((id) => !existingIds.has(id));
  const toRemove = [...existingIds].filter((id) => !desiredIds.has(id));

  try {
    await Promise.all([
      ...toAdd.map((id_user) =>
        teamServices.assignToTeam(id_user, team.id_team)
      ),
      ...toRemove.map((id_user) =>
        teamServices.removeFromTeam(id_user, team.id_team)
      ),
    ]);

    // Reload teams with fresh members
    await loadTeamsAndMembers();

    // Re-sync currentTeam and selectedAthleteIds while dialog stays open
    const updated = teams.value.find((t) => t.id_team === team.id_team);
    if (updated) {
      currentTeam.value = updated;
      selectedAthleteIds.value = (updated.members || []).map((m) =>
        Number(m.id_user)
      );
    }

    // If you want the dialog to CLOSE after saving, uncomment this:
    // assignDialog.value = false;
  } catch (err) {
    console.error("Error saving assigned athletes:", err);
  }
};

// ---- DELETE ----
const deleteTeam = async (id_team) => {
  await teamServices.deleteTeam(id_team);
  editDialog.value = false;

  await loadTeamsAndMembers();
};

const removeFromTeam = async (id_team, id_user) => {
  try {
    await teamServices.removeFromTeam(id_user, id_team);
    await loadTeamsAndMembers();
  } catch (err) {
    console.error("Error removing athlete:", err);
  }
};

// ---- PLANS ----
const openPlansDialog = (team) => {
  selectedTeam.value = team;
  selectedLesson.value = null;
  plansDialog.value = true;
};

const assignPlanToTeam = async (id_team, id_lesson) => {
  await teamServices.assignPlanToTeam(id_team, id_lesson);
  await loadTeamsAndMembers();

  selectedTeam.value = teams.value.find((t) => t.id_team === id_team);
  plansDialog.value = false;
};

const removePlanFromTeam = async (id_team, id_lesson) => {
  await teamServices.removePlanFromTeam(id_team, id_lesson);
  await loadTeamsAndMembers();

  selectedTeam.value = teams.value.find((t) => t.id_team === id_team);
};

onMounted(async () => {
  await Promise.all([loadTeamsAndMembers(), loadAllLessons()]);
});
</script>
