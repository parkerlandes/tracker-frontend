<script>
import AthleteNav from "../components/AthleteNav.vue";
import CoachNav from "../components/CoachNav.vue";
import Utils from "../config/utils.js";
import TeamServices from "../services/teamServices.js";

export default {
  name: "Teams",
  components: { AthleteNav, CoachNav },
  data() {
    const user = Utils.getStore("user");
    return {
      user,
      role: user?.role,
      teams: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    isCoach() {
      return this.role === "coach";
    },
  },
  mounted() {
    this.fetchTeams();
  },
  methods: {
    async fetchTeams() {
      if (!this.user?.id_user) {
        this.error = "No user found.";
        return;
      }
      this.loading = true;
      try {
        const { data: memberships } = await TeamServices.getUserTeams(this.user.id_user);
        const teamPromises = memberships.map(async (m) => {
          const { data: team } = await TeamServices.getTeam(m.id_team);
          return team;
        });
        this.teams = await Promise.all(teamPromises);
      } catch (err) {
        console.error(err);
        this.error = "Failed to load teams.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <div>
    <CoachNav v-if="isCoach" />
    <AthleteNav v-else />

    <v-container class="pa-6">
      <h1>Your Teams</h1>
      <div v-if="loading">Loading…</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="!teams.length">No teams assigned.</div>
      <v-list v-else>
        <v-list-item v-for="team in teams" :key="team.id_team">
          <v-list-item-content>
            <v-list-item-title>{{ team.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ team.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>
