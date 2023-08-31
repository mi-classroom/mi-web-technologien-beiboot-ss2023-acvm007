<script setup>
import {setToast, updatePosition, userMediaConstraints} from "src/scripts/tools.js";
import {useStore} from "stores/useStore.js";
import {onMounted, ref} from "vue";
import eruda from 'eruda'

const hasToasted = ref(false)
if(import.meta.env.DEV) eruda.init({tool: ['console']})
onMounted(async () => {
  navigator.mediaDevices.getUserMedia(userMediaConstraints).then(() => {
    setToast('Ihre Kamera wird zur Darstellung der ARlebnisse verwendet')
  })
  navigator.geolocation.watchPosition(({coords}) => {
    const {latitude,longitude} =  coords
    updatePosition({lng:longitude,lat:latitude})
    if(!hasToasted.value){
      setToast('Ihre Position wird für ein besseres ARlebnis verwendet')
      hasToasted.value = true
    }
  })
})
</script>

<template>
  <router-view />
</template>
