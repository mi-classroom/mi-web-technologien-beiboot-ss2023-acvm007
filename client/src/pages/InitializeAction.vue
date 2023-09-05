<script setup>
import EventList from "components/EventList.vue";
import {QImg,QIcon,QItem,QItemLabel,QItemSection,QList,QDialog,QCard,QCardSection,QCardActions,QBtn,QSeparator} from "quasar";
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {paths} from '../data/store.json'

const props = defineProps({
  action:{type:String,required:true}
})
const showHelp = ref(false)
const image = computed(() => {
  const base = import.meta.env.BASE_URL
  const src = 'images/aufmacher-154533fee13c9847.png'
  if(base.endsWith('/')) return base+src
  return [base,src].join('/')
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

function navigate(action){
  return {name:'Start',params:{action}}
}
</script>

<template>
  <QItem class="full-width bg-white text-black">
    <QItemSection avatar>
      <QIcon name="svguse:../icons.svg#arrow"
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
        :src="image"
        fit="cover"
        alt="Aufmacher" />
  <QList v-else class="useAr">
    <QItem class="bg-primary text-white"
           clickable
           :to="navigate('nearby')">
      <QIcon name="svguse:../icons.svg#radar" color="white" />
      <QItemLabel>ARlebnisse in der Umgebung anzeigen</QItemLabel>
    </QItem>
    <QItem class="bg-accent text-white"
           clickable
           :to="navigate('start')">
      <QIcon name="svguse:../icons.svg#qrCode" color="white" />
      <QItemLabel>ARlebnis via QR Code starten</QItemLabel>
    </QItem>
    <QItem class="bg-grey-5 text-black" clickable @click="showHelp = true">
      <QIcon name="svguse:../icons.svg#help" color="black" />
      <QItemLabel>Ich habe keine Ahnung: {{showHelp}}</QItemLabel>
    </QItem>
  </QList>

  <QDialog v-model="showHelp" @hide="showHelp = false">
    <QCard>
      <QCardSection class="text-center">Hilfe zur Demoanwendung</QCardSection>
      <QSeparator />
      <QCardSection class="text-center">
        Hilfe, wie Sie die Anwendung verwenden und mehr Informationen zum Projekt finden Sie im <a href="https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2023-acvm007/wiki/Demoanwendung">Wiki</a>
      </QCardSection>
      <QSeparator />
      <QCardActions align="between">
        <QBtn label="ARLebnis mit QR Code starten"
              icon="svguse:../icons.svg#qrCode"
              color="accent"
              text-color="white"
              padding="0.5rem"
              style="max-width: 45%"
              no-caps
              :to="navigate('start')" />
        <QBtn label="ARlebnisse in der Umgebung"
              icon="svguse:../icons.svg#radar"
              color="black"
              text-color="white"
              padding="0.5rem"
              no-caps
              style="max-width: 45%"
              :to="navigate('nearby')" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
