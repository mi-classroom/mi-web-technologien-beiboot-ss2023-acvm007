<script setup>
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js';
import {getSound, onSceneChange, setToast} from "src/scripts/tools.js";
import * as THREE from 'three';
import {onMounted, ref,reactive} from "vue";

const canvasEl = ref(null)
const hasLoaded = ref(false)
const gpsPlace = reactive({longitude:0, latitude:0})
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);
const geometry = new THREE.BoxGeometry(100,100,100);
const material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity:0.7,
  side: THREE.DoubleSide
});
const box = new THREE.Mesh(geometry, material);
let cam = null
const renderer = ref(null)
const sound = ref(getSound('audio1.mp3'))
const arjs = new THREEx.LocationBased(scene, camera);
const visible = ref(false)
const key = ref(0)

arjs.on('gpsupdate',position => {
  /*const {longitude,latitude} = position.coords
  if(longitude !== gpsPlace.latitude || latitude !== gpsPlace.latitude) {
    updatePosition(longitude,latitude)
    setToast(`Location updated to ${JSON.stringify(gpsPlace)}`, 'positive')
  }*/
})

onMounted(async () => {
  hasLoaded.value = false
  renderer.value = new THREE.WebGLRenderer({canvas: canvasEl.value});
  cam = new THREEx.WebcamRenderer(renderer.value);
  await handlePermission()
  requestAnimationFrame(render);
  hasLoaded.value = true
})

async function handlePermission(){
  const result = await navigator.permissions.query({name:'geolocation'})
  if(result.state === 'prompt' || result.state === 'granted') {
    navigator.geolocation.getCurrentPosition((position) => {
      const {longitude,latitude} = position.coords
      updatePosition(longitude,latitude)
      arjs.add(box,longitude, latitude - 0.005);
      arjs.startGps()
    })
  }
  else console.log('DENIED');
}

function updatePosition(longitude,latitude){
  gpsPlace.longitude = longitude
  gpsPlace.latitude = latitude
}

function render() {
  const canvas = canvasEl.value
  const {clientWidth,clientHeight} = document.body
  if(!!canvas && (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
    canvas.width = clientWidth
    canvas.height = clientHeight
    renderer.value.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  deviceOrientationControls.update();
  cam.update();
  renderer.value.render(scene, camera);
  visible.value = box.visible
  onSceneChange(sound.value,false)
  requestAnimationFrame(render);
}
</script>

<template>
  <canvas ref="canvasEl" />
</template>
