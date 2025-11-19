<template>
  <div class="chart-shell">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import {
  Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "vue-chartjs";

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);


export default {
  name: "ProgressChart",
  components: { Line },
  props: {
    title: { type: String, default: "Progress" },
    labels: { type: Array, required: true },          
    dataPoints: { type: Array, required: true },     
    color: { type: String, default: "#42a5f5" },
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.title,
            data: this.dataPoints,
            fill: false,
            borderColor: this.color,
            tension: 0.25,
            pointRadius: 4,
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "time",
            time: { unit: "week" },
            title: { display: true, text: "Date" },
            ticks: { color: "#777" },
          },
          y: {
            beginAtZero: false,
            title: { display: true, text: this.title },
            ticks: { color: "#777" },
          },
        },
        plugins: {
          legend: { display: true },
          tooltip: { mode: "index", intersect: false },
        },
      };
    },
  },
};
</script>

<style scoped>
.chart-shell {
  height: 250px;
  max-width: 600px;
  margin: 0 auto;
}
</style>
