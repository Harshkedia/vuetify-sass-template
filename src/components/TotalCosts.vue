<template>
  <v-container>
    <v-card class="program-grid" outlined>
      <v-slider
        v-model="occupancyCost"
        label="Occupancy Cost / SF"
        :max="100"
        :min="10"
        hide-details
        dense
      >
        <template v-slot:append>
          <p>{{ occupancyCost }}</p>
        </template>
      </v-slider>
      <p class="total">Construction Cost: ${{ totalCost }}</p>
      <p class="total">Occupancy Cost: ${{ totalOccupancyCost }}</p>
    </v-card>
  </v-container>
</template>

<script>
import store from "../store";

export default {
  name: "TotalCosts",
  components: {},
  props: {
    programNames: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    totalCost: {
      get() {
        return store.getters.totalCost;
      }
    },
    totalOccupancyCost: {
      get() {
        return store.getters.totalOccupancyCost;
      }
    },
    occupancyCost: {
      set(val) {
        store.commit("setOccupancyCost", val);
      },
      get() {
        return store.getters.occupancyCost;
      }
    }
  }
};
</script>

<style scoped>
.program-grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr;
  padding: 20px;
}

p {
  font-size: 15px;
  padding: 5px;
}
.label {
  background-color: brown;
}

::v-deep .v-label {
  font-size: 10px;
}
.total {
  padding: 10px;
  font-size: 15px;
  background-color: grey;
}
</style>
