<script setup>
import SidebarItem from "layouts/SidebarItem.vue";
import {
  QBtn,
  QDrawer,
  QExpansionItem,
  QHeader,
  QItemLabel,
  QLayout,
  QList,
  QPage,
  QPageContainer,
  QToolbar,
  QToolbarTitle
} from "quasar";
import {ref} from 'vue'

const leftDrawerOpen = ref(false)
const links = [{
  title:'Startseite',
  to:{name:'Index'}
},{
  title:'AR mit GPS Koordinaten',
  to:{name:'Location'}
},{
  title:'AR mit einem Marker',
  children:['AR.js','HIRO','Kanji'].map(title => {
    const marker = title.includes('.') ? title.split('.').join('') : title
    return {title, to:{name:'Marker',params:{marker:marker.toLowerCase()}}}
  })
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
        <template v-for="link in links" :key="link.title">
          <QExpansionItem v-if="'children' in link"
                          :links="link.children"
                          expand-separator
                          :label="link.title">
            <SidebarItem v-for="child in link.children"
                         :key="child.name"
                         :link="child" />
          </QExpansionItem>
          <SidebarItem v-else :link="link" />
        </template>
      </QList>
    </QDrawer>

    <QPageContainer>
      <QPage padding :class="$route.name">
        <router-view />
      </QPage>
    </QPageContainer>
  </QLayout>
</template>
