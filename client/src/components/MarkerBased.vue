<script setup>
import { ArToolkitSource, ArToolkitContext, ArMarkerControls} from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import {getSound} from "src/scripts/tools.js";
import {useStore} from "stores/useStore.js";
import * as THREE from 'three';
import {onMounted, ref} from "vue";

const props = defineProps({
  marker:{type:String,default:'marker'}
})

const store = useStore()
const sound = getSound('audio1.mp3')
const canvasEl = ref(null)
const scene = new THREE.Scene()
const camera = new THREE.Camera()
const renderer = ref(null)
const geometry = new THREE.BoxGeometry(0.9,0.9,0.9);
const material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity:0.5,
  side: THREE.DoubleSide
});
const cube = new THREE.Mesh(geometry, material);
const arToolkitSrc = new ArToolkitSource({
  sourceType: 'webcam'
})
const arToolkitCtx = new ArToolkitContext({
  cameraParametersUrl: 'camera_para.dat',
  detectionMode: 'color_and_matrix',
})
const arMarker = new ArMarkerControls(arToolkitCtx,camera,{
  type:'pattern',
  patternUrl:`${props.marker}.patt`,
  changeMatrixMode:'cameraTransformMatrix'
})

arMarker.addEventListener('markerFound',() => {
  if(store.isAudio) sound.play();
})

arMarker.addEventListener('markerLost',() => {
  console.log('Lost Marker');
  if(store.isAudio) sound.pause();
})

onMounted(() => {
  renderer.value = new THREE.WebGLRenderer({
    canvas:canvasEl.value,
    antialias:true,
    alpha:true
  });
  scene.visible = false
  arToolkitSrc.init(() => {
    setTimeout(() => {
      arToolkitSrc.onResizeElement()
      arToolkitSrc.copyElementSizeTo(renderer.value.domElement)
    },100)
  })
  arToolkitCtx.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitCtx.getProjectionMatrix());
  });
  scene.add(camera)
  if(!store.isAudio) scene.add(cube);
  animate()
})

function animate() {
  requestAnimationFrame(animate);
  arToolkitCtx.update(arToolkitSrc.domElement)
  scene.visible = camera.visible
  renderer.value.render(scene,camera);
}
</script>

<template>
  <canvas ref="canvasEl" />
</template>
