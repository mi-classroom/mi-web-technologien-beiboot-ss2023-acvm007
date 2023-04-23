<script setup>
import { ArToolkitSource, ArToolkitContext, ArMarkerControls} from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import * as THREE from 'three';
import {onMounted, ref} from "vue";

const canvasEl = ref(null)
const scene = new THREE.Scene()
const camera = new THREE.Camera()
const renderer = ref(null)
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity:0.5,
  color:'red',
  side: THREE.DoubleSide
});
const cube = new THREE.Mesh(geometry, material);
const arToolkitSrc = new ArToolkitSource({
  sourceType: 'webcam'
})
const arToolkitCtx = new ArToolkitContext({
  cameraParametersUrl: 'assets/data/camera_para.dat',
  detectionMode: 'color_and_matrix',
})
new ArMarkerControls(arToolkitCtx,camera,{
  type:'pattern',
  patternUrl:'assets/data/marker.patt',
  changeMatrixMode:'cameraTransformMatrix'
})

onMounted(() => {
  renderer.value = new THREE.WebGLRenderer({
    canvas:canvasEl.value,
    antialias:true,
    alpha:true
  });
  cube.position.y = geometry.parameters.height / 2
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
  scene.add(cube);
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
