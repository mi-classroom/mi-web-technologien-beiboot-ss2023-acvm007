<script setup>
import eruda from 'eruda'
if(import.meta.env.DEV) eruda.init()
</script>

<template>
  <router-view />
</template>
