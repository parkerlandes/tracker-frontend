<template>
  <v-app>
    <AthleteNav />

    <v-container fluid class="pa-8 mt-12">
      <v-row>
        <v-col cols="12" md="5" lg="4">
          <v-card class="pa-6" elevation="4">
            <div class="d-flex align-center mb-4">
              <v-avatar size="96" class="mr-2" v-if="user?.picture">
                <img :src="user.picture" alt="Profile" />
              </v-avatar>
              <div>
                <h2 class="text-h5 mb-1">{{ athleteName }}</h2>
                <div class="text-medium-emphasis">Goat</div>
              </div>
            </div>
            
            <v-row class="text-medium-emphasis">
              <v-col cols="6">Height: {{ heightDisplay }}</v-col>
              <v-col cols="6">Weight: {{ weightDisplay }}</v-col>
              <v-col cols="12">Bio: {{ bioDisplay }}</v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="7" lg="8">
          <TeamsBox :athlete-id="user?.id_user" />
        </v-col>
      </v-row>

      <v-row class="mt-1" align="stretch">
        <v-col cols="12" md="4">
          <v-card class="pa-6 h-100" elevation="3">
            <div class="d-flex align-center justify-space-between mb-6">
              <h3 class="text-h6 mb-0">Progress</h3>
              <v-btn size="small" variant="text" color="primary" @click="go('/athlete/progress')">
                View
              </v-btn>
            </div>
            <v-select
              v-if="goals.length"
              v-model="selectedGoalId"
              :items="goals"
              item-value="id_player_goal"
              item-title="title"
              label="Select goal"
              density="comfortable"
              class="mb-4"
              hide-details
            />

            <div class="text-center">
              <v-progress-circular
                :model-value="progressPercent"
                :size="140"
                :width="12"
                color="primary"
                class="mb-3"
              >
                {{ Math.round(progressPercent) }}%
              </v-progress-circular>
              <div class="text-subtitle-1">{{ primaryGoalTitle }}</div>
              <div class="text-medium-emphasis">Latest update: {{ latestMetricDate }}</div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <GoalsBox :athlete-id="user?.id_user" />
        </v-col>

        <v-col cols="12" md="4">
          <LessonBox :athlete-id="user?.id_user" />
        </v-col>
      </v-row>

      <v-row class="mt-6">
        <v-col cols="12" class="text-right">
          <v-btn color="primary" size="large" variant="elevated" @click="go('/athlete/progress')">
            View progress
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
//REPLACE THE INITIALS IN THE LESSONS & SUCH TO DISPLAY IMAGES STORED BY THE USERS

import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AthleteNav from "../components/AthleteNav.vue";
import TeamsBox from "../components/TeamsBox.vue";
import GoalsBox from "../components/GoalsBox.vue";
import LessonBox from "../components/LessonBox.vue";
import Utils from "../config/utils.js";
import progressServices from "../services/progressServices";
import GoalServices from "../services/goalServices";
import GoalProgressServices from "../services/playerGoalProgressServices";
import UserServices from "../services/userServices.js";

const services = {
  progress: progressServices,
  goals: GoalServices,
  goalProgress: GoalProgressServices,
};

const router = useRouter();

const user = ref(Utils.getStore("user"));
const metrics = ref([]);
const goals = ref([]);
const goalProgress = ref([]);
const selectedGoalId = ref(null);

const athleteName = computed(() =>
  user.value ? `${user.value.fName} ${user.value.lName}` : "Athlete"
);

const selectedGoal = computed(() => {
  if (!goals.value.length) return null;
  const match = goals.value.find((g) => g.id_player_goal === selectedGoalId.value);
  return match || goals.value[0];
});

const latestGoalProgress = computed(() => {
  if (!goalProgress.value.length) return null;
  // data sorted newest first
  return goalProgress.value[0];
});

const latestMetric = computed(() => {
  if (!metrics.value.length) return null;
  return metrics.value[metrics.value.length - 1];
});

const heightDisplay = computed(() => {
  const height = latestMetric.value?.height_cm;
  if (!height && height !== 0) return "--";
  const converted = Utils.cmToFeetInches(height);
  if (!converted) return `${height} cm`;
  return `${height} cm (${converted.feet}'${converted.inches}")`;
});

const weightDisplay = computed(() => {
  const weightKg = latestMetric.value?.weight_kg;
  if (!weightKg) return "--";
  const weightLbs = Utils.kgToLbs(weightKg);
  return `${weightKg} kg (${weightLbs} lbs)`;
});

const bioDisplay = computed(() => user.value?.bio || "Tell us about your goals.");

const progressPercent = computed(() => {
  const goal = selectedGoal.value;
  const metric = latestMetric.value;
  if (!goal || !metric) return 0;

  const exerciseMetricField = {
    1: "bench_press_lb", // Barbell Bench Press
    3: "squat_lb", // Back Squat
  };

  const targetWeight = goal.playerReps || goal.target_weight || goal.targetWeight;
  const metricField = exerciseMetricField[goal.id_exercise];
  const actualWeight = metricField ? metric[metricField] : null;

  if (targetWeight && actualWeight) {
    return Utils.clampPercent((actualWeight / targetWeight) * 100);
  }

  if (goal.playerTime && metric.mile_time_min) {
    return Utils.clampPercent((goal.playerTime / metric.mile_time_min) * 100);
  }

  return 0;
});

const primaryGoalTitle = computed(() => selectedGoal.value?.title || "Goal");

const latestMetricDate = computed(() => {
  if (!latestMetric.value?.recorded_at) return "No data";
  return new Date(latestMetric.value.recorded_at).toLocaleDateString();
});

const fetchMetrics = async () => {
  if (!user.value?.id_user) return;
  try {
    metrics.value = await Utils.fetchUserMetrics(user.value.id_user, services);
  } catch (err) {
    console.error("Failed to load metrics", err);
  }
};

const fetchGoalProgress = async (goalId) => {
  if (!goalId) return;
  try {
    goalProgress.value = await Utils.fetchGoalProgress(goalId, services);
  } catch (err) {
    console.error("Failed to load goal progress", err);
    goalProgress.value = [];
  }
};

const fetchGoals = async () => {
  if (!user.value?.id_user) return;
  try {
    goals.value = await Utils.fetchUserGoals(user.value.id_user, services);
    if (!goals.value.length) {
      selectedGoalId.value = null;
      goalProgress.value = [];
      return;
    }
    const initialId = selectedGoalId.value ?? goals.value[0].id_player_goal;
    selectedGoalId.value = initialId;
  } catch (err) {
    console.error("Failed to load goals", err);
  }
};

const go = (route) => {
  Utils.navigate(router, route);
};

onMounted(() => {
  // Refresh user to pick up profile edits (bio, etc.)
  (async () => {
    const storedUser = Utils.getStore("user");
    if (!storedUser?.id_user) return;
    try {
      const res = await UserServices.getUser(storedUser.id_user);
      if (res?.data) {
        user.value = { ...storedUser, ...res.data };
        Utils.setStore("user", user.value);
      }
    } catch (err) {
      console.error("Failed to refresh user profile", err);
    }
  })();

  fetchMetrics();
  fetchGoals();
});


watch(
  () => selectedGoalId.value,
  (newId) => {
    if (newId) {
      fetchGoalProgress(newId);
    } else {
      goalProgress.value = [];
    }
  }
);
</script>
