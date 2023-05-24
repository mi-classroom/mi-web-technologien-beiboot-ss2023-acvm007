import {useStore} from "stores/useStore.js";
import {AudioListener, Audio, AudioLoader} from "three";
import {exp} from "three/nodes";

export function getSound(fileName){
  const listener = new AudioListener();
  const sound = new Audio(listener);
  const audioLoader = new AudioLoader();
  audioLoader.load(`../sounds/${fileName}`, function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });
  return sound
}

export function onSceneChange(sound,visible = false){
  const isAudio = useStore().isAudio
  if(visible){
    if(isAudio) sound.play();
  }
  else{
    if(isAudio) sound.pause();
  }
}
