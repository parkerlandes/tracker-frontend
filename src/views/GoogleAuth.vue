<template>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="pa-6 text-center" elevation="4" max-width="400">
        <h2>Sign in with Google</h2>
  
        <v-btn
          color="primary"
          block
          large
          @click="startGoogleLogin"
          v-if="!showGoogleButton"
        >
          Continue with Google
        </v-btn>
  
        <div id="parent_id" v-show="showGoogleButton" class="mt-4"></div>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import AuthServices from "../services/authServices";
  import Utils from "../config/utils.js";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const showGoogleButton = ref(false);
  const user = ref({});
  
  const startGoogleLogin = () => {
    showGoogleButton.value = true;
    if (!window.google || !window.google.accounts) {
      alert("Google Sign-In script not loaded");
      return;
    }
  
    window.handleCredentialResponse = handleCredentialResponse;
  
    const client = import.meta.env.VITE_APP_CLIENT_ID;
    window.google.accounts.id.initialize({
      client_id: client,
      cancel_on_tap_outside: false,
      auto_select: false,
      callback: window.handleCredentialResponse,
    });
  
    window.google.accounts.id.renderButton(
      document.getElementById("parent_id"),
      {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: 300,
      }
    );
  };
  
  const handleCredentialResponse = async (response) => {
    try {
        const res = await AuthServices.loginUser({ credential: response.credential });
        user.value = res.data;
        Utils.setStore("user", user.value);

        // Get selected role (set earlier in SelectRole.vue)
        const selectedRole = Utils.getStore("selectedRole");

        if (selectedRole === "coach") {
        router.push({ name: "coachDashboard" });
        } else {
        router.push({ name: "athleteDashboard" });
        }
    } catch (err) {
        console.error("Login failed:", err);
    }
    };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  