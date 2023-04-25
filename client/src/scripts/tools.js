import {AudioListener, Audio, AudioLoader, Scene, Camera, PerspectiveCamera} from "three";

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
