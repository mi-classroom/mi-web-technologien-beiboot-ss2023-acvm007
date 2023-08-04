<script setup>
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
  QToolbarTitle,
  QSeparator,
  QItem
} from "quasar";
import getSidebar from '../data/sidebar.js'
import {useStore} from "stores/useStore.js";
import {ref} from 'vue'

const store= useStore()
const leftDrawerOpen = ref(false)
const links = getSidebar()
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
      <QList separator>
        <QItemLabel header>Navigation</QItemLabel>
        <template v-for="link in links" :key="link.title">
          <QExpansionItem v-if="'children' in link"
                          expand-separator
                          :model-value="$route.name === 'Marker'"
                          :links="link.children"
                          :label="link.title">
            <QList v-for="child in link.children"
                   :key="child.name"
                   separator>
              <QItem :clickable="$route.name !== child.to.name"
                     :to="child.to"
                     exact>
                <QItemLabel>{{child.title}}</QItemLabel>
              </QItem>
            </QList>
          </QExpansionItem>
          <QItem v-else
                 :clickable="$route.name !== link.to.name"
                 :to="link.to"
                 exact>
            <QItemLabel>{{link.title}}</QItemLabel>
          </QItem>
        </template>
      </QList>
      <QSeparator />
    </QDrawer>

    <QPageContainer>
      <QPage padding :class="$route.name">
        <router-view :key="$route.name+$route.params?.marker" />
      </QPage>
    </QPageContainer>
  </QLayout>
</template>
