import {Notify} from 'quasar'
import {BoxGeometry,SphereGeometry} from "three";

export const OPTIONS = {
  VISUAL: 0,
  AUDIO: 1
}

export function setToast(message,type){
  Notify.create({message,type})
}

export function changeGeometry(mesh,type){
  mesh.geometry.dispose();
  if (type === 'box') {
    mesh.geometry = new BoxGeometry();
  }
  else if(type === 'sphere') {
    mesh.geometry = new SphereGeometry();
  }
}

export function setToast(message,type){
  Notify.create({message,type})
}
