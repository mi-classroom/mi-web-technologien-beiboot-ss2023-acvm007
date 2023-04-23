<script setup>
import { ref } from 'vue'
import {QLayout,QDrawer,QHeader,QPage,QPageContainer,QBtn,QList,QItemLabel,QToolbar,QToolbarTitle,QItem} from "quasar";

const leftDrawerOpen = ref(false)
const links = [{
  title:'Startseite',
  to:{name:'Index'}
},{
  title:'AR mit GPS Koordinaten',
  to:{name:'Location'}
},{
  title:'AR mit einem Marker',
  to:{name:'Marker'}
}]
</script>

<template>
  <QLayout view="lHh Lpr lFf">
    <QHeader elevated>
      <QToolbar>
        <QBtn flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="leftDrawerOpen = !leftDrawerOpen" />

        <QToolbarTitle>
          ARlebnispfade Oberbergischer Kreis
        </QToolbarTitle>

        <div>Webtech Beiboot 2023</div>
      </QToolbar>
    </QHeader>

    <QDrawer v-model="leftDrawerOpen"
             show-if-above
             bordered>
      <QList>
        <QItemLabel header>Navigation</QItemLabel>
        <QItem v-for="link in links"
               :key="link.to.name"
               :clickable="$route.name !== link.to.name"
               :to="link.to"
               exact>
          <QItemLabel>{{link.title}}</QItemLabel>
        </QItem>
      </QList>
    </QDrawer>

    <QPageContainer>
      <QPage padding :class="$route.name">
        <router-view />
      </QPage>
    </QPageContainer>
  </QLayout>
</template>
