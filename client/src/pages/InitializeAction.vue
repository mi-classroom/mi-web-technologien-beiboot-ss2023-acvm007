<script setup>
import EventList from "components/EventList.vue";
import {QImg,QIcon,QItem,QItemLabel,QItemSection,QList} from "quasar";
import {computed} from "vue";
import {useRoute} from "vue-router";
import {paths} from '../data/store.json'

const props = defineProps({
  action:{type:String,required:true}
})
const route = useRoute()
const text = computed(() => {
  if(props.action === 'pokeAround') return 'Bitte wählen Sie einen ARlebnispfad'
  else if(props.action === 'nearby'){
    if(route.query.path) {
      const path = paths.find(path => path.id === route.query.path)
      if(path) return `ARlebnisse in ${path.title}`
    }
    else return 'ARlebnisse in der Umgebung'
  }
  return 'Wie wollen Sie starten?'
})
</script>

<template>
  <QItem class="full-width bg-white text-black">
    <QItemSection avatar>
      <QIcon name="svguse:/icons.svg#arrow"
             size="sm"
             color="black"
             class="cursor-pointer"
             @click="$router.back()" />
    </QItemSection>
    <QItemSection>
      <QItemLabel>{{text}}</QItemLabel>
    </QItemSection>
  </QItem>
  <EventList v-if="['pokeAround','nearby'].includes(action)"
               :list-type="action === 'pokeAround' ? 'paths' : 'events'" />
  <QImg v-else-if="action === 'start'"
        src="/images/aufmacher-154533fee13c9847.png"
        fit="cover"
        alt="Aufmacher" />
  <QList v-else class="useAr">
    <QItem class="bg-primary text-white"
           clickable
           :to="{name:'Start',params:{action:'nearby'}}">
      <QIcon name="svguse:/icons.svg#radar" color="white" />
      <QItemLabel>ARlebnisse in der Umgebung anzeigen</QItemLabel>
    </QItem>
    <QItem class="bg-accent text-white"
           clickable
           :to="{name:'Start',params:{action:'start'}}">
      <QIcon name="svguse:/icons.svg#qrCode" color="white" />
      <QItemLabel>ARlebnis via QR Code starten</QItemLabel>
    </QItem>
    <QItem class="bg-grey-5 text-black">
      <QIcon name="svguse:/icons.svg#help" color="black" />
      <QItemLabel>Ich habe keine Ahnung</QItemLabel>
    </QItem>
  </QList>
</template>
