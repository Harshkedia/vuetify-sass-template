<template>
  <v-container class="program-grid">
    <program-slider
      v-for="name in programNames"
      :key="name"
      :program="name"
      class="program-slider"
    />
  </v-container>
</template>

<script>
import ProgramSlider from "./ProgramSlider.vue";

export default {
  name: "ProgramSliders",
  components: { ProgramSlider },
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
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
}

.program-slider {
  margin-top: -10px;
  margin-bottom: -10px;
}
</style>
