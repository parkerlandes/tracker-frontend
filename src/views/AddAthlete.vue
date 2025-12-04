<template>
    <v-container class="pa-8">
      <h1 class="text-h5 font-weight-bold mb-6">Add New Athlete</h1>
  
      <v-form v-model="valid" ref="form">
  
        <v-text-field
          v-model="athlete.fName"
          label="First Name"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="athlete.lName"
          label="Last Name"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="athlete.email"
          label="Email"
          type="email"
        ></v-text-field>

        <v-select
            v-model="athlete.id_team"
            :items="teams"
            item-title="name"
            item-value="id_team"
            label="Assign to Team"
            clearable
        />
  
        <v-btn color="primary" class="mt-6" @click="submitAthlete">
          Save Athlete
        </v-btn>
  
      </v-form>
    </v-container>
  </template>
  
  
  <script>
import athleteServices from "../services/athleteServices.js";
import teamServices from "../services/teamServices.js";

export default {
  name: "AddAthlete",

  data() {
    return {
      athlete: {
        fName: "",
        lName: "",
       email: "",
        id_team: null,
      },
      teams: [],   // <-- this stores available teams
    };
  },

  mounted() {
    teamServices.getAllTeams()
      .then(res => {
        this.teams = res.data;
      })
      .catch(err => console.error("Error loading teams:", err));
  },

  methods: {
    async submitAthlete() {
      try {
        // Step 1 — create the user
        const created = await athleteServices.createAthlete({
          fName: this.athlete.fName,
          lName: this.athlete.lName,
          email: this.athlete.email,
        });

        const userId = created.data.id_user;

        // Step 2 — assign to team
        if (this.athlete.id_team) {
          await teamServices.assignToTeam(userId, this.athlete.id_team);
        }

        this.$router.push("/coach/athletes");
      } catch (err) {
        console.error("Error creating athlete:", err);
      }
    },
  },
};
</script>
  
  <style scoped>
  </style>
  