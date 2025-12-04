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

          <v-col cols="12" md="6">
            <v-card class="pa-6" elevation="4">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-subtitle-1">Latest Measurements</h3>
                <span class="text-caption text-medium-emphasis" v-if="latestRecordedDate">
                  Recorded {{ latestRecordedDate }}
                </span>
              </div>

              <v-row>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">Weight</div>
                  <div class="text-h6">{{ latestWeight }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">Height</div>
                  <div class="text-h6">{{ latestHeight }}</div>
                </v-col>
              </v-row>

              <div v-if="!latestRecordedDate" class="text-medium-emphasis mt-4">
                Log your measurements on the Progress page to see them here.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { computed, onMounted, ref } from "vue";
  import Utils from "../config/utils.js";
  import AthleteNav from "../components/AthleteNav.vue";
  import UserServices from "../services/userServices.js";
  import ProgressServices from "../services/progressServices.js";

const profile = ref({
  fName: "",
  lName: "",
  email: "",
  bio: "Share your goals, experience, or anything your coach should know.",
});
  const message = ref("");
  const latestMetric = ref(null);

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

    await loadLatestMetric(storedUser.id_user);
  });

  const loadLatestMetric = async (userId) => {
    if (!userId) return;
    try {
      const res = await ProgressServices.getLatestForUser(userId);
      latestMetric.value = res?.data || null;
    } catch (err) {
      if (err?.response?.status === 404) {
        latestMetric.value = null;
      } else {
        console.error("Error loading latest metric:", err);
      }
    }
  };

  const saveProfile = async () => {
    const storedUser = Utils.getStore("user");
    if (!storedUser?.id_user) return;
    try {
      await UserServices.updateUser(storedUser.id_user, profile.value);
      // Pull fresh copy from API to keep in sync
      const { data: refreshed } = await UserServices.getUser(storedUser.id_user);
      const mergedUser = { ...storedUser, ...profile.value, ...refreshed };

      profile.value = { ...profile.value, ...refreshed };
      Utils.setStore("user", mergedUser);
      message.value = "Profile updated successfully!";
    } catch (err) {
      console.error("Error updating profile:", err);
      message.value = "Update failed";
    }
  };

  const latestWeight = computed(() =>
    latestMetric.value?.weight_kg !== null && latestMetric.value?.weight_kg !== undefined
      ? `${latestMetric.value.weight_kg} kg`
      : "Not logged yet"
  );

  const latestHeight = computed(() =>
    latestMetric.value?.height_cm !== null && latestMetric.value?.height_cm !== undefined
      ? `${latestMetric.value.height_cm} cm`
      : "Not logged yet"
  );

  const latestRecordedDate = computed(() => {
    const recordedAt = latestMetric.value?.recorded_at;
    return recordedAt ? new Date(recordedAt).toLocaleDateString() : null;
  });
  
</script>
