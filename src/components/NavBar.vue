<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Exercise Tracker</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        this.$store.dispatch("logout");
        this.$router.push("/login");
      },
    },
  };
  </script>
  