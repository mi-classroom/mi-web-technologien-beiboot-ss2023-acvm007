<script setup>
import AudioInterface from "components/AudioInterface.vue";
import {QMenu, QBtn, QList, QItem, QItemLabel, QItemSection,QIcon} from "quasar";
import {OPTIONS} from "src/scripts/tools.js";
import {computed, ref, watch} from "vue";

const props = defineProps({
  show: {type: Boolean, default: false},
  includedOptions: {type: Array, default: () => [OPTIONS.VISUAL, OPTIONS.AUDIO]},
  mesh: {type: Object, required: true},
  visible: {type: Boolean, default: false}
})
const emit = defineEmits(['changeGeometry', 'hide'])
const soundId = ref(null)
const sound = ref(null)
const interfaceOptions = computed(() => {
  const options = []
  props.includedOptions.forEach(opt => {
    if (opt === OPTIONS.VISUAL) {
      options.push({
        name: 'Visualisierung',
        icon: 'eye',
        options: [{
          name: 'Würfel',
          type: 'box',
          icon: 'cube-outline',
          disabled: props.mesh.geometry.type === 'BoxGeometry'
        }, {
          name: 'Sphere',
          type: 'sphere',
          icon: 'sphere',
          disabled: props.mesh.geometry.type === 'SphereGeometry'
        }]
      })
    }
    else if(opt === OPTIONS.AUDIO){
      options.push({
        name: 'Audiosteuerung',
        icon: 'headphones-box'
      })
    }
  })
  return options
})

watch(() => props.visible, visible => {
  if (sound.value) {
    if (visible && !sound.value.playing()) {
      sound.value.play()
    }
    else if (!visible && sound.value.playing()) sound.value.pause()
  }
})

function interfaceHandler(type) {
  if (['box', 'sphere'].includes(type)) {
    emit('changeGeometry', type)
    interfaceOptions.value[0].options.forEach(option => {
      option.disabled = option.type === type
    })
  }
  else {
    console.log(type)
  }
  close()
}

function close() {
  emit('hide')
}
</script>

<template>
  <QMenu v-if="show"
         :target="true"
         touch-position
         class="interface">
    <QBtn v-for="control in interfaceOptions"
          :key="control.title"
          :disable="control.disabled"
          :label="control.name"
          flat
          unelevated
          ripple
          color="black">
      <QMenu anchor="bottom left" self="top left">
        <QList v-if="control.options" class="bg-white">
          <QItem v-for="option in control.options"
                 :key="option.name"
                 :disable="option.disabled"
                 :clickable="!option.disabled"
                 v-close-popup
                 class="text-black"
                 @click="interfaceHandler(option.type)">
            <QItemSection avatar>
              <QIcon :name="option.icon" color="black" />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ option.name }}</QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
        <AudioInterface v-else
                        :visible="visible"
                        :sound-id="soundId"
                        @set-sound-id="soundId = $event"
                        @set-sound="sound = $event" />
      </QMenu>
    </QBtn>
  </QMenu>
</template>
