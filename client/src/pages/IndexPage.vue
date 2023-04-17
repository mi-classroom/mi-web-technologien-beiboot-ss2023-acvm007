<script setup>
import {QBtn} from "quasar";
import {ref} from "vue";

const videoEl = ref(null)
const showVideo = ref(false)
const facingMode = ref('environment')

function getConstraints(){
  return{
    audio: false,
    video: {
      width: 1920,
      height: 1080,
      facingMode:facingMode.value
    }
  }
}

async function startVideo(){
  try {
    videoEl.value.srcObject = await navigator.mediaDevices.getUserMedia(getConstraints())
    showVideo.value = true
  } catch (error) {
    alert(`${error.name}`)
    console.error(error)
  }
}

async function changeVideo(){
  showVideo.value = false
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  await startVideo()
}

function stopVideo(){
  videoEl.value.srcObject.getVideoTracks()[0].stop()
  showVideo.value = false
}
</script>

<template>
  <div class="row items-center justify-between q-pb-md">
    <QBtn color="positive"
          label="Start video capture"
          :disable="showVideo"
          @click="startVideo" />
    <QBtn color="negative"
          label="Stop video capture"
          :disable="!showVideo"
          @click="stopVideo" />
  </div>
  <div class="video">
    <QBtn color="accent"
          icon="flip"
          round
          :disable="!showVideo"
          @click="changeVideo" />
    <video ref="videoEl"
           v-show="showVideo"
           autoplay />
  </div>
</template>
