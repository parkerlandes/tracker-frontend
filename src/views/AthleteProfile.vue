<template>
    <v-app>
      <AthleteNav />
  
      <v-container class="pa-8 mt-10">
        <h2 class="mb-6 text-center">Your Profile</h2>
  
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6" elevation="4">
  
              <v-text-field
                label="First Name"
                v-model="profile.fName"
                outlined
                class="mb-3"
              ></v-text-field>
  
              <v-text-field
                label="Last Name"
                v-model="profile.lName"
                outlined
                class="mb-3"
              ></v-text-field>
  
              <v-text-field
                label="Email"
                v-model="profile.email"
                outlined
                disabled
              ></v-text-field>

              <v-textarea
                label="Bio"
                v-model="profile.bio"
                outlined
                rows="3"
                class="mb-3"
                placeholder="Share your goals, experience, or anything your coach should know."
              ></v-textarea>

              <v-divider class="my-4"></v-divider>

              <v-btn
                color="primary"
                block
                @click="saveProfile"
              >
                Save Changes
              </v-btn>
  
              <v-alert
                v-if="message"
                type="success"
                class="mt-4"
                dense
              >
                {{ message }}
              </v-alert>
  
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import Utils from "../config/utils.js";
  import AthleteNav from "../components/AthleteNav.vue";
  import UserServices from "../services/userServices.js";

  const profile = ref({
    fName: "",
    lName: "",
    email: "",
    bio: "",
  });
  const message = ref("");

  onMounted(async () => {
    const storedUser = Utils.getStore("user");

    if (!storedUser) {
      console.warn("No user found in local storage");
      return;
    }

    // Use local data first to show instantly
    profile.value = { ...storedUser };

    try {
      // Then fetch fresh copy from DB in case of updates
      const res = await UserServices.getUser(storedUser.id_user);
      if (res.data) profile.value = { ...storedUser, ...res.data };
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  });

  const saveProfile = async () => {
    const storedUser = Utils.getStore("user");
    if (!storedUser?.id_user) return;
    try {
      await UserServices.updateUser(storedUser.id_user, profile.value);
      message.value = "Profile updated successfully!";

      // Merge to keep properties not on the form (picture, token, role, etc.)
      Utils.setStore("user", { ...storedUser, ...profile.value });
    } catch (err) {
      console.error("Error updating profile:", err);
      message.value = "Update failed";
    }
  };
  
</script>
