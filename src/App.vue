<template>
  <v-app>
    <v-content class="app-grid">
      <div class="left-row">
        <program-sliders :program-names="programNames" />
        <cost-sliders :program-names="programNames" />
      </div>
      <div class="right-row" />
    </v-content>
  </v-app>
</template>

<script>
import store from "./store";
import ProgramSliders from "./components/ProgramSliders.vue";
import CostSliders from "./components/CostSliders.vue";

export default {
  name: "App",

  components: {
    ProgramSliders,
    CostSliders
  },

  data: () => ({}),

  computed: {
    programNames: {
      get() {
        return store.getters.programs.map(program => {
          return program.name;
        });
      }
    }
  }
};
</script>

<style scoped>
.app-grid {
  display: grid;
  gap: 10rem;
  grid-template-columns: 1fr 1fr;
}

.left-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
</style>
