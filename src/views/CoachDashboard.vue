<template>
  <v-app>
    <CoachNav />

    <v-container fluid class="pa-8 mt-12">

      <!-- =======================
           HEADER: WELCOME TOP
      ======================== -->
      <v-row class="mb-6">
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-1">
            Welcome back, Coach {{ coachName }}
          </h1>
          <p class="text-medium-emphasis mb-0">
            Training management & athlete development tools.
          </p>
        </v-col>
      </v-row>


      <!-- =======================
           PROFILE + TEAMS ROW
      ======================== -->
      <v-row class="align-start mb-10">

        <!-- Profile Card (Left) -->
        <v-col cols="12" md="5" lg="4">
          <v-card elevation="4" class="pa-5 rounded-lg h-100">
            <div class="d-flex align-center">
              <v-avatar size="88" class="mr-4" v-if="user?.picture">
                <img :src="user.picture" alt="Profile" />
              </v-avatar>

              <div>
                <h2 class="text-h6 font-weight-bold mb-1">{{ coachName }}</h2>
                <div class="text-medium-emphasis text-body-2">Coach Dashboard</div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Teams Preview (Right of Profile) -->
        <v-col cols="12" md="7" lg="8">
          <v-card class="pa-6 h-100" elevation="4">

            <div class="d-flex align-center justify-space-between mb-4">
              <h3 class="text-h6 mb-0">Your Teams</h3>

              <v-btn size="small" variant="text" color="primary" @click="go('/coach/teams')">
                View All
              </v-btn>
            </div>

            <!-- If no teams -->
            <div v-if="!teams.length" class="text-medium-emphasis">
              No teams created yet.
            </div>

            <!-- Teams List -->
            <v-list v-else class="pa-0">
              <v-list-item
                v-for="team in teams.slice(0, 4)"
                :key="team.id_team"
                class="rounded-lg mb-1"
              >
                <v-list-item-title class="font-weight-medium">
                  {{ team.name }}
                </v-list-item-title>

                <v-list-item-subtitle v-if="team.player_count">
                  {{ team.player_count }} athletes
                </v-list-item-subtitle>

                <v-list-item-subtitle v-else class="text-medium-emphasis">
                  {{ team.description }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

          </v-card>
        </v-col>

      </v-row>



      <!-- =======================
           QUICK ACTIONS
      ======================== -->
      <v-row class="mb-8">
        <v-col cols="12">
          <div class="d-flex flex-wrap">
            <v-chip class="ma-2 px-4 py-3" color="primary" @click="go('/coach/teams')" size="large" elevated>
              <v-icon left>mdi-account-plus</v-icon>
              Add Team
            </v-chip>

            <v-chip class="ma-2 px-4 py-3" color="primary" @click="go('/coach/plans')" size="large" elevated>
              <v-icon left>mdi-file-plus</v-icon>
              Add Exercise Plan
            </v-chip>

            <v-chip class="ma-2 px-4 py-3" color="primary" @click="go('/coach/goals')" size="large" elevated>
              <v-icon left>mdi-target</v-icon>
              Add Goal
            </v-chip>
          </div>
        </v-col>
      </v-row>



      <!-- =======================
           FEATURE CARDS
      ======================== -->
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="card in cards" :key="card.title">
          <v-card elevation="6" class="pa-6 rounded-xl hoverable" @click="go(card.route)">
            <div class="d-flex align-start">
              <v-icon size="48" color="primary" class="mr-4">
                {{ card.icon }}
              </v-icon>

              <div>
                <h3 class="text-h6 font-weight-bold mb-1">{{ card.title }}</h3>
                <p class="text-medium-emphasis text-body-2 mb-0">{{ card.description }}</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </v-app>
</template>






<script>
import CoachNav from "../components/CoachNav.vue";
import Utils from "../config/utils";
import TeamServices from "../services/teamServices";

export default {
  name: "CoachDashboard",
  components: { CoachNav },

  data() {
    const user = Utils.getStore("user");

    return {
      user,
      coachName: user ? `${user.fName} ${user.lName}` : "Coach",

      teams: [], // <-- ADDED

      cards: [
        { title: "View Athletes", icon: "mdi-account-multiple-outline", route: "/coach/athletes", description: "View athlete profiles" },
        { title: "Add Athlete", icon: "mdi-account-plus", route: "/coach/athlete/add", description: "Add a new athlete" },
        { title: "Teams", icon: "mdi-account-group", route: "/coach/teams", description: "View and manage team rosters" },
        { title: "View Exercise Plans", icon: "mdi-clipboard-list", route: "/coach/plans", description: "Select a training lesson" },
        { title: "Manage Goals", icon: "mdi-target", route: "/coach/goals", description: "Add/Edit/Delete athlete goals" },
      ],
    };
  },

  methods: {
    go(route) {
      this.$router.push(route);
    },

    async fetchTeams() {
      try {
        const res = await TeamServices.getAllTeams();
        console.log("TEAMS RESPONSE →", res.data);
        this.teams = res.data || [];
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      }
    }




  },

  mounted() {
    this.fetchTeams();
  },
};
</script>



<style scoped>
.hoverable {
  transition: transform 220ms ease, box-shadow 220ms ease;
}
.hoverable:hover {
  cursor: pointer;
  transform: translateY(-6px);
  box-shadow: 0px 12px 24px rgba(0,0,0,0.18);
}

.hoverable-list {
  transition: background 180ms ease;
}
.hoverable-list:hover {
  background: rgba(0,0,0,0.06);
  cursor: pointer;
}
</style>
