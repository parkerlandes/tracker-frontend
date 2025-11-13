<template>
    <v-app>
      <CoachNav />
  
      <v-container class="mt-10">
        <h2 class="mb-6 text-center">All Athletes</h2>
  
        <v-row>
          <v-col
            v-for="athlete in athletes"
            :key="athlete.id_user"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="pa-4" elevation="3">
              <h3>{{ athlete.fName }} {{ athlete.lName }}</h3>
              <p class="text-medium-emphasis">{{ athlete.email }}</p>
  
              <v-select
                v-model="athlete.selectedTeam"
                :items="teams"
                item-title="name"
                item-value="id_team"
                label="Assign to Team"
                outlined
                dense
                class="mt-2"
              ></v-select>
  
              <v-btn
                color="primary"
                block
                class="mt-2"
                @click="assignToTeam(athlete)"
              >
                Assign
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
  
        <v-alert v-if="!athletes.length" type="info" class="mt-6 text-center">
          No athletes found.
        </v-alert>
  
        <v-snackbar v-model="snackbar.show" :color="snackbar.color">
          {{ snackbar.text }}
        </v-snackbar>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import Utils from "../config/utils.js";
  import CoachNav from "../components/CoachNav.vue";
  
  const athletes = ref([]);
  const teams = ref([]);
  const snackbar = ref({ show: false, text: "", color: "success" });
  const API = "http://localhost:3129/tracker-t9";
  
  const showSnackbar = (text, color = "success") => {
    snackbar.value = { show: true, text, color };
  };
  
  // Load athletes + teams
  onMounted(async () => {
    const user = Utils.getStore("user");
    try {
      const [athRes, teamRes] = await Promise.all([
        axios.get(`${API}/user/athletes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        axios.get(`${API}/teams`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);
  
      athletes.value = athRes.data;
      teams.value = teamRes.data;
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });
  
  // Assign athlete to team
  const assignToTeam = async (athlete) => {
    if (!athlete.selectedTeam) {
      return showSnackbar("Please select a team first", "warning");
    }
  
    const user = Utils.getStore("user");
    try {
      await axios.post(
        `${API}/user-teams`,
        {
          id_user: athlete.id_user,
          id_team: athlete.selectedTeam,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
  
      showSnackbar(
        `${athlete.fName} ${athlete.lName} assigned successfully!`
      );
    } catch (err) {
      console.error("Error assigning athlete:", err);
      showSnackbar("Failed to assign athlete", "error");
    }
  };
  </script>
  