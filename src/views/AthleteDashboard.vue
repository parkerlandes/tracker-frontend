<template>
    <v-app>
      <TopNav :nav-items="navItems" />
  
      <v-container fluid class="pa-8 mt-12">
        <h1>Welcome, {{ athleteName }}</h1>
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
  import TopNav from "../components/TopNav.vue";
  
  export default {
    name: "AthleteDashboard",
    components: { TopNav },
    data() {
      return {
        athleteName: "Jordan Smith",
        navItems: [
          { title: "My Profile", icon: "mdi-account-circle", route: "/profile" },
          { title: "My Goals", icon: "mdi-target", route: "/goals" },
          { title: "Record Exercise", icon: "mdi-pencil", route: "/exercises/add" },
          { title: "Progress", icon: "mdi-chart-line", route: "/progress" },
        ],
        cards: [
          { title: "Record Workout", icon: "mdi-pencil", route: "/exercises/add" },
          { title: "View Goals", icon: "mdi-target", route: "/goals" },
          { title: "Progress Charts", icon: "mdi-chart-line", route: "/progress" },
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
  
  