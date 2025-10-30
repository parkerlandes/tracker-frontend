<template>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="pa-6 text-center" elevation="4" max-width="400">
        <h2>Sign in with Google</h2>
  
        <!-- Google Button Container (always shown) -->
        <div id="parent_id" class="mt-4"></div>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import AuthServices from "../services/authServices";
  import Utils from "../config/utils.js";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const user = ref({});
  
  const startGoogleLogin = () => {
    if (!window.google || !window.google.accounts) {
      console.error("Google Sign-In script not loaded");
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
  
  // ✅ Automatically show the Google button on mount
  onMounted(() => {
    startGoogleLogin();
  });
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  
  