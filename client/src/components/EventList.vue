<script setup>
import ArMap from "components/ArMap.vue";
import EventInformation from "components/EventInformation.vue";
import {getDistance} from "ol/sphere.js";
import {QDialog, QIcon, QImg, QItem, QItemLabel, QList, QTab, QTabPanel, QTabPanels, QTabs,QBadge} from "quasar";
import {getItemRoute, getMapCoordinates} from "src/scripts/tools.js";
import {useStore} from "stores/useStore.js";
import {computed, onBeforeMount, onBeforeUpdate, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {events, paths} from '../data/store.json'

const props = defineProps({
  listType: {type: String, required: true}
})
const route = useRoute()
const router = useRouter()
const tabs = ref([{
  name: 'list',
  title: 'Listenansicht'
},{
  name: 'map',
  title: 'Kartenansicht'
}])
const selectedEvent = ref(null)
const selected = ref(tabs.value[0].name)
const isEventList = computed(() => props.listType === 'events')
const deviceGps = computed(() => useStore().position)
const items = computed(() => {
  if (isEventList.value) {
    const items = []
    const isPath = route.query.path
    if (isPath) {
      const path = paths.find(path => path.id === route.query.path)
      items.push(...events.filter(event => path.events.includes(event.id)))
    }
    else items.push(...events.filter(event => 'coords' in event))
    return items.sort((a,b) => {
      const distA = getDistanceFromUser(a.coords)
      const distB = getDistanceFromUser(b.coords)
      return distA - distB
    })
  }
  return paths
})

watch(() => props.listType,() => {
  init()
})

onBeforeMount(() => {
    init()
})

onBeforeUpdate(() => {
  init()
})

function init(){
  if(props.listType === 'paths') selected.value = tabs.value[0].name
}

function goTo(item) {
  router.push(getItemRoute(item.id,isEventList.value))
}

function getDistanceFromUser(eventGps) {
  return getDistance(getMapCoordinates(deviceGps.value), getMapCoordinates(eventGps))
}

function getDistanceString(eventGps){
  const distance = getDistanceFromUser(eventGps)
  const isKm = distance > 1000
  const unit = isKm ? 'km' : 'm'
  return `${(isKm ? distance/1000 : distance).toFixed(isKm ? 2 : 0)} ${unit}`
}
</script>

<template>
  <QTabs v-model="selected"
         inline-label
         mobile-arrows
         narrow-indicator
         dense
         active-bg-color="accent"
         class="bg-secondary">
    <QTab v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          :label="tab.title"
          :icon="tab.name"
          :disable="listType === 'paths' && tab.name === 'map'" />
  </QTabs>
  <QTabPanels v-model="selected" animated infinite>
    <QTabPanel v-for="tab in tabs"
               :key="tab.name"
               :name="tab.name"
               :disable="listType === 'paths' && tab.name === 'map'">
      <QList v-if="tab.name === 'list'"
             class="events"
             :separator="isEventList"
             :bordered="isEventList">
        <QItem v-for="event in items"
               :key="event.id"
               :clickable="listType === 'paths'"
               class="q-pa-none"
               @click="goTo(event)">
          <div v-if="isEventList"
               class="full-width row items-center justify-between q-px-md">
            <QItemLabel class="col-6">{{ event.title }}</QItemLabel>
            <QItemLabel class="cursor-pointer">
              <QIcon v-if="'information' in event"
                     class="col-1"
                     name="info"
                     color="primary"
                     size="sm"
                     @click="selectedEvent = event" />
            </QItemLabel>
            <QItemLabel class="col-3 text-right"
                        :key="deviceGps.lng+deviceGps.lat">
              {{ getDistanceString(event.coords) }}
            </QItemLabel>
            <QItemLabel class="col-1 cursor-pointer text-right">
              <QIcon name="svguse:../icons.svg#play"
                     size="sm"
                     color="accent"
                     @click="goTo(event)" />
            </QItemLabel>
          </div>
          <QImg v-else :src="event.background">
            <QItemLabel class="full-width">
              {{ event.title }}
              <QBadge :label="event.events.length"
                      rounded
                      color="accent"
                      align="middle"
              />
            </QItemLabel>
          </QImg>
        </QItem>
      </QList>
      <ArMap v-else :events="items" />
    </QTabPanel>
  </QTabPanels>

  <QDialog :model-value="selectedEvent !== null"
           full-width
           @hide="selectedEvent = null">
    <EventInformation :event="selectedEvent" />
  </QDialog>
</template>
