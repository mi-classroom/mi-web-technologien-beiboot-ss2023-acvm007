<script setup>
import CustomLoader from "components/CustomLoader.vue";
import {QBtn,QItemLabel} from "quasar";
import {newEvent} from "src/scripts/tools.js";
import {ref, onMounted, onUnmounted, computed, reactive, toRaw} from "vue";
import {events} from '../data/store.json'

const props = defineProps({
  id:{type:String,required:true},
  eventType:{type:String,required:true}
})
const isLoading = ref(false)
const canvasEl = ref(null)
const event = computed(() => events.find(ev => ev.id === props.id))
const arEvent = ref({})

onMounted(async () => {
  isLoading.value = true
  arEvent.value = await newEvent(event.value,canvasEl.value)
  isLoading.value = false
})

onUnmounted(async () => {
  isLoading.value = true
  const video = document.getElementById('arjs-video')
  const mediaStream = video.srcObject;
  const tracks = mediaStream.getTracks();
  tracks.forEach(track => track.stop())
  document.body.removeChild(video)
  isLoading.value = false
})
</script>

<template>
  <CustomLoader v-if="isLoading" />
  <canvas v-show="!isLoading" ref="canvasEl" :key="eventType+id" />
</template>
