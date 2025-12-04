<script>
import AthleteNav from "../components/AthleteNav.vue";
import CoachNav from "../components/CoachNav.vue";
import ProgressChart from "../components/ProgressChart.vue";
import ProgressServices from "../services/progressServices.js";
import GoalServices from "../services/goalServices.js";
import GoalProgressServices from "../services/playerGoalProgressServices.js";
import Utils from "../config/utils.js";

export default {
  name: "Progress",
  components: { AthleteNav, CoachNav, ProgressChart },
  data() {
    return {
      user: Utils.getStore("user"),
      metrics: [],
      isLoadingMetrics: false,
      metricsError: "",
      metricSaveMessage: "",
      metricSaveError: "",
      isSavingMetric: false,
      addMetricPanel: [],
      selectedMetric: "weight_kg",
      metricForm: {
        recorded_at: new Date().toISOString().slice(0, 10),
        weight_kg: "",
        height_cm: "",
        bench_press_lb: "",
        squat_lb: "",
        deadlift_lb: "",
        mile_time_min: "",
        notes: "",
      },
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
    isCoach() {
      return this.user?.role === "coach";
    },
  },
  created() {
    this.loadMetrics();
  },
  methods: {
    resetMetricForm() {
      this.metricForm = {
        recorded_at: new Date().toISOString().slice(0, 10),
        weight_kg: "",
        height_cm: "",
        bench_press_lb: "",
        squat_lb: "",
        deadlift_lb: "",
        mile_time_min: "",
        notes: "",
      };
    },
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
    formatPayload(idUser) {
      const numericFields = [
        "weight_kg",
        "height_cm",
        "bench_press_lb",
        "squat_lb",
        "deadlift_lb",
        "mile_time_min",
      ];

      const payload = {
        id_user: idUser || this.user?.id_user,
        recorded_at: this.metricForm.recorded_at,
        notes: this.metricForm.notes || null,
      };

      numericFields.forEach((field) => {
        const value = this.metricForm[field];
        payload[field] =
          value === "" || value === null || value === undefined
            ? null
            : Number(value);
      });

      return payload;
    },
    async saveMetric() {
      const user = Utils.getStore("user");
      if (!user) {
        this.metricSaveError = "Please sign in again to save progress.";
        return;
      }

      this.metricSaveError = "";
      this.metricSaveMessage = "";
      this.isSavingMetric = true;

      try {
        const payload = this.formatPayload(user.id_user);
        const response = await ProgressServices.createUserMetric(payload);
        if (response?.data) {
          this.metrics = [...this.metrics, response.data].sort(
            (a, b) =>
              new Date(a.recorded_at).getTime() -
              new Date(b.recorded_at).getTime()
          );
          await this.syncGoalsWithMetric(response.data);
          this.metricSaveMessage = "Metric added!";
          this.resetMetricForm();
        }
      } catch (err) {
        console.error("Failed to save metric:", err);
        this.metricSaveError = "Unable to save metric right now.";
      } finally {
        this.isSavingMetric = false;
      }
    },
    /**
     * After recording a metric, create goal progress entries for any weight-based goals.
     */
    async syncGoalsWithMetric(metric) {
      if (!metric?.id_user) return;
      try {
        const { data: goals } = await GoalServices.getUserGoals(metric.id_user);
        if (!goals || !goals.length) return;

        const exerciseToMetricField = {
          1: "bench_press_lb", // Barbell Bench Press
          3: "squat_lb", // Back Squat
        };

        const requests = goals
          .map((goal) => {
            const metricField = exerciseToMetricField[goal.id_exercise];
            if (!metricField) return null;
            const actualWeight = metric[metricField];
            if (actualWeight === null || actualWeight === undefined) return null;

            return GoalProgressServices.createProgressEntry({
              id_player_goal: goal.id_player_goal,
              id_user_metric: metric.id_user_metric,
              recorded_at: metric.recorded_at,
              actual_weight: actualWeight,
              notes: "Auto-logged from user metric",
            });
          })
          .filter(Boolean);

        if (requests.length) {
          await Promise.all(requests);
        }
      } catch (err) {
        console.error("Failed to sync goal progress from metric:", err);
      }
    },
  },
};


</script>

<template>
  <v-container class="pa-6 mt-12">
    <CoachNav v-if="isCoach" />
    <AthleteNav v-else />
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8" lg="6">
        <v-expansion-panels
          v-model="addMetricPanel"
          multiple
          variant="accordion"
          class="mb-6"
        >
          <v-expansion-panel value="add">
            <v-expansion-panel-title>
              <div class="d-flex align-center ga-2">
                <v-icon color="primary">mdi-plus</v-icon>
                <span class="text-subtitle-1">Add a metric</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-form @submit.prevent="saveMetric">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="metricForm.recorded_at"
                      label="Date"
                      type="date"
                      density="comfortable"
                      variant="outlined"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="metricForm.weight_kg"
                      label="Weight (kg)"
                      type="number"
                      step="0.1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="metricForm.height_cm"
                      label="Height (cm)"
                      type="number"
                      step="0.1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="metricForm.bench_press_lb"
                      label="Bench Press (lb)"
                      type="number"
                      step="1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="metricForm.squat_lb"
                      label="Squat (lb)"
                      type="number"
                      step="1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="metricForm.deadlift_lb"
                      label="Deadlift (lb)"
                      type="number"
                      step="1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="metricForm.mile_time_min"
                      label="Mile Time (min)"
                      type="number"
                      step="0.1"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="metricForm.notes"
                      label="Notes"
                      auto-grow
                      rows="2"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
                <div class="d-flex align-center ga-3">
                  <v-btn
                    type="submit"
                    color="primary"
                    :loading="isSavingMetric"
                    :disabled="isSavingMetric"
                  >
                    Add Metric
                  </v-btn>
                  <span class="text-success" v-if="metricSaveMessage">
                    {{ metricSaveMessage }}
                  </span>
                  <span class="text-error" v-else-if="metricSaveError">
                    {{ metricSaveError }}
                  </span>
                </div>
              </v-form>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

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
