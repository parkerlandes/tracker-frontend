<template>
    <v-app>
      <PlayerNav />
  
      <v-container fluid class="pa-8 mt-12">
        <h1>Welcome, {{ playerName }}</h1>
        <p class="text-medium-emphasis mb-6">
          Track your workouts, view progress, and crush your goals.
        </p>
  
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="card in cards" :key="card.title">
            <v-card class="pa-6 text-center hoverable" elevation="3" @click="go(card.route)">
              <v-icon size="48" color="secondary">{{ card.icon }}</v-icon>
              <h3 class="mt-3">{{ card.title }}</h3>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import PlayerNav from "../components/PlayerNav.vue";
  
  export default {
    name: "PlayerDashboard",
    components: { PlayerNav },
    data() {
      return {
        playerName: "Jordan Smith",
        cards: [
          { title: "Profile", icon: "mdi-account-circle", route: "/profile" },
          { title: "Teams", icon: "mdi-sitemap", route: "/teams" },
          { title: "Workout", icon: "mdi-dumbbell", route: "/workout" },
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
  
  
  