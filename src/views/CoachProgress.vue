<template>
    <v-app>
      <CoachNav />

      <h1 class="text-h5 font-weight-bold mb-6"></h1>
  
      <v-container class="pa-8 mt-10">
        <h2 class="mb-6">Athlete Goal Progress</h2>
  
        <!-- ==========================
             SELECT ATHLETE
        =========================== -->
        <v-select
          v-model="selectedAthleteId"
          :items="athletes"
          item-title="name"
          item-value="id_user"
          label="Select Athlete"
          variant="outlined"
          class="mb-6"
          @update:model-value="loadGoalsForAthlete"
        />
  
        <!-- ==========================
             SELECT GOAL
        =========================== -->
        <v-select
            v-model="selectedMetricId"
            :items="metricOptions"
            item-title="label"
            item-value="value"
            label="Select Metric"
            class="mb-4"
            variant="outlined"
            density="comfortable"
        />
  
        <!-- ==========================
             LOADING SPINNER
        =========================== -->
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="48"
          class="d-flex mx-auto my-6"
        />
  
        <!-- ==========================
             ERROR MESSAGE
        =========================== -->
        <v-alert
          v-else-if="error"
          type="error"
          class="mt-4"
        >
          {{ error }}
        </v-alert>
  
        <!-- ==========================
             PROGRESS CHART
        =========================== -->
        <ProgressChart
          v-else-if="hasChartData"
          :title="selectedGoalTitle"
          :labels="chartLabels"
          :data-points="chartValues"
          color="#42a5f5"
        />

        <div v-else class="text-center text-medium-emphasis mt-6">
          Select an athlete and a goal to view progress.
        </div>
      </v-container>
    </v-app>
  </template>
  
  <script>
import CoachNav from "../components/CoachNav.vue";
import ProgressChart from "../components/ProgressChart.vue";

import athleteServices from "../services/athleteServices";
import progressServices from "../services/progressServices.js";

export default {
  name: "CoachProgress",
  components: { CoachNav, ProgressChart },

  data() {
    return {
      athletes: [],
      selectedAthleteId: null,

      // Metrics for selected athlete
      metrics: [],
      selectedMetric: "weight_kg",

      loading: false,
      error: "",

      metricOptions: [
        { label: "Body Weight (kg)", value: "weight_kg", color: "#ef5350" },
        { label: "Height (cm)", value: "height_cm", color: "#42a5f5" },
        { label: "Bench Press (lb)", value: "bench_press_lb", color: "#8e24aa" },
        { label: "Squat (lb)", value: "squat_lb", color: "#fdd835" },
        { label: "Deadlift (lb)", value: "deadlift_lb", color: "#26a69a" },
        { label: "Mile Time (min)", value: "mile_time_min", color: "#ff7043" },
      ]
    };
  },

  computed: {
    selectedMetricOption() {
      return (
        this.metricOptions.find((opt) => opt.value === this.selectedMetric) ||
        this.metricOptions[0]
      );
    },

    filteredMetrics() {
      return this.metrics
        .filter((m) => m[this.selectedMetric] !== null && m[this.selectedMetric] !== undefined)
        .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
    },

    chartLabels() {
      return this.filteredMetrics.map((m) => m.recorded_at);
    },

    chartValues() {
      return this.filteredMetrics.map((m) => m[this.selectedMetric]);
    },

    hasChartData() {
      return this.chartValues.length > 0;
    },
  },

  async created() {
    await this.loadAthletes();
  },

  watch: {
    selectedAthleteId() {
      this.loadMetricsForAthlete();
    },
    selectedMetric() {
      this.loadMetricsForAthlete();
    }
  },

  methods: {
    async loadAthletes() {
      try {
        const res = await athleteServices.getAll();
        this.athletes = res.data.map((a) => ({
          id_user: a.id_user,
          name: `${a.fName} ${a.lName}`,
        }));
      } catch (err) {
        console.error("Error loading athletes:", err);
      }
    },

    async loadMetricsForAthlete() {
      this.metrics = [];
      this.error = "";

      if (!this.selectedAthleteId) return;

      this.loading = true;

      try {
        const res = await progressServices.getUserMetrics(this.selectedAthleteId);
        this.metrics = res.data || [];
      } catch (err) {
        console.error("Error loading metrics:", err);
        this.error = "Failed to load metrics.";
      }

      this.loading = false;
    },
  },
};
</script>

  
  <style scoped>
  </style>
  