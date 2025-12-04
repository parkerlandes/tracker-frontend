<template>
  <v-app>
    <CoachNav />

    <v-container fluid class="pa-8 mt-12">

      <!-- HEADER -->
      <v-row class="align-center mb-6">
        <v-col cols="8">
          <h1 class="text-h4 font-weight-bold">Welcome, Coach {{ coachName }}</h1>
          <div class="text-medium-emphasis">Training management & athlete development tools.</div>
        </v-col>

        <v-col cols="4" class="text-right">
          <v-avatar size="64">
            <img src="/assets/coachAvatar.png" alt="Coach"/>
          </v-avatar>
        </v-col>
      </v-row>

      <!-- QUICK ACTIONS -->
      <v-row class="mt-3 mb-10">
        <v-chip class="ma-2" color="primary" @click="go('/coach/teams')" size="large">
          <v-icon left>mdi-account-plus</v-icon> Add Team
        </v-chip>

        <v-chip class="ma-2" color="primary" @click="go('/coach/plans')" size="large">
          <v-icon left>mdi-file-plus</v-icon> Add Exercise Plan
        </v-chip>

        <v-chip class="ma-2" color="primary" @click="go('/coach/goals')" size="large">
          <v-icon left>mdi-target</v-icon> Add Goal
        </v-chip>
      </v-row>

      <!-- FEATURE CARDS -->
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="card in cards" :key="card.title">
          <v-card class="pa-6 hoverable" elevation="6" rounded="xl" @click="go(card.route)">
            <v-row no-gutters>
              <v-col cols="3" class="d-flex align-center justify-center">
                <v-icon size="48" color="primary">{{ card.icon }}</v-icon>
              </v-col>
              <v-col cols="9">
                <h3 class="font-weight-bold">{{ card.title }}</h3>
                <p class="text-medium-emphasis text-body-2">{{ card.description }}</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      
    </v-container>
  </v-app>
</template>


<script>
import CoachNav from "../components/CoachNav.vue";
import Utils from "../config/utils";

export default {
  name: "CoachDashboard",
  components: { CoachNav },
  data() {
    const user = Utils.getStore("user");
    return {
      coachName: user ? `${user.fName} ${user.lName}` : "Coach",

      cards: [
        // ATHLETES
        { 
          title: "View Athletes",
          icon: "mdi-account-multiple-outline",
          route: "/coach/athletes",
          description: "View athlete profiles"
        },
        { 
          title: "Add Athlete",
          icon: "mdi-account-plus",
          route: "/coach/athlete/add",
          description: "Add a new athlete"
        },
        {
          title: "Teams",
          icon: "mdi-account-group",
          route: "/coach/teams",
          description: "View and manage team rosters",
        },

        // EXERCISE PLANS
        {
          title: "View Exercise Plans",
          icon: "mdi-clipboard-list",
          route: "/coach/plans",
          description: "Select a training lesson"
        },
        // EXERCISES
        { 
          title: "View Exercises",
          icon: "mdi-dumbbell",
          route: "/coach/exercises",
          description: "View exercise definitions"
        },

        // GOALS
        { 
          title: "Manage Goals",
          icon: "mdi-target",
          route: "/goals",
          description: "Add/Edit/Delete athlete goals"
        },

        // RESULTS + PROGRESS
        { 
          title: "Progress",
          icon: "mdi-chart-line",
          route: "/analytics",
          description: "View athlete progress trends"
        },
      ],

      
    };
  },
  methods: {
    go(route) {
      this.$router.push(route);
    },
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
