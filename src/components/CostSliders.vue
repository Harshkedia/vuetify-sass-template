<template>
  <v-container class="program-grid">
    <cost-slider v-for="name in programNames" :key="name" :program="name" class="cost-slider" />
  </v-container>
</template>

<script>
import CostSlider from "./CostSlider.vue";

export default {
  name: "CostSliders",
  components: { CostSlider },
  props: {
    programNames: {
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
  display: grid;
  gap: 0rem;
  grid-template-columns: 1fr;
}

.cost-slider {
  margin: -10px;
}
</style>
