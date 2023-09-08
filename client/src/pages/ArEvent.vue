<script setup>
import CustomLoader from "components/CustomLoader.vue";
import {getBtnTexture, newEvent} from "src/scripts/tools.js";
import {ref, onMounted, onUnmounted, computed, toRaw} from "vue";
import {events} from '../data/store.json'
import * as THREE from 'three'

const props = defineProps({
  id:{type:String,required:true},
  eventType:{type:String,required:true}
})
const RAYCASTER = new THREE.Raycaster();
const MOUSE = new THREE.Vector2();
const isLoading = ref(false)
const canvasEl = ref(null)
const videoEl = ref(null)
const audioEl = ref(null)
const event = computed(() => events.find(ev => ev.id === props.id))
const arEvent = ref(null)
const hasPlayableMedia = computed(() => ['video', 'audio'].some(key => key in event.value.media))
const animationFrameId = ref(null)

onMounted(async () => {
  isLoading.value = true
  if(hasPlayableMedia.value) {
    if(videoEl.value) await videoEl.value.load()
    if(audioEl.value) await audioEl.value.load()
  }
  else await doLoad()
})

onUnmounted(async () => {
  isLoading.value = true
  const videos = document.getElementsByTagName('video')
  for(const video of videos){
    const mediaStream = video.srcObject;
    if(mediaStream){
      mediaStream.getTracks().forEach(track => track.stop())
    }
    document.body.removeChild(video)
  }
  cancelAnimationFrame(animationFrameId.value)
  isLoading.value = false
})

async function loadEvent(){
  if(['video','audio'].every(key => key in event.value.media) && videoEl.value && audioEl.value) await doLoad()
  else if('video' in event.value.media && videoEl.value) await doLoad()
  else if('audio' in event.value.media && audioEl.value) await doLoad()
}

async function doLoad(){
  arEvent.value = await newEvent(event.value,canvasEl.value,videoEl.value,hasPlayableMedia.value)
  if(hasPlayableMedia.value){
    arEvent.value.playButton.callback = () => {
      [videoEl.value,audioEl.value].forEach(el => {
        if(el){
          if(arEvent.value.playButton.isPlaying) el.pause()
          else el.play()
        }
      })
      arEvent.value.playButton.isPlaying = !arEvent.value.playButton.isPlaying
      arEvent.value.playButton.material = getBtnTexture(arEvent.value.playButton.isPlaying)
    }
  }
  render()
  isLoading.value = false
}

function canvasClick(clickEvent){
  clickEvent.preventDefault();
  MOUSE.x = (clickEvent.clientX / arEvent.value.renderer.domElement.clientWidth) * 2 - 1;
  MOUSE.y = -(clickEvent.clientY / arEvent.value.renderer.domElement.clientHeight) * 2 + 1;
  RAYCASTER.setFromCamera(MOUSE, arEvent.value.camera);
  const intersects = RAYCASTER.intersectObjects(arEvent.value.scene.children);
  if (intersects.length > 0 && 'callback' in intersects[0].object) {
    intersects[0].object.callback()
  }
}

function render(){
  animationFrameId.value = requestAnimationFrame(render);
  const {clientWidth, clientHeight} = document.body
  if (!!canvasEl.value && (canvasEl.value.width !== canvasEl.value.clientWidth || canvasEl.value.height !== canvasEl.value.clientHeight)) {
    canvasEl.value.width = clientWidth
    canvasEl.value.height = clientHeight
    arEvent.value.renderer.setSize(canvasEl.value.clientWidth, canvasEl.value.clientHeight, false);
    arEvent.value.camera.aspect = canvasEl.value.clientWidth / canvasEl.value.clientHeight;
    toRaw(arEvent.value.camera).updateProjectionMatrix();
  }
  if (arEvent.value.isMarker) {
    arEvent.value.arToolkitCtx.update(arEvent.value.arToolkitSrc.domElement)
  }
  else {
    arEvent.value.deviceOrientationControls.update();
    toRaw(arEvent.value.cam).update();
  }
  arEvent.value.scene.visible = arEvent.value.camera.visible
  arEvent.value.renderer.render(toRaw(arEvent.value.scene), toRaw(arEvent.value.camera));
}
</script>

<template>
  <CustomLoader v-if="isLoading" />
  <canvas ref="canvasEl" :key="eventType+id" @click="canvasClick" />
  <template v-if="hasPlayableMedia">
    <video ref="videoEl"
           v-if="'video' in event.media"
           loop
           crossOrigin="anonymous"
           playsinline
           :muted="'audio' in event.media"
           preload="auto"
           style="display:none"
           @canplay.once="loadEvent">
      <source :src="event.media.video" type="video/mp4">
    </video>
    <audio ref="audioEl"
           v-if="'audio' in event.media"
           loop
           crossOrigin="anonymous"
           preload="auto"
           style="display:none"
           @canplay.once="loadEvent">
      <source :src="event.media.audio" type="audio/mp3">
    </audio>
  </template>
</template>
