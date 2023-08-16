<script setup>
import {QList,QItem,QItemLabel,QImg} from "quasar";
import {useStore} from "stores/useStore.js";
import {computed} from "vue";
import {paths,events} from '../data/store.json'
import {useRoute} from "vue-router";
import leaflet from 'leaflet'

const props = defineProps({
  listType:{type:String,required:true}
})
const route = useRoute()
const isEventList = computed(() => props.listType === 'events')
const deviceGps = computed(() => useStore().position)
const items = computed(() => {
  if(isEventList.value) {
    if(route.query.path){
      const path = paths.find(path => path.id === route.query.path)
      return events.filter(event => {
        return path.events.includes(event.id)
      })
    }
    return events
  }
  return paths
})

function getRoute(item){
  const name = isEventList.value ? 'ArEvent' : 'Start'
  const params = {}
  const query = {}
  if(isEventList.value){
    params.eventType = 'events'
    params.id = item.id
  }
  else {
    params.action = 'nearby'
    query.path = item.id
  }
  return {name,params,query}
}

function getDistance(eventGps){
  //Code copied from: https://www.geodatasource.com/developers/javascript
  const {lng:lon1,lat:lat1} = deviceGps.value
  const {lng:lon2,lat:lat2} = eventGps
  let distance
  if ((lat1 === lat2) && (lon1 === lon2)) {
    distance = 0;
  }
  else {
    const radlat1 = Math.PI * lat1/180;
    const radlat2 = Math.PI * lat2/180;
    const theta = lon1-lon2;
    const radtheta = Math.PI * theta/180;
    distance = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (distance > 1) distance = 1;
    distance = Math.acos(distance);
    distance *= 180/Math.PI;
    distance *= 60 * 1.1515;
    distance *= 1.609344
  }
  return (distance * 1000).toFixed(2)
}
</script>

<template>
  <QList class="events"
         :separator="isEventList"
         :bordered="isEventList">
    <QItem v-for="item in items"
           :key="item.id"
           clickable
           class="q-pa-none"
           :to="getRoute(item)">
      <div v-if="isEventList"
           class="full-width row items-center justify-between q-px-md">
        <QItemLabel>{{item.title}}</QItemLabel>
        <QItemLabel>{{getDistance(item.coords)}} m</QItemLabel>
      </div>
      <QImg v-else :src="item.background">
        <QItemLabel class="full-width">{{item.title}}</QItemLabel>
      </QImg>
    </QItem>
  </QList>
</template>
