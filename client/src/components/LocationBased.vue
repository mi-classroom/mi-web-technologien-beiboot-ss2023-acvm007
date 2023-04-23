<script setup>
import CustomLoader from "components/CustomLoader.vue";
import {onBeforeMount, reactive,ref} from "vue";

const gpsPlace = ref(null)

onBeforeMount(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    gpsPlace.value = `latitude: ${position.coords.latitude}; longitude: ${position.coords.longitude};`
  });
})
</script>

<template>
  <template v-if="gpsPlace">
    LOCATION: {{gpsPlace}}
  </template>
  <CustomLoader v-else />
</template>
