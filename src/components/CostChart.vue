/* eslint-disable no-param-reassign */
<template>
  <v-container>
    <v-card outlined class="card">
      <div>
        <canvas ref="chart" />
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { Chart } from "chart.js";
import store from "../store";

export default {
  name: "CostChart",
  props: {},
  data() {
    return {
      chart: null
    };
  },
  computed: {
    totalCost: {
      get() {
        return store.getters.totalCost;
      }
    },
    totalOccupancyCost: {
      get() {
        return store.getters.totalOccupancyCost;
      }
    },
    lifeCycleCost() {
      const arr = [];
      for (let i = 1; i < 4; i += 1) {
        arr.push(this.totalCost / i);
      }
      arr.reverse();
      for (let i = 2; i < 14; i += 1) {
        const prevVal = arr[i];
        arr.push(prevVal + this.totalOccupancyCost);
      }
      return arr;
    },
    years() {
      const arr = [];
      for (let i = 0; i < 15; i += 1) {
        arr.push(i);
      }
      return arr;
    },
    config() {
      return {
        type: "line",
        data: {
          labels: this.years,
          datasets: [
            {
              label: "Option A",
              backgroundColor: "#002855",
              borderColor: "#002855",
              data: this.lifeCycleCost,
              fill: false
            }
          ]
        },
        options: this.options
      };
    },
    options() {
      return {
        responsive: true,
        title: {
          display: true,
          text: "Scenario Model"
        },
        tooltips: {
          mode: "index",
          intersect: false
        },
        hover: {
          mode: "nearest",
          intersect: true
        },
        scales: {
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Month"
            }
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Value"
            }
          }
        }
      };
    }
  },
  watch: {
    totalCost() {
      this.chart.data.datasets.forEach(dataset => {
        // eslint-disable-next-line no-param-reassign
        dataset.data = this.lifeCycleCost;
      });
      this.chart.update();
    },
    totalOccupancyCost() {
      this.chart.data.datasets.forEach(dataset => {
        // eslint-disable-next-line no-param-reassign
        dataset.data = this.lifeCycleCost;
      });
      this.chart.update();
    }
  },
  mounted() {
    this.updateCanvas();
  },
  methods: {
    updateCanvas() {
      const ctx = this.$refs.chart.getContext("2d");
      this.chart = new Chart(ctx, this.config);
      window.myLine = this.chart;
    }
  }
};
</script>

<style scoped>
.card {
  padding: 20px;
}
</style>
