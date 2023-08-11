<script setup>
import {ArMarkerControls, ArToolkitContext, ArToolkitSource} from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import {Interaction} from "../../libs/three.interaction/index.js";
import InteractionMenu from "components/InteractionMenu.vue";
import {changeGeometry,initThreeJs} from "src/scripts/tools.js";
import {onMounted, ref} from "vue";

const props = defineProps({
  marker: {type: String, default: 'marker'}
})
const visible = ref(false)
const showMenu = ref(false)
const canvasEl = ref(null)
const {THREE,scene,camera,mesh} = initThreeJs()
const renderer = ref(null)
const arToolkitSrc = new ArToolkitSource({
  sourceType: 'webcam'
})
const arToolkitCtx = new ArToolkitContext({
  cameraParametersUrl: 'camera_para.dat',
  detectionMode: 'color_and_matrix',
})
new ArMarkerControls(arToolkitCtx, camera, {
  type: 'pattern',
  patternUrl: `${props.marker}.patt`,
  changeMatrixMode: 'cameraTransformMatrix'
})

onMounted(() => {
  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasEl.value,
    antialias: true,
    alpha: true
  });
  scene.visible = false
  arToolkitSrc.init(() => {
    setTimeout(() => {
      arToolkitSrc.onResizeElement()
      arToolkitSrc.copyElementSizeTo(renderer.value.domElement)
    }, 100)
  })
  arToolkitCtx.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitCtx.getProjectionMatrix());
  });
  new Interaction(renderer.value,scene,camera)
  mesh.pointer = 'cursor'
  mesh.on('click', () => {
    showMenu.value = visible.value ? !showMenu.value : false
  })
  scene.add(camera)
  scene.add(mesh);
  animate()
})

function animate() {
  requestAnimationFrame(animate);
  arToolkitCtx.update(arToolkitSrc.domElement)
  scene.visible = camera.visible
  visible.value = scene.visible
  renderer.value.render(scene, camera);
}
</script>

<template>
  <InteractionMenu :mesh="mesh"
                   :visible="visible"
                   :show="showMenu"
                   @change-geometry="changeGeometry(mesh,$event)"
                   @hide="showMenu = false" />
  <canvas ref="canvasEl" />
</template>
