<template>
    <v-app>
      <CoachNav />
  
      <v-container class="mt-10">
        <h2 class="mb-6 text-center">All Athletes</h2>
  
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="48"
          class="d-flex mx-auto my-6"
        />
  
        <!-- Cards -->
        <v-row v-else>
          <v-col
            v-for="athlete in athletes"
            :key="athlete.id_user"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="pa-4 text-center" elevation="3">
              <h3>{{ athlete.fName }} {{ athlete.lName }}</h3>
              <p class="text-medium-emphasis">{{ athlete.email }}</p>
              <v-chip color="secondary" label>
                ID: {{ athlete.id_user }}
              </v-chip>
            </v-card>
          </v-col>
        </v-row>
  
        <v-alert
          v-if="!athletes.length && !loading"
          type="info"
          class="mt-6 text-center"
        >
          No athletes found.
        </v-alert>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import athleteServices from "../services/athleteServices.js";
  import CoachNav from "../components/CoachNav.vue";
  
  const athletes = ref([]);
  const loading = ref(true);
  const error = ref("");
  
  onMounted(async () => {
    try {
    const res = await athleteServices.getAll();
      athletes.value = res.data;
      console.log("Loaded athletes:", res.data);
    } catch (err) {
      console.error("Error fetching athletes:", err);
      error.value = "Failed to load athletes.";
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style scoped>
  .mt-10 {
    margin-top: 2.5rem;
  }
  .text-medium-emphasis {
    color: rgba(0, 0, 0, 0.6);
  }
  </style>
  