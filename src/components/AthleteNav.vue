<template>
  <v-app-bar
    app
    height="72"
    class="athlete-nav-bar"
    elevate-on-scroll
  >
    <v-container>
      <v-row align="center" justify="space-between" no-gutters>

        <!-- BRAND / LOGO -->
        <v-col cols="auto">
          <div class="d-flex align-center brand-btn" @click="goHome">
            <v-avatar size="40" class="mr-3" v-if="user.picture">
              <img :src="user.picture" />
            </v-avatar>

            <v-avatar size="40" class="mr-3 icon-avatar" v-else>
              <v-icon size="26" color="white">mdi-dumbbell</v-icon>
            </v-avatar>

            <span class="brand-text">Tracker – Athlete</span>
          </div>
        </v-col>

        <!-- NAV BUTTONS -->
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

            <!-- Logout Button -->
            <v-btn icon class="logout-btn" @click="logout">
              <v-icon size="24">mdi-logout</v-icon>
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
  name: "AthleteNav",
  data() {
    const user = Utils.getStore("user");
    return {
      user,
      navItems: [
        { title: "Profile", icon: "mdi-account-circle", route: "/athlete/profile" },
        { title: "Teams", icon: "mdi-account-group", route: "/teams" },
        { title: "Workout Catalog", icon: "mdi-dumbbell", route: "/athlete/workouts" },
        { title: "Goals", icon: "mdi-target", route: "/athlete/goals" },
        { title: "Progress", icon: "mdi-chart-line", route: "/athlete/progress" },
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
/* GLASS + GRADIENT BAR */
.athlete-nav-bar {
  backdrop-filter: blur(18px);
  background: linear-gradient(
    135deg,
    rgb(0, 0, 0),
    rgba(252, 252, 252, 0.85)
  ) !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
}

/* BRAND BUTTON */
.brand-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 12px;
  transition: background 0.25s ease;
}

.brand-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.brand-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
  letter-spacing: 0.5px;
}

/* ICON AVATAR for default user */
.icon-avatar {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
}

/* NAV ITEMS */
.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-pill {
  color: white !important;
  font-weight: 500;
  border-radius: 20px;
  padding: 6px 16px;
  backdrop-filter: blur(6px);
  transition: background 0.25s ease, transform 0.2s ease;
}

.nav-pill:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

/* LOGOUT BUTTON */
.logout-btn {
  color: white !important;
  margin-left: 6px;
  transition: transform 0.2s ease, color 0.25s ease;
}

.logout-btn:hover {
  transform: scale(1.2);
  color: #ffdddd !important;
}
</style>
