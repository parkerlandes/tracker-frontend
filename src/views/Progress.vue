<script>
import AthleteNav from "../components/AthleteNav.vue";
import ProgressChart from "../components/ProgressChart.vue";
import ProgressServices from "../services/progressServices.js";
import Utils from "../config/utils.js";

export default {
  name: "Progress",
  components: { AthleteNav, ProgressChart },
  data() {
    return {
      metrics: [],
      isLoadingMetrics: false,
      metricsError: "",
      selectedMetric: "weight_kg",
      metricOptions: [
        { label: "Body Weight (kg)", value: "weight_kg", color: "#ef5350" },
        { label: "Height (cm)", value: "height_cm", color: "#42a5f5" },
        { label: "Bench Press (lb)", value: "bench_press_lb", color: "#8e24aa" },
        { label: "Squat (lb)", value: "squat_lb", color: "#fdd835" },
        { label: "Deadlift (lb)", value: "deadlift_lb", color: "#26a69a" },
        { label: "Mile Time (min)", value: "mile_time_min", color: "#ff7043" },
      ],
    };
  },
  computed: {
    selectedMetricOption() {
      return (
        this.metricOptions.find((option) => option.value === this.selectedMetric) ||
        this.metricOptions[0]
      );
    },
    chartLabels() {
      return this.filteredMetrics.map((entry) => entry.recorded_at);
    },
    chartValues() {
      return this.filteredMetrics.map((entry) => entry[this.selectedMetric]);
    },
    filteredMetrics() {
      return this.metrics
        .filter((entry) => {
          const value = entry[this.selectedMetric];
          return value !== null && value !== undefined;
        })
        .sort(
          (a, b) =>
            new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
        );
    },
    hasChartData() {
      return this.chartLabels.length > 0;
    },
  },
  created() {
    this.loadMetrics();
  },
  methods: {
    async loadMetrics() {
      const user = Utils.getStore("user");
      if (!user) {
        this.metricsError = "Please sign in again to view your progress.";
        return;
      }

      this.isLoadingMetrics = true;
      this.metricsError = "";

      try {
        const response = await ProgressServices.getUserMetrics(user.id_user);
        this.metrics = response.data || [];
      } catch (err) {
        console.error("Failed to load user metrics:", err);
        this.metricsError = "Unable to load progress data right now.";
      } finally {
        this.isLoadingMetrics = false;
      }
    },
  },
};


</script>

<template>
  <v-container class="pa-6 mt-12">
    <AthleteNav />
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8" lg="6">
        <v-select
          v-model="selectedMetric"
          :items="metricOptions"
          item-title="label"
          item-value="value"
          label="Select metric"
          variant="outlined"
          density="comfortable"
          class="mb-6"
        />

        <v-progress-circular
          v-if="isLoadingMetrics"
          indeterminate
          color="primary"
          size="48"
          class="d-block mx-auto my-10"
        />

        <v-alert
          v-else-if="metricsError"
          type="error"
          variant="tonal"
          class="mt-4"
          density="comfortable"
        >
          {{ metricsError }}
        </v-alert>

        <ProgressChart
          v-else-if="hasChartData"
          :title="selectedMetricOption.label"
          :labels="chartLabels"
          :data-points="chartValues"
          :color="selectedMetricOption.color"
        />

        <div v-else class="text-center text-medium-emphasis mt-6">
          Log your {{ selectedMetricOption.label.toLowerCase() }} to see it over time.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
