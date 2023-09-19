<script setup>
import {QCard,QCardSection,QCardActions,QImg,QVideo,QBtn} from "quasar";
import {useRouter} from "vue-router";
import {getItemRoute} from "src/scripts/tools.js";

const props = defineProps({
  event:{type:Object,required:true}
})
const router = useRouter()

function goTo(){
  router.push(getItemRoute(props.event.id,true))
}
</script>

<template>
  <QCard>
    <QCardSection>
      Informationen zum ARLebnis "{{event.title}}"
    </QCardSection>
    <template v-if="'information' in event">
      <QVideo v-if="event.information.video"
              referrerpolicy="no-referrer"
              :src="event.information.video" />
      <QImg v-if="event.information.image"
            :src="event.information.image" />
      <QCardSection>{{event.information.text}}</QCardSection>
    </template>
    <QCardSection v-else>
      Keine weiterführenden Informationen zu diesem ARlebnis
    </QCardSection>
    <QCardActions align="between">
      <QBtn label="Schliessen"
            color="black"
            v-close-popup />
      <QBtn label="ARlebnis starten"
            color="accent"
            v-close-popup
            @click="goTo" />
    </QCardActions>
  </QCard>
</template>
