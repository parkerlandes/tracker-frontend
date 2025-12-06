<template>
  <v-app>
    <CoachNav />

    <h1 class="text-h5 font-weight-bold mb-6"></h1>

    <v-container fluid class="pa-8 mt-12">
      <!-- =======================
           HEADER: WELCOME
      ======================== -->
      <v-row class="mb-8">
        <v-col cols="12" class="text-left">
          <h1 class="text-h4 font-weight-bold">
            Welcome back, Coach {{ coachName }}
          </h1>
        </v-col>
      </v-row>

      <!-- ==================================================
           MAIN ROW: LEFT COLUMN (PROFILE + ACTIONS)
                     RIGHT COLUMN (TEAMS)
      ================================================== -->
      <v-row class="mb-10">
        <!-- LEFT COLUMN -->
        <v-col cols="12" md="4" lg="3">
          <!-- Profile Card -->
          <v-card elevation="4" class="pa-5 rounded-lg mb-6">
            <div class="d-flex align-start">
              <v-avatar size="88" class="mr-4" v-if="user?.picture">
                <img :src="user.picture" alt="Profile" />
              </v-avatar>

              <div>
                <h2 class="text-h6 font-weight-bold mb-1">{{ coachName }}</h2>
                <div class="text-medium-emphasis text-body-2">
                  Coach Dashboard
                </div>
              </div>
            </div>
          </v-card>

          <!-- Quick Actions -->
          <v-card elevation="4" class="pa-4 rounded-lg">
            <h3 class="text-h6 font-weight-bold mb-3">Quick Actions</h3>

            <div class="d-flex flex-column">
              <v-chip
                class="mb-3 px-4 py-3"
                color="primary"
                size="large"
                elevated
                @click="go('/coach/teams')"
              >
                <v-icon left>mdi-account-plus</v-icon>
                Add Team
              </v-chip>

              <v-chip
                class="mb-3 px-4 py-3"
                color="primary"
                size="large"
                elevated
                @click="go('/coach/plans')"
              >
                <v-icon left>mdi-file-plus</v-icon>
                Add Exercise Plan
              </v-chip>

              <v-chip
                class="px-4 py-3"
                color="primary"
                size="large"
                elevated
                @click="go('/coach/goals')"
              >
                <v-icon left>mdi-target</v-icon>
                Add Goal
              </v-chip>
            </div>
          </v-card>
        </v-col>

        <!-- RIGHT COLUMN: TEAMS -->
        <v-col cols="12" md="8" lg="9">
          <v-card elevation="4" class="pa-6 rounded-lg h-100">
            <div class="d-flex align-center justify-space-between mb-4">
              <h3 class="text-h6 mb-0">Teams</h3>

              <v-btn
                size="small"
                variant="text"
                color="primary"
                @click="go('/coach/teams')"
              >
                View All
              </v-btn>
            </div>

            <!-- If NO teams -->
            <div v-if="!teams.length" class="text-medium-emphasis">
              No teams created yet.
            </div>

            <!-- If YES teams → scrollable container -->
            <div v-else class="teams-scroll">
              <v-list class="pa-0">
                <v-list-item
                  v-for="team in teams"
                  :key="team.id_team"
                  class="rounded-lg mb-2"
                >
                  <v-list-item-title class="font-weight-medium">
                    {{ team.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- ==========================================
           FEATURE CARDS (SEPARATE CONTAINER BELOW)
      ========================================== -->
      <v-card elevation="4" class="pa-6 rounded-xl">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="card in cards"
            :key="card.title"
          >
            <v-card
              elevation="6"
              class="pa-6 rounded-xl hoverable mb-6"
              @click="go(card.route)"
            >
              <div class="d-flex align-start">
                <v-icon size="48" color="primary" class="mr-4">
                  {{ card.icon }}
                </v-icon>

                <div>
                  <h3 class="text-h6 font-weight-bold mb-1">
                    {{ card.title }}
                  </h3>
                  <p class="text-medium-emphasis text-body-2 mb-0">
                    {{ card.description }}
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
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
        {
          title: "View Athletes",
          icon: "mdi-account-multiple-outline",
          route: "/coach/athletes",
          description: "View athlete profiles",
        },
        {
          title: "Add Athlete",
          icon: "mdi-account-plus",
          route: "/coach/athlete/add",
          description: "Add a new athlete",
        },
        {
          title: "Teams",
          icon: "mdi-account-group",
          route: "/coach/teams",
          description: "View and manage team rosters",
        },
        {
          title: "View Exercise Plans",
          icon: "mdi-clipboard-list",
          route: "/coach/plans",
          description: "Select a training lesson",
        },
        {
          title: "Manage Goals",
          icon: "mdi-target",
          route: "/coach/goals",
          description: "Add/Edit/Delete athlete goals",
        },
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
    },
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
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.18);
}

.hoverable-list {
  transition: background 180ms ease;
}
.hoverable-list:hover {
  background: rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.teams-scroll {
  max-height: 270px; /* adjust as needed */
  overflow-y: auto;
  padding-right: 6px; /* avoid content touching scrollbar */
}

/* Optional: nice scrollbar */
.teams-scroll::-webkit-scrollbar {
  width: 6px;
}
.teams-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
</style>
