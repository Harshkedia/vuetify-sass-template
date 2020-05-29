<template>
  <v-container>
    <v-card class="program-grid" outlined>
      <div class="headers">
        <p class="header">Program</p>
        <p class="header">Total SQFT</p>
        <p class="header">Cost / SQFT</p>
        <p class="header">Total Cost</p>
      </div>
      <hr />
      <br />
      <cost-slider
        v-for="program in programs"
        :key="program.name"
        :program="program.name"
        :program-color="program.color"
        class="cost-slider"
      />
    </v-card>
  </v-container>
</template>

<script>
import CostSlider from "./CostSlider.vue";

export default {
  name: "CostSliders",
  components: { CostSlider },
  props: {
    programs: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>

<style scoped>
.program-grid {
  padding: 20px;
  display: grid;
  gap: 0rem;
  grid-template-columns: 1fr;
}

.headers {
  display: grid;
  gap: 0rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.header {
  font-size: 10px;
}

.cost-slider {
  margin: -17px;
}
</style>
