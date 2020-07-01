<template>
  <v-container>
    <v-slider
      v-model="occupancyCost"
      label="Slider"
      :max="100"
      :min="10"
      hide-details
      dense
      color="#002855"
    >
      <template v-slot:append>
        <p>{{ occupancyCost }}</p>
      </template>
    </v-slider>
  </v-container>
</template>

<script>
export default {
  name: "SliderComponent",
  components: {},
  props: {},
  data() {
    return {
      occupancyCost: 0
    };
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
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
  background-color: $navy;
  color: white;
}
</style>
