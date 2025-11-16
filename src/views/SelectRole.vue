<template>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-row justify="center" align="center" class="text-center">
        <v-col cols="12">
          <h2 class="mb-6">Select Your Role</h2>
        </v-col>
  
        <v-col cols="6" md="4">
          <v-card
            class="pa-6 hoverable"
            elevation="4"
            @click="chooseRole('coach')"
          >
            <v-icon size="56" color="primary">mdi-account-tie</v-icon>
            <h3 class="mt-2">Coach</h3>
          </v-card>
        </v-col>
  
        <v-col cols="6" md="4">
          <v-card
            class="pa-6 hoverable"
            elevation="4"
            @click="chooseRole('athlete')"
          >
            <v-icon size="56" color="secondary">mdi-weight-lifter</v-icon>
            <h3 class="mt-2">Athlete</h3>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>
  
<script setup>
    import Utils from "../config/utils.js";
    import { useRouter } from "vue-router";
    import { onMounted } from "vue";
    import selectRoleServices from  "../services/selectRoleServices.js";


    const router = useRouter();
    const chooseRole = async (role) => {
    const user = Utils.getStore("user");
    const {updateRole} = selectRoleServices;


    if (!user) {
        console.warn("User missing — routing back to Google login...");
        router.push("/google-auth");
        return;
    }

    try {
        user.role = role;
        Utils.setStore("user", user);

        // Update role in DB
        await updateRole(user.id, role); //id_user 

        
        router.push(role === "coach" ? "/coach" : "/athlete");

      } catch (error) {
        console.error("Failed to update role:", error);
    
      }
    };

    // Run this when the page is opened
    onMounted(() => {
    const user = Utils.getStore("user");
    if (!user) {
        console.warn("No user detected — redirecting to Google auth");
        router.push("/google-auth");
    }
    });
</script>
  
  <style scoped>
  .hoverable:hover {
    cursor: pointer;
    transform: scale(1.05);
    transition: 0.25s ease-in-out;
  }
  .fill-height {
    height: 100vh;
  }
  </style>
  
  
  