<template>
  <v-container>
    <p class="header" :style="{ backgroundColor: programColor }">{{ program }}</p>
    <v-slider v-model="programUnits" label="Num Units" :max="100" :min="10" hide-details
dense>
      <template v-slot:append>
        <p class="label">{{ programUnits }}</p>
      </template>
    </v-slider>
    <v-slider v-model="programGSF" label="GSF / Unit" :max="5000" :min="500" hide-details
dense>
      <template v-slot:append>
        <p class="label">{{ programGSF }}</p>
      </template>
    </v-slider>
  </v-container>
</template>

<script>
import store from "../store";

export default {
  name: "ProgramSlider",
  props: {
    program: {
      type: String,
      default: "Program Name"
    },
    programColor: {
      type: String,
      default: "red"
    }
  },
  data: () => {
    return {};
  },
  computed: {
    programUnits: {
      get() {
        const result = store.getters.programs.filter(program => program.name === this.program);
        return result[0].units;
      },
      set(val) {
        store.commit("setProgramUnits", { name: this.program, val });
      }
    },
    programGSF: {
      get() {
        const result = store.getters.programs.filter(program => program.name === this.program);
        return result[0].gsf;
      },
      set(val) {
        store.commit("setProgramGSF", { name: this.program, val });
      }
    }
  }
};
</script>

<style scoped>
.header {
  margin: 2px;
  font-size: 12px;
  padding: 5px;
}

.label {
  font-size: 10px;
}

::v-deep .v-label {
  font-size: 10px;
}
</style>
