<script setup>
import EventInformation from "components/EventInformation.vue";
import {fromLonLat} from "ol/proj.js";
import {getMapCoordinates, updatePosition} from "src/scripts/tools.js";
import {useStore} from "stores/useStore.js";
import {computed, reactive, ref} from "vue";
import {QIcon,QMenu} from "quasar";

const props = defineProps({
  events:{type:Array,default:() => []}
})
const deviceGps = computed(() => useStore().position)
const mapView = ref(null)
const mapConfig = reactive({
  center: fromLonLat(getMapCoordinates(deviceGps.value)),
  projection: 'EPSG:3857',
  zoom: 10,
  enableRotation:false
})
</script>

<template>
  <ol-map :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height: 550px;">
    <ol-view ref="mapView" v-bind="mapConfig" />
    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>
    <ol-overlay v-for="item in events"
                :key="item.id"
                :position="fromLonLat(getMapCoordinates(item.coords))">
      <QIcon name="svguse:../icons.svg#marker"
             class="cursor-pointer marker"
             size="xl"
             color="positive">
        <QMenu cover>
          <EventInformation :event="item" />
        </QMenu>
      </QIcon>
    </ol-overlay>

    <ol-geolocation :projection="mapConfig.projection">
      <ol-vector-layer :zIndex="2">
        <ol-source-vector>
          <ol-feature ref="positionFeature">
            <ol-geom-point :coordinates="fromLonLat(getMapCoordinates(deviceGps))"></ol-geom-point>
            <ol-style>
              <ol-style-circle radius="10">
                <ol-style-fill color="blue"></ol-style-fill>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-geolocation>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature>
          <ol-geom-line-string
            :coordinates="[
                  fromLonLat(getMapCoordinates(deviceGps)),
                  ...events.map(item => fromLonLat(getMapCoordinates(item.coords)))
                ]" />
          <ol-style>
            <ol-style-stroke
              color="orange"
              width="6"
            ></ol-style-stroke>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>
