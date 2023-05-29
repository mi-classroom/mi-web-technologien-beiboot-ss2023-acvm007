<script setup>
import {ArToolkitSource, ArToolkitContext, ArMarkerControls} from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import AudioInterface from "components/AudioInterface.vue";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {DragControls} from "three/examples/jsm/controls/DragControls.js";
import {func} from "three/nodes";
import {onMounted, reactive, ref} from "vue";
import {QMenu, QBtn, QIcon, QList, QItem,QItemSection,QItemLabel} from "quasar";

const props = defineProps({
  marker: {type: String, default: 'marker'}
})

const canvasEl = ref(null)
const soundId = ref(null)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
const renderer = ref(null)
const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
const visible = ref(false)
const material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
})
const sound = ref(null)
const mesh = new THREE.Mesh(geometry, material);
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
const interfaceControls = reactive({
  show: false,
  options: [{
    name: 'Visualisierung',
    icon: 'eye',
    options: [{
      name: 'Würfel',
      type: 'box',
      icon:'cube-outline',
      disabled: mesh.geometry.type === 'BoxGeometry'
    }, {
      name: 'Sphere',
      type: 'sphere',
      icon:'sphere',
      disabled: mesh.geometry.type === 'SphereGeometry'
    }]
  }, {
    name: 'Audiosteuerung',
    icon: 'headphones-box'
  }]
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
  const orbitControls = new OrbitControls(camera, renderer.value.domElement);
  orbitControls.enabled = false;
  canvasEl.value.addEventListener("touchstart", function (event) {
    event.preventDefault();
    interfaceControls.show = !interfaceControls.show && scene.visible
  }, false);
  scene.add(camera)
  scene.add(mesh);
  animate()
})

function meshClick(type) {
  mesh.geometry.dispose();
  if (type === 'box') {
    mesh.geometry = new THREE.BoxGeometry();
  }
  else if(type === 'sphere') {
    mesh.geometry = new THREE.SphereGeometry();
  }
  interfaceControls.options[0].options[0].disabled = type === 'box'
  interfaceControls.options[0].options[1].disabled = type === 'sphere'
}

function interfaceHandler(type) {
  if(['box','sphere'].includes(type)) meshClick(type)
  else {
    console.log(type)
  }
  interfaceControls.show = false
}

function setSound(audio){
  sound.value = audio
}

function animate() {
  requestAnimationFrame(animate);
  arToolkitCtx.update(arToolkitSrc.domElement)
  scene.visible = camera.visible
  visible.value = scene.visible
  if(sound.value){
    if(visible.value && !sound.value.playing()) sound.value.play()
    else if(!visible.value && sound.value.playing()) sound.value.pause()
  }
  renderer.value.render(scene, camera);
}
</script>

<template>
  <QMenu :model-value="interfaceControls.show"
         :target="true"
         touch-position
         class="interface">
    <QBtn v-for="control in interfaceControls.options"
          :key="control.title"
          :disable="control.disabled"
          :label="control.name"
          flat
          unelevated
          ripple
          color="black">
      <QMenu anchor="bottom left" self="top left">
        <QList v-if="control.options" class="bg-white">
          <QItem v-for="option in control.options"
                 :key="option.name"
                 :disable="option.disabled"
                 :clickable="!option.disabled"
                 v-close-popup
                 class="text-black"
                 @click="interfaceHandler(option.type)">
            <QItemSection avatar>
              <QIcon :name="option.icon" color="black" />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ option.name }}</QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
        <AudioInterface v-else
                        :visible="visible"
                        :sound-id="soundId"
                        @set-sound-id="soundId = $event"
                        @set-sound="setSound" />
      </QMenu>
    </QBtn>
  </QMenu>
  <canvas ref="canvasEl" />
</template>
