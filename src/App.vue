<template>
  <v-app>
    <v-content>
      <div class="app-grid">
        <v-tabs centered fixed-tabs color="#002855">
          <v-tab>
            Option A
          </v-tab>
          <v-tab>
            Option B
          </v-tab>
          <v-tab-item class="tab-text">
            <div class="left-row">
              <program-sliders :option="optionA" />
              <cost-sliders :option="optionA" />
              <total-costs :option="optionA" />
            </div>
          </v-tab-item>
          <v-tab-item class="tab-text">
            <div class="left-row">
              <program-sliders :option="optionB" />
              <cost-sliders :option="optionB" />
              <total-costs :option="optionB" />
            </div>
          </v-tab-item>
        </v-tabs>
        <div class="right-row">
          <!-- <model-viewer /> -->
          <cost-chart />
          <div><br /><br /><br /></div>
          <div><br /><br /><br /></div>
        </div>
      </div>
      <Footer />
    </v-content>
  </v-app>
</template>

<script>
import store from "./store";
import ProgramSliders from "./components/ProgramSliders.vue";
import CostSliders from "./components/CostSliders.vue";
import CostChart from "./components/CostChart.vue";
import TotalCosts from "./components/TotalCosts.vue";
// import ModelViewer from "./components/ModelViewer.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",

  components: {
    ProgramSliders,
    CostSliders,
    CostChart,
    TotalCosts,
    // ModelViewer,
    Footer
  },

  data: () => ({}),

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
  gap: 0rem;
  grid-template-columns: 1fr;
}

.right-row {
  display: grid;
  gap: 0rem;
  grid-template-columns: 1fr;
}
</style>
