<template>
  <v-card class="pa-4" elevation="3">
    <div class="d-flex align-center justify-space-between mb-3">
      <h3 class="text-h6 mb-0">Teams</h3>
      <v-btn size="small" variant="text" color="primary" @click="goToTeams">
        View all
      </v-btn>
    </div>

    
    <div v-if="loading" class="text-medium-emphasis">Loading teams…</div>
    <div v-else-if="error" class="text-error">{{ error }}</div>
    <div v-else-if="!teams.length" class="text-medium-emphasis">No teams yet.</div>
    <v-list v-else density="compact">
      <v-list-item
        v-for="team in limitedTeams"
        :key="team.id_team"
        class="rounded mb-2"
        color="secondary"
        @click="goToTeam(team.id_team)"
        role="button"
      >
        <v-list-item-avatar color="primary" class="text-white">
          <span class="text-subtitle-2">{{ initials(team.name) }}</span> 
        </v-list-item-avatar>
        <v-list-item-title>{{ team.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ team.description }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TeamServices from "../services/teamServices";
import Utils from "../config/utils";

const router = useRouter();

const user = ref(Utils.getStore("user"));
const teams = ref([]);
const loading = ref(false);
const error = ref(null);

const limitedTeams = computed(() => teams.value.slice(0, 3));

const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

const fetchTeams = async () => {
  if (!user.value?.id_user) {
    error.value = "No athlete found.";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const { data: memberships } = await TeamServices.getUserTeams(user.value.id_user);
    const teamPromises = memberships.map(async (m) => {
      const { data: team } = await TeamServices.getTeam(m.id_team);
      return team;
    });
    teams.value = await Promise.all(teamPromises);
  } catch (err) {
    console.error(err);
    error.value = "Failed to load teams.";
  } finally {
    loading.value = false;
  }
};

const goToTeams = () => {
  Utils.navigate(router, "/teams");
};

const goToTeam = (id_team) => {
  Utils.navigate(router, `/teams/${id_team}`);
};

onMounted(fetchTeams);
</script>
