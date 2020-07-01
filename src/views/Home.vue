<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <slider-component />
  </div>
</template>

<script>
// @ is an alias to /src
import SliderComponent from "../components/SliderComponent.vue";

export default {
  name: "Home",
  components: {
    SliderComponent
  }
};
</script>
