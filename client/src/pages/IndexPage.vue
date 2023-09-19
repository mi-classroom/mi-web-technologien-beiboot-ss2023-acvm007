<script setup>
import {ref} from "vue";
import {QIcon,QBtn,QItemLabel,QItemSection} from "quasar";

const isDev = import.meta.env.DEV
const btns = ref([{
  text: 'Ich will nur ein bisschen',
  option: 'stöbern',
  action: 'pokeAround'
},{
  text: 'Ich will die ARlebnisse',
  option: 'nutzen',
  action: 'use'
}])
</script>

<template>
  <section v-if="$route.query.start" id="choose">
    <QBtn v-for="btn in btns"
          :key="btn.event"
          text-color="white"
          size="xl"
          no-caps
          square
          :ripple="{early:true,color: 'orange-8'}"
          :to="{name:'Start',params:{action:btn.action}}">
      <QItemSection>
        <QItemLabel overline class="text-white">{{btn.text}}</QItemLabel>
        <QItemLabel class="text-bold text-white">{{btn.option}}</QItemLabel>
      </QItemSection>
    </QBtn>
  </section>
  <section v-else id="start">
    <h2 class="text-black q-ma-none">
      <span class="text-orange text-bold">AR</span>
      <span class="text-bold">lebnispfade</span>
      <span>Oberbergischer Kreis</span>
    </h2>
    <video src="intro-video.mp4"
           autoplay
           loop
           :muted="isDev" />
    <QIcon name="svguse:icons.svg#arrow"
           size="xl"
           color="white"
           @click="$router.replace({name:'Index',query:{start:false}})" />
  </section>
</template>
