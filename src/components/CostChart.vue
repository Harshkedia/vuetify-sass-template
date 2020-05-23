<template>
  <div>
    <canvas ref="chart" />
  </div>
</template>

<script>
import { Chart } from "chart.js";
import store from "../store";

export default {
  name: "CostChart",
  props: {},
  computed: {
    totalCost: {
      get() {
        return store.getters.totalCost;
      }
    },
    lifeCycleCost() {
      const arr = [this.totalCost];
      for (let i = 0; i < 14; i += 1) {
        if (i < 3) {
          arr.push(this.totalCost + 5000);
        } else {
          arr.push(this.totalCost + 10000);
        }
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
              backgroundColor: "red",
              borderColor: "red",
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
          text: "Chart.js Line Chart"
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
  mounted() {
    this.updateCanvas();
  },
  methods: {
    updateCanvas() {
      const ctx = this.$refs.chart.getContext("2d");
      window.myLine = new Chart(ctx, this.config);
    }
  }
};
</script>

<style scoped></style>
