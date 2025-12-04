<template>
    <v-app>
      <AthleteNav />

      <h2 class="mb-6"></h2>
  
      <v-container class="mt-10">
        <h2 class="mb-6">My Teams</h2>
  
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="48"
          class="d-flex mx-auto my-6"
        />
  
        <v-expansion-panels v-else v-model="openPanels" multiple>
          <v-expansion-panel
            v-for="team in teams"
            :key="team.id_team"
          >
            <v-expansion-panel-title>
              {{ team.name }}
              <v-spacer />
  
              <v-chip class="ma-1">{{ team.members?.length || 0 }} athletes</v-chip>
              <v-chip class="ma-1" color="secondary" variant="outlined">
                {{ team.plans?.length || 0 }} plans
              </v-chip>
            </v-expansion-panel-title>
  
            <v-expansion-panel-text>
  
              <!-- ATHLETES -->
              <h4 class="mb-2">Athletes</h4>
  
              <v-alert
                v-if="!team.members?.length"
                type="info"
                class="mb-4"
              >
                No athletes assigned to this team.
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
                </v-list-item>
              </v-list>
  
              <!-- PLANS -->
              <h4 class="mb-2">Exercise Plans</h4>
  
              <v-alert
                v-if="!team.plans?.length"
                type="info"
              >
                No exercise plans assigned.
              </v-alert>
  
              <v-list v-else>
                <v-list-item
                  v-for="plan in team.plans"
                  :key="plan.id_lesson"
                >
                  <v-list-item-title>{{ plan.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
  
            </v-expansion-panel-text>
  
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import AthleteNav from "../components/AthleteNav.vue";
  import Utils from "../config/utils.js";
  import teamServices from "../services/teamServices.js";
  
  const teams = ref([]);
  const loading = ref(true);
  const openPanels = ref([]);
  
  const user = Utils.getStore("user");
  
  const loadTeams = async () => {
    loading.value = true;
  
    try {
      const res = await teamServices.getUserTeams(user.id_user);
  
      teams.value = await Promise.all(
        res.data.map(async (entry) => {
          const team = entry.team;
  
          // Load members
          const membersRes = await teamServices.getTeamMembers(team.id_team);
          const members = membersRes.data.map((m) => m.user || m);
  
          // Load plans
          const plansRes = await teamServices.getTeamPlans(team.id_team);
          const plans = plansRes.data.map((p) => p.lesson || p);
  
          return {
            ...team,
            members,
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
  
  onMounted(() => {
    loadTeams();
  });
  </script>
  