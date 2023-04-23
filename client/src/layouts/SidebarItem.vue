<script setup>
import {QItem,QItemLabel} from "quasar";

defineProps({
  link:{type:Object,required:true}
})
</script>

<template>
  <QItem :clickable="$route.name !== link.to.name"
         :to="link.to"
         exact>
    <QItemLabel>{{link.title}}</QItemLabel>
  </QItem>
</template>
