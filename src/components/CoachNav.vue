<template>
  <v-app-bar
    app
    height="72"
    class="coach-nav-bar"
    elevate-on-scroll
  >
    <v-container>
      <v-row align="center" justify="space-between" no-gutters>

        <!-- BRAND / LOGO -->
        <v-col cols="auto">
          <div class="brand-btn" @click="goHome">
            <v-avatar size="40" class="mr-3" v-if="user?.picture">
              <img :src="user.picture" />
            </v-avatar>

            <v-avatar size="40" class="mr-3 icon-avatar" v-else>
              <v-icon size="26" color="white">mdi-dumbbell</v-icon>
            </v-avatar>

            <span class="brand-text">Tracker</span>
          </div>
        </v-col>

        <!-- NAV LINKS -->
        <v-col cols="auto">
          <div class="nav-links">
            <v-btn
              v-for="item in navItems"
              :key="item.title"
              class="nav-pill"
              variant="text"
              @click="go(item.route)"
            >
              <v-icon size="20" class="mr-1">{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-btn>

            <!-- Logout -->
            <v-btn icon class="logout-btn" @click="logout">
              <v-icon size="26">mdi-logout</v-icon>
            </v-btn>
          </div>
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
        { title: "Athletes", icon: "mdi-account-multiple-outline", route: "/coach/athletes" },
        { title: "Teams", icon: "mdi-account-group", route: "/coach/teams" },
        { title: "Exercise Plans", icon: "mdi-dumbbell", route: "/coach/plans" },
        { title: "Goals", icon: "mdi-target", route: "/coach/goals" },
        { title: "Progress", icon: "mdi-chart-line", route: "/coach/progress" },
      ],
    };
  },
  methods: {
    go(route) {
      this.$router.push(route);
    },
    goHome() {
      const role = Utils.getStore("user")?.role;
      this.$router.push(role === "coach" ? "/coach" : "/athlete");
    },
    logout() {
      Utils.removeItem("user");
      Utils.removeItem("selectedRole");
      this.$router.push("/start");
    },
  },
};
</script>

<style scoped>
/* Glass + Coach Gradient */
.coach-nav-bar {
  backdrop-filter: blur(18px);
  background: linear-gradient(
    130deg,
    rgb(167, 167, 167),
    rgb(255, 255, 255),
    rgb(167, 167, 167)
  ) !important;
  
  
}

/* Brand */
.brand-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 12px;
  padding: 6px 14px;
  transition: background 0.25s ease;
}

.brand-btn:hover {
  /* background: rgba(255, 255, 255, 0.15); */
  background: #00000029;
}

.brand-text {
  font-family: var(--v-font-family);
  font-size: 1rem;               /* same as default v-btn text */
  font-weight: 500;                  /* v-btn default weight */
  letter-spacing: 0.0892857143em;    /* v-btn default tracking */
  text-transform: uppercase;         /* if you want it to match button text */
  color: rgb(0, 0, 0);
}

.icon-avatar {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-pill {
  color: rgb(0, 0, 0) !important;
  font-weight: 500;
  border-radius: 24px;
  padding: 6px 18px;
  transition: background 0.25s ease, transform 0.2s ease;
  backdrop-filter: blur(6px);
}
.nav-pill:hover {
  /* background: rgba(255, 42, 42, 0.2); */
  background: #00000029;
  transform: translateY(-2px);
}

/* Logout Button */
.logout-btn {
  color: rgb(0, 0, 0) !important;
  transition: transform 0.25s ease, color 0.25s ease;
}

.logout-btn:hover {
  transform: scale(1.25);
  /* color: #ffdddd !important; */
  color: #00000029;
}
</style>
