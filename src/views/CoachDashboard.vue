<template>
    <v-app>
      <CoachNav />
  
      <v-container fluid class="pa-8 mt-12">
        <v-row>
          <v-col cols="12">
            <h1>Welcome, {{ coachName }}</h1>
            <p class="text-medium-emphasis mb-6">
              Manage players, teams, and lessons below.
            </p>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="card in cards" :key="card.title">
            <v-card class="pa-6 text-center hoverable" elevation="3" @click="go(card.route)">
              <v-icon size="48" color="primary">{{ card.icon }}</v-icon>
              <h3 class="mt-3">{{ card.title }}</h3>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import CoachNav from "../components/CoachNav.vue";
  
  export default {
    name: "CoachDashboard",
    components: { CoachNav },
    data() {
      return {
        coachName: "Coach Taylor",
        cards: [
          { title: "Players", icon: "mdi-account-multiple-outline", route: "/players" },
          { title: "Teams", icon: "mdi-account-group", route: "/teams" },
          { title: "Catalog", icon: "mdi-dumbbell", route: "/catalog" },
          { title: "Goals", icon: "mdi-target", route: "/goals" },
          { title: "Progress", icon: "mdi-chart-line", route: "/progress" },
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
  .hoverable:hover {
    cursor: pointer;
    transform: scale(1.03);
    transition: 0.2s ease-in-out;
  }
  </style>

{ title: "Players", icon: "mdi-account-group", route: "/players" },
{ title: "Teams", icon: "mdi-sitemap", route: "/teams" },
{ title: "Progress", icon: "mdi-chart-line", route: "/progress" },
{ title: "Catalog", icon: "mdi-calendar-edit", route: "/catalog" },
{ title: "Lessons", icon: "mdi-calendar-edit", route: "/lessons" },
{ title: "Exercises", icon: "mdi-calendar-edit", route: "/exercises" },
{ title: "Goals", icon: "mdi-target", route: "/goals" },

  
  
  