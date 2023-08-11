import {Notify} from 'quasar'
import * as THREE from "three";

export const OPTIONS = {
  VISUAL: 0,
  AUDIO: 1
}

export function setToast(message,type = 'positive'){
  Notify.create({message,type})
}

export function changeGeometry(mesh,type){
  mesh.geometry.dispose();
  if (type === 'box') {
    mesh.geometry = new THREE.BoxGeometry();
  }
  else if(type === 'sphere') {
    mesh.geometry = new THREE.SphereGeometry();
  }
}

export function initThreeJs(meshSize = 0.9){
  const materials = [
    new THREE.MeshBasicMaterial({color: 0xff0000}),
    new THREE.MeshBasicMaterial({color: 0x0000ff}),
    new THREE.MeshBasicMaterial({color: 0x00ff00}),
    new THREE.MeshBasicMaterial({color: 0xff00ff}),
    new THREE.MeshBasicMaterial({color: 0x00ffff}),
    new THREE.MeshBasicMaterial({color: 0xffff00})
  ];
  return {
    THREE,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000),
    mesh: new THREE.Mesh(new THREE.BoxGeometry(meshSize, meshSize, meshSize), materials)
  }
}
