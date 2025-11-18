<template>
  <v-card class="pa-4" elevation="3">
    <div class="d-flex align-center justify-space-between mb-3">
      <h3 class="text-h6 mb-0">Goals</h3>
      <v-btn size="small" variant="text" color="primary" @click="goToGoals">
        Manage
      </v-btn>
    </div>

    <div v-if="loading" class="text-medium-emphasis">Loading goals…</div>
    <div v-else-if="error" class="text-error">{{ error }}</div>
    <div v-else-if="!goals.length" class="text-medium-emphasis">No goals set yet.</div>

    <v-list v-else density="compact">
      <v-list-item v-for="goal in limitedGoals" :key="goal.id_player_goal" class="rounded mb-2">
        <v-list-item-avatar color="primary" class="text-white">
          <v-icon>mdi-target</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>{{ goal.title || "Untitled Goal" }}</v-list-item-title>
        <v-list-item-subtitle>{{ goal.description || "Keep pushing!" }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-btn block size="small" color="primary" class="mt-2" variant="outlined" @click="goToGoals">
      Add goal
    </v-btn>
  </v-card>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import GoalServices from "../services/goalServices";
import Utils from "../config/utils";

const router = useRouter();

const user = ref(Utils.getStore("user"));
const goals = ref([]);
const loading = ref(false);
const error = ref(null);

const limitedGoals = computed(() => goals.value.slice(0, 4));

const fetchGoals = async () => {
  if (!user.value || !user.value.id_user) {
    error.value = "No athlete found.";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const { data } = await GoalServices.getUserGoals(user.value.id_user);
    goals.value = data || [];
  } catch (err) {
    console.error(err);
    error.value = "Failed to load goals.";
  } finally {
    loading.value = false;
  }
};

const goToGoals = () => {
  Utils.navigate(router, "/goals");
};

onMounted(fetchGoals);
</script>
