<template>
  <v-app-bar app color="primary" dark elevate-on-scroll>
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <v-btn variant="text" class="text-white text-h6" @click="goHome">
            <v-avatar
              v-if="user?.picture"
              size="32"
              class="mr-2"
              :image="user.picture"
            />
            <v-icon left v-else>mdi-dumbbell</v-icon>
            Fitness - Tracker
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
    const user = Utils.getStore("user") || {};
    return { 
      user,
      navItems: [
          { title: "Athletes", icon: "mdi-account-multiple-outline", route: "/athletes" },
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
    goHome() {
      const user = Utils.getStore("user");
      const role = user?.role;
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
