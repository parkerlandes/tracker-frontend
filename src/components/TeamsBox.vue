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

    <v-expansion-panels v-else v-model="openPanels" multiple>
      <v-expansion-panel
        v-for="team in limitedTeams"
        :key="team.id_team"
      >
        <v-expansion-panel-title>
          <v-avatar color="primary" size="32" class="mr-3 text-white">
            <span class="text-subtitle-2">{{ initials(team.name) }}</span>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="font-weight-medium">{{ team.name }}</div>
            <div class="text-medium-emphasis text-caption">
              {{ team.description || "No description" }}
            </div>
          </div>

          <v-chip class="ma-1" variant="outlined" color="secondary">
            {{ team.members?.length || 0 }} athletes
          </v-chip>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
        
          <v-alert
            v-if="!team.members?.length"
            type="info"
            variant="tonal"
            class="mb-2"
          >
            No teammates listed.
          </v-alert>

          <v-list v-else density="compact">
            <v-list-item
              v-for="member in team.members"
              :key="member.id_user"
              class="rounded"
            >
              <template #prepend>
                <v-avatar color="blue">
                  <span class="text-white">
                    {{ initials(member.fName + ' ' + member.lName) }}
                  </span>
                </v-avatar>
              </template>
              <v-list-item-title>
                {{ member.fName }} {{ member.lName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ member.email }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
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
const openPanels = ref([]);

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
    const { data: memberships } = await TeamServices.getUserTeams(
      user.value.id_user
    );
    const teamPromises = memberships.map(async (m) => {
      // API returns either { team } objects or plain team records
      const baseTeam = m.team || m;
      const teamId = baseTeam.id_team || m.id_team;

      // Ensure we have full team details
      const { data: team } = await TeamServices.getTeam(teamId);

      // Load teammates
      const { data: memberRes } = await TeamServices.getTeamMembers(teamId);
      const members = memberRes.map((entry) => entry.user || entry);

      return { ...team, members };
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
