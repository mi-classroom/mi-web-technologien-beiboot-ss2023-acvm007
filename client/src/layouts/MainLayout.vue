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
import {useStore} from "stores/useStore.js";
import {ref} from 'vue'

const store= useStore()
</script>

<template>
  <QLayout view="lHh Lpr lFf">
    <QPageContainer>
      <QPage :class="$route.name">
        <router-view :key="$route.name+$route.params?.marker" />
      </QPage>
    </QPageContainer>
  </QLayout>
</template>
