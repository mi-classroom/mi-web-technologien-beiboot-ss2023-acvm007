<script setup>
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js';
import InteractionMenu from "components/InteractionMenu.vue";
import {initThreeJs, OPTIONS, setToast} from "src/scripts/tools.js";
import {Interaction} from "../../libs/three.interaction/index.js";
import {onMounted, ref,reactive} from "vue";

const visible = ref(false)
const showMenu = ref(false)
const canvasEl = ref(null)
const hasLoaded = ref(false)
const deviceGps = reactive({longitude:0, latitude:0})
const markerGps = reactive({longitude:7.5678735, latitude:51.0219481})
const {THREE,scene,camera,mesh} = initThreeJs(100)
const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);
let cam = null
const renderer = ref(null)
const arjs = new THREEx.LocationBased(scene, camera);

arjs.on('gpsupdate',position => {
  updatePosition(position.coords)
})

arjs.on('gpserror',() => {
  setToast(`Location error!`,'negative')
})

arjs.add(mesh,markerGps.longitude, markerGps.latitude);
mesh.pointer = 'cursor'
mesh.on('click', () => {
  showMenu.value = visible.value ? !showMenu.value : false
})
arjs.startGps()

onMounted(async () => {
  hasLoaded.value = false
  renderer.value = new THREE.WebGLRenderer({canvas: canvasEl.value});
  cam = new THREEx.WebcamRenderer(renderer.value);
  new Interaction(renderer.value,scene,camera)
  await handlePermission()
  requestAnimationFrame(render);
  hasLoaded.value = true
})

async function handlePermission(){
  const result = await navigator.permissions.query({name:'geolocation'})
  if(result.state === 'prompt' || result.state === 'granted') {
    navigator.geolocation.getCurrentPosition((position) => {
      updatePosition(position.coords)
    })
  }
  else console.log('DENIED');
}

function updatePosition({longitude, latitude}){
  deviceGps.longitude = longitude
  deviceGps.latitude = latitude
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
  visible.value = mesh.visible
  requestAnimationFrame(render);
}
</script>

<template>
  <p>You are at: {{deviceGps}}, Marker placed at: {{markerGps}}</p>
  <InteractionMenu :mesh="mesh"
                   :visible="visible"
                   :show="showMenu"
                   :included-options="[OPTIONS.AUDIO]"
                   @hide="showMenu = false" />
  <canvas ref="canvasEl" />
</template>
