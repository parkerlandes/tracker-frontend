<template>
  <v-app-bar app color="primary" dark elevate-on-scroll>
    <v-container>
      <v-row align="center" justify="space-between">
        <!-- Left: App title -->
        <v-col cols="auto">
          <v-btn variant="text" class="text-white text-h6" @click="goHome">
            <v-icon left>mdi-dumbbell</v-icon> Tracker
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
  name: "CoachNav",
  data() {
    return {
      navItems: [
      { title: "Players", icon: "mdi-account-group", route: "/players" },
        { title: "Teams", icon: "mdi-sitemap", route: "/teams" },
        { title: "Lessons", icon: "mdi-calendar-edit", route: "/lessons" },
        { title: "Goals", icon: "mdi-target", route: "/goals" },
      ],
    };
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
