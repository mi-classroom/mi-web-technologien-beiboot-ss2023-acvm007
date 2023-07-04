<script setup>
import {QItemSection, QBtn, QSlider, QItem} from "quasar";
import {ref, onBeforeMount,watch} from 'vue'
import {Howl} from 'howler';

const props = defineProps({
  soundId:{type:Number,default:null},
  visible:{type:Boolean,default:false}
})
const emit = defineEmits(['setSoundId','setSound'])

const sound = ref(null)
const audios = [{
  name: 'audio1.mp3',
  title: 'Imperial March'
}, {
  name: 'audio2.mp3',
  title: 'Watch the World Burn'
}]
const currentAudio = ref(0)
const position = ref(0)
const isLoading = ref(false)
const updateRef = ref(null)

watch(() => props.visible,() => {
  if(props.visible) sound.value.play()
  else sound.value.pause()
})

onBeforeMount(() => {
  if(props.soundId) {
    const idx = Howler._howls.length - 1
    const name = Howler._howls[idx]._src.split('/').pop()
    currentAudio.value = audios.findIndex(audio => audio.name === name)
    sound.value = Howler._howls[idx]
    Howler._howls.forEach((howl,i) => {
      if(i < idx) howl.unload()
    })
  }
  else initAudio()
})

function changeAudio(amt) {
  isLoading.value = true
  sound.value.stop()
  const index = currentAudio.value + amt
  if (index < 0) {
    currentAudio.value = audios.length - 1
  }
  else if (index > audios.length - 1) {
    currentAudio.value = 0
  }
  else {
    currentAudio.value = index
  }
  initAudio()
}

function initAudio() {
  sound.value = new Howl({
    src: [`../sounds/${audios[currentAudio.value].name}`],
    html5: true,
    loop: false,
    volume: 0.5,
    onend: () => changeAudio(currentAudio.value + 1),
    onplay: () => {
      updateRef.value = requestAnimationFrame(onAnimationFrame);
    },
    onPause: () => {
      cancelAnimationFrame(updateRef)
    }
  })
  audioHandler()
  emit('setSound',sound.value)
}

function audioHandler() {
  let id
  if (sound.value.playing()) {
    sound.value.pause()
  }
  else {
    id = sound.value.play()
  }
  if (!props.soundId) {
    emit('setSoundId',id)
  }
  sound.value.mute(!props.visible)
  isLoading.value = false
}

function changeVolume(vol) {
  sound.value.volume(vol / 100);
}

function seek(pos) {
  sound.value.seek(pos,props.soundId)
}

function onAnimationFrame() {
  position.value = sound.value.seek();
  updateRef.value = requestAnimationFrame(onAnimationFrame);
}
</script>

<template>
  <div class="row items-center justify-between wrap bg-white text-black q-pa-md">
    <QItemSection side>
      <QBtn flat
            unelevated
            label="Previous"
            :loading="isLoading"
            :disable="!visible"
            @click="changeAudio(-1)" />
    </QItemSection>
    <QItemSection>
      <QBtn outline
            :label="audios[currentAudio].title"
            :loading="isLoading"
            :disable="!visible"
            @click="audioHandler" />
    </QItemSection>
    <QItemSection side>
      <QBtn flat
            unelevated
            label="Next"
            :loading="isLoading"
            :disable="!visible"
            @click="changeAudio(1)" />
    </QItemSection>
  </div>
  <QItem>
    <QItemSection avatar>
      <QItemLabel>Seek</QItemLabel>
    </QItemSection>
    <QItemSection>
      <QSlider :model-value="position"
               :min="0"
               :max="sound.duration()"
               :label-value="(position / 60).toFixed(2)"
               :disable="!visible || true"
               label
               color="blue"
               @update:model-value="seek" />
    </QItemSection>
  </QItem>
  <QItem>
    <QItemSection avatar>
      <QItemLabel>Lautstärke</QItemLabel>
    </QItemSection>
    <QItemSection>
      <QSlider :model-value="sound.volume() * 100"
               :min="0"
               :max="100"
               :disable="!visible"
               label
               color="red"
               @update:model-value="changeVolume"
      />
    </QItemSection>
  </QItem>
</template>
