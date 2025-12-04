<template>
  <v-card class="pa-6 h-100" elevation="3">
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6 mb-0">Goals</h3>

      <v-btn size="small" variant="text" color="primary" @click="goToGoals">
        Manage
      </v-btn>
    </div>

    <v-alert v-if="!goals.length" type="info" class="mb-4">
      No goals yet — add one!
    </v-alert>

    <v-list v-else>
      <v-list-item v-for="g in goals" :key="g.id_player_goal">
        <v-list-item-title>{{ g.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-btn
      block
      color="primary"
      variant="elevated"
      class="mt-4"
      @click="goToGoals"
    >
      Add Goal
    </v-btn>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import goalServices from "../services/goalServices.js";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  athleteId: Number
});

const goals = ref([]);

const goToGoals = () => {
  router.push("/athlete/goals");
};

onMounted(async () => {
  if (!props.athleteId) return;
  const res = await goalServices.getUserGoals(props.athleteId);
  goals.value = res.data;
});
</script>
