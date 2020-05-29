<template>
  <v-layout footer-bottom>
    <!-- NBBJ Digital Logo & Link -->
    <v-flex xs6 style="text-align: left">
      <a href="http://www.nbbj.com/about/digital-practice/">
        <img
          src="https://i.imgur.com/2brpY1c.png"
          class="image-center-vertical"
          height="18"
          alt="NBBJ"
        />
      </a>
    </v-flex>

    <!-- Social Media Icons -->
    <v-flex
      xs6
      shrink
      style="text-align: right"
      class="footer-icons"
      href="http://www.nbbj.com/about/digital-practice/"
    >
      <v-btn
        id="btn-footer-twitter"
        ma-0
        pa-0
        text
        icon
        color="gray"
        href="https://twitter.com/NBBJDesign"
        target="_blank"
      >
        <v-icon ma-0 pa-0 size="20px">fab fa-twitter</v-icon>
      </v-btn>
      <v-btn
        id="btn-footer-linkedin"
        ma-0
        pa-0
        text
        icon
        color="gray"
        href="https://www.linkedin.com/company/nbbjdesign/"
        target="_blank"
      >
        <v-icon ma-0 pa-0 size="20px">fab fa-linkedin</v-icon>
      </v-btn>
      <v-btn
        id="btn-footer-github"
        ma-0
        pa-0
        text
        icon
        color="gray"
        href="https://github.com/nbbj-digital"
        target="_blank"
      >
        <v-icon ma-0 pa-0 size="20px">fab fa-github</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
/**
 Standard Nbbj Footer
 * */
export default {
  name: "Footer"
};
</script>

<style scoped>
.footer-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.image-center-vertical {
  top: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  padding-left: 1%;
}
.footer-icons {
  margin-right: 1em;
}
</style>
