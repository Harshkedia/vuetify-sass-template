<template>
  <v-app>
    <v-content>
      <div class="app-grid">
        <div class="left-row">
          <program-sliders :program-names="programNames" />
          <cost-sliders :program-names="programNames" />
          <total-costs />
        </div>
        <div class="right-row">
          <cost-chart />
          <model-viewer />
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import store from "./store";
import ProgramSliders from "./components/ProgramSliders.vue";
import CostSliders from "./components/CostSliders.vue";
import CostChart from "./components/CostChart.vue";
import TotalCosts from "./components/TotalCosts.vue";
import ModelViewer from "./components/ModelViewer.vue";

export default {
  name: "App",

  components: {
    ProgramSliders,
    CostSliders,
    CostChart,
    TotalCosts,
    ModelViewer
  },

  data: () => ({}),

  computed: {
    programNames: {
      get() {
        return store.getters.programs.map(program => {
          return program.name;
        });
      }
    },
    totalCost: {
      get() {
        return store.getters.totalCost;
      }
    }
  }
};
</script>

<style scoped>
#app {
  margin: 30px;
}
.app-grid {
  display: grid;
  gap: 5rem;
  grid-template-columns: 1fr 1fr;
}

.left-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.right-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
</style>
