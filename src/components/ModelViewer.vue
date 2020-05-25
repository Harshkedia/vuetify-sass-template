<template>
  <div ref="modelContainer" class="container">
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
      boxEdges: []
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
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      // this.redrawBoundingBox();
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
      const boxInfos = [];
      this.programs.forEach((program, index) => {
        const numUnits = program.units;
        const unitGSF = program.gsf;
        const unitDim = unitGSF / this.baseDim;
        const level = index;
        const boxLocations = [];
        const boxPositions = [];

        let curUnitLoc = 0;
        for (let i = 0; i < numUnits; i += 1) {
          const boxLocation = { x: unitDim, y: 10, z: this.baseDim };
          const boxPosition = { x: curUnitLoc, y: level * 10, z: 0 };

          curUnitLoc += unitDim;
          boxLocations.push(boxLocation);
          boxPositions.push(boxPosition);
        }
        boxInfos.push({ locations: boxLocations, positions: boxPositions });
      });
      return boxInfos;
    },
    drawProgramGeometry() {
      const boxInfo = this.computeProgramGeometry();
      boxInfo.forEach(info => {
        const material = new THREE.MeshBasicMaterial({ color: this.getRandomColor() });
        const { locations, positions } = info;
        const unitBoxes = [];
        const unitEdges = [];

        locations.forEach((location, index) => {
          const position = positions[index];
          const geometry = new THREE.BoxGeometry(location.x, location.y, location.z);
          const box = new THREE.Mesh(geometry, material);
          box.position.set(position.x, position.y, position.z);

          const edgeGeometry = new THREE.EdgesGeometry(geometry);
          const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
          const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);
          edge.position.set(position.x, position.y, position.z);

          unitBoxes.push(box);
          unitEdges.push(edge);
        });

        unitBoxes.forEach(box => {
          this.scene.add(box);
        });
        unitEdges.forEach(edge => {
          this.scene.add(edge);
        });
        this.boxes.push(unitBoxes);
        this.boxEdges.push(unitEdges);
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
