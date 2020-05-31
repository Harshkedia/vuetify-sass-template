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
    optionA: {
      get() {
        return store.getters.optionA;
      }
    },
    optionB: {
      get() {
        return store.getters.optionB;
      }
    },
    optionACosts: {
      get() {
        return [this.optionA.totalCost, this.optionA.totalOccupancyCost];
      }
    },
    optionBCosts: {
      get() {
        return [this.optionB.totalCost, this.optionB.totalOccupancyCost];
      }
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
              data: this.lifeCycleCost(this.optionA.totalCost, this.optionA.totalOccupancyCost),
              fill: false
            },
            {
              label: "Option B",
              backgroundColor: "#ff4611",
              borderColor: "#ff4611",
              data: this.lifeCycleCost(this.optionB.totalCost, this.optionB.totalOccupancyCost),
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
    optionACosts() {
      this.chart.data.datasets.forEach(dataset => {
        if (dataset.label === "Option A") {
          // eslint-disable-next-line no-param-reassign
          dataset.data = this.lifeCycleCost(
            this.optionA.totalCost,
            this.optionA.totalOccupancyCost
          );
        }
      });
      this.chart.update();
    },
    optionBCosts() {
      this.chart.data.datasets.forEach(dataset => {
        if (dataset.label === "Option B") {
          // eslint-disable-next-line no-param-reassign
          dataset.data = this.lifeCycleCost(
            this.optionB.totalCost,
            this.optionB.totalOccupancyCost
          );
        }
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
    },
    lifeCycleCost(totalCost, totalOccupancyCost) {
      const arr = [];
      for (let i = 1; i < 4; i += 1) {
        arr.push(totalCost / i);
      }
      arr.reverse();
      for (let i = 2; i < 14; i += 1) {
        const prevVal = arr[i];
        arr.push(prevVal + totalOccupancyCost);
      }
      return arr;
    }
  }
};
</script>

<style scoped>
.card {
  padding: 20px;
}
</style>
