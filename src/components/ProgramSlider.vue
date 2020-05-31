<template>
  <v-container>
    <p class="header" :style="{ backgroundColor: programColor }">{{ program }}</p>
    <v-slider
      v-model="programUnits"
      label="Num Units"
      :max="100"
      :min="10"
      hide-details
      dense
      color="#002855"
    >
      <template v-slot:append>
        <p class="label">{{ programUnits }}</p>
      </template>
    </v-slider>
    <v-slider
      v-model="programGSF"
      label="GSF / Unit"
      :max="5000"
      :min="500"
      hide-details
      dense
      color="#002855"
    >
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
    optionName: {
      type: String,
      default: "Option A"
    },
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
    option: {
      get() {
        if (this.optionName === "OptionA") {
          return store.getters.optionA;
        }
        return store.getters.optionB;
      }
    },
    programUnits: {
      get() {
        const result = this.option.programs.filter(program => program.name === this.program);
        return result[0].units;
      },
      set(val) {
        store.commit("setProgramUnits", { optionName: this.optionName, name: this.program, val });
      }
    },
    programGSF: {
      get() {
        const result = this.option.programs.filter(program => program.name === this.program);
        return result[0].gsf;
      },
      set(val) {
        store.commit("setProgramGSF", { optionName: this.optionName, name: this.program, val });
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
