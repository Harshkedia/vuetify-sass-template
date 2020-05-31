/* eslint-disable no-param-reassign */
<template>
  <v-container>
    <v-card class="card" outlined>
      <div ref="modelContainer" class="container">
        <canvas ref="viewer" />
        <v-slider
          v-model="baseArea"
          label="Base Area"
          :max="100000"
          :min="10000"
          hide-details
          dense
          color="#002855"
        >
          <template v-slot:append>
            <p>{{ baseArea }}</p>
          </template>
        </v-slider>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: "ModelViewer",
  components: {},
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      }
    },
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
      ambientLight: null,
      light: null,
      boxes: [],
      boxEdges: [],
      baseArea: 10000
    };
  },
  computed: {
    canvas() {
      return this.$refs.viewer;
    },
    programs: {
      get() {
        return this.option.programs;
      }
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
      this.scene.background = new THREE.Color(0xffffff);

      this.scene.add(this.ambientLight);
      this.scene.add(this.light);

      window.addEventListener("resize", this.onWindowResize, false);
      this.drawProgramGeometry();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.redrawProgramGeometry();
    },
    disposeBoundingBox() {
      this.boundingBox.geometry.dispose();
      this.boundingBox.material.dispose();
      this.scene.remove(this.boundingBox);

      this.boundingBoxEdges.geometry.dispose();
      this.boundingBoxEdges.material.dispose();
      this.scene.remove(this.boundingBoxEdges);
    },
    drawProgramGeometry() {
      const { boxDimensions, boxLocations } = this.programBoxGeometry();
      const boxes = [];
      const boxEdges = [];
      boxDimensions.forEach((dimension, index) => {
        const location = boxLocations[index];

        const geometry = new THREE.BoxGeometry(dimension.width, dimension.height, dimension.length);
        const material = new THREE.MeshBasicMaterial({ color: dimension.color });
        const box = new THREE.Mesh(geometry, material);

        box.position.set(location.x, location.z, location.y + dimension.length / 2);

        const edgeGeometry = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edge.position.set(location.x, location.z, location.y + dimension.length / 2);

        this.scene.add(box);
        this.scene.add(edge);

        boxes.push(box);
        boxEdges.push(edge);
      });
      this.boxes = boxes;
      this.boxEdges = boxEdges;
    },
    redrawProgramGeometry() {
      this.disposeProgramGeometry();
      this.drawProgramGeometry();
    },
    disposeProgramGeometry() {
      this.boxes.forEach((box, index) => {
        const edge = this.boxEdges[index];
        box.geometry.dispose();
        box.material.dispose();
        this.scene.remove(box);

        edge.geometry.dispose();
        edge.material.dispose();
        this.scene.remove(edge);
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
    programBoxAreas() {
      const programBoxes = [];
      let remainingFloorArea = this.baseArea;

      this.programs.forEach(program => {
        let remainingProgramArea = program.sqft;
        while (remainingProgramArea > 1) {
          let curBoxArea;
          if (remainingProgramArea >= remainingFloorArea) {
            curBoxArea = remainingFloorArea;
            remainingFloorArea = this.baseArea;
          } else {
            curBoxArea = remainingProgramArea;
            remainingFloorArea -= curBoxArea;
          }
          programBoxes.push({
            name: program.name,
            area: curBoxArea,
            color: program.color
          });
          remainingProgramArea -= curBoxArea;
        }
      });
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

          if (prevEnd >= this.baseDim - 1) {
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
.card {
  padding: 20px;
}
p {
  font-size: 10px;
}
::v-deep .v-label {
  font-size: 10px;
}
</style>
