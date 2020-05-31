<template>
  <v-container class="cost-grid">
    <p class="header" :style="{ backgroundColor: programColor }">{{ program }}</p>
    <p class="label">{{ programSQF }} SF</p>
    <v-slider v-model="programCost" :max="3000" :min="150" hide-details color="#002855">
      <template v-slot:append>
        <p class="label">${{ programCost }}</p>
      </template>
    </v-slider>

    <p class="label">${{ programTotalCost }}</p>
  </v-container>
</template>

<script>
import store from "../store";

export default {
  name: "CostSlider",
  props: {
    optionName: {
      type: String,
      default: "OptionA"
    },
    program: {
      type: String,
      default: "Program Name"
    },
    squareFeet: {
      type: Number,
      default: 1000
    },
    programColor: {
      type: String,
      default: "red"
    }
  },
  data: () => {
    return {
      cost: 0
    };
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
    programSQF: {
      get() {
        const result = this.option.programs.filter(program => program.name === this.program);
        return result[0].sqft;
      },
      set(val) {
        store.commit("setProgramGSF", { optionName: this.optionName, name: this.program, val });
      }
    },
    programCost: {
      get() {
        const result = this.option.programs.filter(program => program.name === this.program);
        return result[0].cost;
      },
      set(val) {
        store.commit("setProgramCost", { optionName: this.optionName, name: this.program, val });
      }
    },
    programTotalCost: {
      get() {
        const result = this.option.programs.filter(program => program.name === this.program);
        return result[0].totalCost;
      }
    }
  }
};
</script>

<style scoped>
p {
  font-size: 15px;
  padding: 5px;
}

.header {
  font-size: 12px;
  padding: 5px;
}

.label {
  font-size: 10px;
}

.cost-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 0.5fr 1fr 1fr;
}
</style>
