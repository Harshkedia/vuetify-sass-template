/* eslint-disable no-param-reassign */
<template>
  <div ref="modelContainer" class="container">
    <v-slider v-model="baseArea" label="baseArea" :max="100000" :min="1000" hide-details
dense>
      <template v-slot:append>
        <p>{{ baseArea }}</p>
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
      boxLocations: [],
      boxPositions: [],
      boxes: [],
      boxEdges: [],
      baseArea: 1000
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
      this.drawProgramGeometry();
      // this.drawBoundingBox();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      // this.redrawProgramGeometry();
    },
    drawBoundingBox() {
      const numStories = Math.ceil(this.totalSqft / this.baseArea);
      const dimension = { width: this.baseDim, length: this.baseDim, height: numStories * 10 };
      const geometry = new THREE.BoxGeometry(dimension.width, dimension.height, dimension.length);
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.1
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(0, 0, 0);

      const edgeGeometry = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);

      this.scene.add(box);
      this.scene.add(edge);
    },
    drawProgramGeometry() {
      const { boxDimensions, boxLocations } = this.programBoxGeometry();
      boxDimensions.forEach((dimension, index) => {
        const location = boxLocations[index];

        const geometry = new THREE.BoxGeometry(dimension.width, dimension.height, dimension.length);
        const material = new THREE.MeshBasicMaterial({ color: dimension.color });
        const box = new THREE.Mesh(geometry, material);
        box.translateY(location.z);
        box.translateZ(location.y);

        // box.position.set(location.x, location.z, location.y);

        const edgeGeometry = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);

        edge.translateY(location.z);
        edge.translateZ(location.y);

        this.scene.add(box);
        this.scene.add(edge);

        this.boxes.push(box);
        this.boxEdges.push(edge);
      });
    },
    redrawProgramGeometry() {
      const { boxDimensions, boxLocations } = this.programBoxGeometry();
      this.boxes.forEach((box, index) => {
        const edge = this.boxEdges[index];
        const location = boxDimensions[index];
        const position = boxLocations[index];

        const { geometry } = box;
        const newGeometry = new THREE.BoxGeometry(location.width, location.height, location.length);
        geometry.dispose();
        // eslint-disable-next-line no-param-reassign
        box.geometry = newGeometry;
        box.position.set(position.x, position.z, position.y);

        const edgeGeometry = edge.geometry;
        const newEdgeGeometry = new THREE.EdgesGeometry(geometry);
        edgeGeometry.dispose();
        edge.geometry = newEdgeGeometry;
        edge.position.set(position.x, position.z, position.y);
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
    },
    programBoxAreas() {
      const programBoxes = [];
      let prevBoxArea = this.baseArea;

      this.programs.forEach(program => {
        let remainingProgramArea = program.sqft;
        while (remainingProgramArea > 0) {
          const remainingBoxes = remainingProgramArea / this.baseArea;
          let curBoxArea;
          if (prevBoxArea < this.baseArea) {
            curBoxArea = this.baseArea - prevBoxArea;
            programBoxes.push({
              name: program.name,
              area: curBoxArea,
              color: program.color
            });
          } else if (remainingBoxes < 1) {
            curBoxArea = remainingProgramArea;
            programBoxes.push({
              name: program.name,
              area: remainingProgramArea,
              color: program.color
            });
          } else {
            curBoxArea = this.baseArea;
            programBoxes.push({
              name: program.name,
              area: this.baseArea,
              color: program.color
            });
          }
          prevBoxArea = curBoxArea;
          remainingProgramArea -= curBoxArea;
        }
      });
      console.log(programBoxes);
      return programBoxes;
    },
    programBoxGeometry() {
      const boxAreas = this.programBoxAreas();
      const boxDimensions = [];
      boxAreas.forEach(box => {
        const width = this.baseDim;
        const length = box.area / this.baseDim;
        const height = 10;
        const { color } = box;
        boxDimensions.push({ width, length, height, color });
      });

      const boxLocations = [];

      boxDimensions.forEach((dimension, index) => {
        if (index === 0) {
          boxLocations.push({ x: 0, y: 0, z: 0 });
        } else {
          const prevLocation = boxLocations[index - 1];
          const prevDimension = boxDimensions[index - 1];
          const prevEnd = prevLocation.y + prevDimension.length;
          if (prevEnd >= this.baseDim) {
            boxLocations.push({ x: 0, y: 0, z: prevLocation.z + 10 });
          } else {
            boxLocations.push({ x: 0, y: prevEnd, z: prevLocation.z });
          }
        }
      });
      return { boxDimensions, boxLocations };
    }
  }
};
</script>

<style scoped>
.container {
  padding-left: 20px;
}
</style>
