<template>
  <div ref="modelContainer" class="container">
    <v-slider v-model="stories" label="Floors" :max="30" :min="6" hide-details>
      <template v-slot:append>
        <p>{{ stories }}</p>
      </template>
    </v-slider>
    <canvas ref="viewer" />
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import store from "../store";

export default {
  name: "ModelViewer",
  components: {},
  props: {
    programNames: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      cameraControls: null,
      effectController: null,
      teapotSize: 400,
      ambientLight: null,
      light: null,
      stories: 1,
      boundingBox: null,
      boundingBoxEdges: null
    };
  },
  computed: {
    canvas() {
      return this.$refs.viewer;
    },
    programs: {
      get() {
        return store.getters.programs;
      }
    },
    totalSqft() {
      return store.getters.totalSqft;
    },
    baseArea() {
      return this.totalSqft / this.stories;
    },
    baseDim() {
      return Math.sqrt(this.baseArea);
    }
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      const box = this.$refs.modelContainer;
      const width = box.offsetWidth;
      const height = box.offsetHeight;
      const canvasWidth = width;
      const canvasHeight = height;
      this.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 80000);
      this.camera.position.set(100, 100, 100);
      this.ambientLight = new THREE.AmbientLight(0x333333);
      this.light = new THREE.DirectionalLight(0xffffff, 1.0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(canvasWidth, canvasHeight);
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.cameraControls.addEventListener("change", this.animate);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xaaaaaa);

      this.scene.add(this.ambientLight);
      this.scene.add(this.light);

      window.addEventListener("resize", this.onWindowResize, false);

      const geometry = new THREE.BoxGeometry(this.baseDim, this.stories * 10, this.baseDim);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.1
      });
      this.boundingBox = new THREE.Mesh(geometry, material);
      this.boundingBox.translateY(this.stories / 2);
      // this.scene.add(this.boundingBox);

      const edgeGeometry = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      this.boundingBoxEdges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      // this.scene.add(this.boundingBoxEdges);
      this.computeProgramGeometry();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.redrawBoundingBox();
    },
    redrawBoundingBox() {
      const { geometry } = this.boundingBox;
      const newGeometry = new THREE.BoxGeometry(this.baseDim, this.stories * 10, this.baseDim);
      geometry.dispose();
      this.boundingBox.geometry = newGeometry;
      this.boundingBox.position.y = 0;

      const edgeGeometry = this.boundingBoxEdges.geometry;
      const newEdgeGeometry = new THREE.EdgesGeometry(geometry);
      edgeGeometry.dispose();
      this.boundingBoxEdges.geometry = newEdgeGeometry;
    },
    computeProgramGeometry() {
      let totalStories = 0;
      let prevLeftOverArea = 0;

      this.programs.forEach(program => {
        const material = new THREE.MeshBasicMaterial({ color: this.getRandomColor() });
        const stories = program.sqft / this.baseArea;
        const leftoverArea = (stories % 1) * this.baseDim;
        const boxes = [];
        let lastLoc;

        for (let i = 0; i < stories; i += 1) {
          let curBaseArea;
          if (this.almostEquals(prevLeftOverArea, 0)) {
            curBaseArea = this.baseDim * this.baseDim;
            prevLeftOverArea = 0;
          }
          const boxGeometry = new THREE.BoxGeometry(Math.sqrt(curBaseArea), 10, this.baseDim);
          console.log(program.name, totalStories + i);
          const boxMesh = new THREE.Mesh(boxGeometry, material);
          boxMesh.position.set(0, (totalStories + i) * 10, 0);
          this.scene.add(boxMesh);
          boxes.push(boxMesh);
          lastLoc = i;
        }

        const leftoverBox = new THREE.BoxGeometry(leftoverArea, 10, this.baseDim);
        const leftoverBoxMesh = new THREE.Mesh(leftoverBox, material);
        leftoverBoxMesh.position.set(0, (totalStories + lastLoc) * 10, 0);
        this.scene.add(leftoverBoxMesh);

        console.log(leftoverArea);

        prevLeftOverArea = leftoverArea;

        totalStories += stories;
      });
    },
    onWindowResize() {
      this.camera.aspect =
        this.$refs.modelContainer.offsetWidth / this.$refs.modelContainer.offsetHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(
        this.$refs.modelContainer.offsetWidth,
        this.$refs.modelContainer.offsetHeight
      );
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i += 1) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    almostEquals(x, y) {
      return Math.abs(x - y) < 1;
    }
  }
};
</script>

<style scoped>
.container {
  padding-left: 20px;
}
</style>
