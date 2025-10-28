<template>
    <v-app-bar app color="primary" dark elevate-on-scroll>
      <v-container>
        <v-row align="center" justify="space-between">
          <!-- Left: App title -->
          <v-col cols="auto">
            <v-btn variant="text" class="text-white text-h6" @click="goHome">
              <v-icon left>mdi-dumbbell</v-icon> Exercise Tracker
            </v-btn>
          </v-col>
  
          <!-- Right: Navigation links -->
          <v-col cols="auto">
            <v-btn
              v-for="item in navItems"
              :key="item.title"
              text
              class="text-white"
              @click="go(item.route)"
            >
              <v-icon left>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-btn>
  
            <v-btn icon color="white" @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </template>
  
  <script>
  import Utils from "../config/utils";
  
  export default {
    name: "TopNav",
    props: {
      navItems: {
        type: Array,
        required: true,
      },
    },
    methods: {
      go(route) {
        this.$router.push(route);
      },
      goHome() {
        const role = Utils.getStore("selectedRole");
        if (role === "coach") this.$router.push("/coach");
        else this.$router.push("/athlete");
      },
      logout() {
        Utils.removeItem("user");
        Utils.removeItem("selectedRole");
        this.$router.push("/start");
      },
    },
  };
  </script>
  