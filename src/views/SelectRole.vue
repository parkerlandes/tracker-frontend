<template>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="pa-6 text-center" elevation="4" max-width="400">
        <h2>Select Your Role</h2>
        <p class="mb-4">Are you a coach or an athlete?</p>
  
        <v-btn color="primary" block class="mb-2" @click="selectRole('coach')">
          I am a Coach
        </v-btn>
        <v-btn color="secondary" block @click="selectRole('athlete')">
          I am an Athlete
        </v-btn>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import Utils from "../config/utils";
  
  export default {
    name: "SelectRole",
    methods: {
      selectRole(role) {
        Utils.setStore("selectedRole", role);
        this.$router.push("/google-auth");
      },
    },
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  