<template>
  <v-container>
    <v-card class="program-grid" fluid outlined>
      <program-slider
        v-for="program in programs"
        :key="program.name"
        :program="program.name"
        :program-color="program.color"
        class="program-slider"
      />
    </v-card>
  </v-container>
</template>

<script>
import ProgramSlider from "./ProgramSlider.vue";

export default {
  name: "ProgramSliders",
  components: { ProgramSlider },
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
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr 1fr;
}

.program-slider {
  margin-top: -12px;
  margin-bottom: -12px;
}
</style>
