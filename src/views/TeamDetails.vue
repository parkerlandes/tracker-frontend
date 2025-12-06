<script>
import AthleteNav from "../components/AthleteNav.vue";
import CoachNav from "../components/CoachNav.vue";
import TeamServices from "../services/teamServices";
import UserServices from "../services/userServices";
import Utils from "../config/utils";

export default {
  name: "TeamDetails",
  components: { AthleteNav, CoachNav },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    const user = Utils.getStore("user");
    return {
      user,
      team: null,
      members: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    isCoach() {
      return this.user?.role === "coach";
    },
  },
  mounted() {
    this.loadTeam();
  },
  methods: {
    async loadTeam() {
      this.loading = true;
      this.error = null;
      try {
        const teamId = this.id;
        const { data: team } = await TeamServices.getTeam(teamId);
        this.team = team;

        const { data: memberships } = await TeamServices.getTeamMembers(teamId);
        const memberPromises = memberships.map(async (m) => {
          const { data: member } = await UserServices.getUser(m.id_user);
          return member;
        });
        this.members = await Promise.all(memberPromises);
      } catch (err) {
        console.error(err);
        this.error = "Failed to load team details.";
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

    <h1 class="text-h5 font-weight-bold mb-6"></h1>

    <v-container class="pa-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()" class="mb-4">
        Back
      </v-btn>

      <div v-if="loading">Loading team…</div>
      <div v-else-if="error" class="text-error">{{ error }}</div>
      <div v-else-if="!team">Team not found.</div>
      <div v-else>
        <v-card class="pa-6 mb-4" elevation="3">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h5 mb-1">{{ team.name }}</h1>
              <div class="text-medium-emphasis">{{ team.description || "No description." }}</div>
            </div>
            <v-chip color="primary" text-color="white">Team</v-chip>
          </div>
        </v-card>

        <v-card class="pa-6" elevation="3">
          <h2 class="text-h6 mb-4">Players</h2>
          <div v-if="!members.length" class="text-medium-emphasis">No players assigned.</div>
          <v-list v-else>
            <v-list-item v-for="member in members" :key="member.id_user">
              <v-list-item-avatar color="primary" class="text-white">
                <span>{{ member.fName?.[0] }}{{ member.lName?.[0] }}</span>
              </v-list-item-avatar>
              <v-list-item-title>{{ member.fName }} {{ member.lName }}</v-list-item-title>
              <v-list-item-subtitle>{{ member.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </v-container>
  </div>
</template>
