<script setup>
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js';
import * as THREE from 'three';
import {onBeforeMount, onMounted, ref,reactive} from "vue";

const canvasEl = ref(null)
const hasLoaded = ref(false)
const gpsPlace = reactive({longitute:0,latitude:0})
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);
const arjs = new THREEx.LocationBased(scene, camera);
const geometry = new THREE.BoxGeometry(100,100,100);
const material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity:0.7,
  side: THREE.DoubleSide
});
const box = new THREE.Mesh(geometry, material);
let cam = null
const renderer = ref(null)

onBeforeMount(() => {
  hasLoaded.value = false
  navigator.geolocation.getCurrentPosition((position) => {
    const {longitude,latitude} = position.coords
    gpsPlace.longitute = longitude
    gpsPlace.latitude = latitude
  });
})

onMounted(() => {
  renderer.value = new THREE.WebGLRenderer({canvas: canvasEl.value});
  cam = new THREEx.WebcamRenderer(renderer.value);
  arjs.add(box, gpsPlace.latitude, gpsPlace.longitute - 0.005);
  arjs.startGps()
  requestAnimationFrame(render);
  hasLoaded.value = true
})

function render() {
  const canvas = canvasEl.value
  if(canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    renderer.value.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  deviceOrientationControls.update();
  cam.update();
  renderer.value.render(scene, camera);
  requestAnimationFrame(render);
}
</script>

<template>
  <canvas ref="canvasEl" />
</template>
