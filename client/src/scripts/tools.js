import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";
import {ArMarkerControls, ArToolkitContext, ArToolkitSource} from "@ar-js-org/ar.js/three.js/build/ar-threex.js";
import {Notify} from 'quasar'
import {useStore} from "stores/useStore.js";
import * as THREE from "three";
import playAlpha from '../assets/playAlpha.png'
import pauseAlpha from '../assets/pauseAlpha.png'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const userMediaConstraints = {
  video: {facingMode: 'environment'}
}

export function setToast(message, type = 'positive') {
  Notify.create({message, type})
}

export function getItemRoute(id,isEventList) {
  const name = isEventList ? 'ArEvent' : 'Start'
  const params = {}
  const query = {}
  if (isEventList) {
    params.eventType = 'events'
    params.id = id
  }
  else {
    params.action = 'nearby'
    query.path = id
  }
  return {name, params, query}
}

export function updatePosition({lng, lat}) {
  useStore().position.lng = lng
  useStore().position.lat = lat
}

//Need to use ith to get correct coordinates for Mercator projection
export function getMapCoordinates(coords) {
  const {lng,lat} = getCoordinates(coords)
  return [lng,lat]
}

//This is only for the demo to set coordinates for test events a tad north of current users position
export function getCoordinates(coords){
  if(coords) return coords
  else{
    const {lng,lat} = useStore().position
    const amount = 0.005
    return {lat: lat - amount,lng}
  }
}

async function load(url,type){
  return new Promise((resolve, reject) => {
    let LOADER
    if(type === 'image') LOADER = new THREE.TextureLoader()
    else if(type === 'gltf') LOADER = new GLTFLoader()
    else throw "NO LOADER"
    LOADER.load(url,data => resolve(data),progress => {
      console.log(`${(progress.loaded / progress.total * 100).toFixed(2)} % loaded` );
    },e => reject(e))
  })
}

export async function initThreeJs(isMarker, media, video) {
  const factor = isMarker ? 150 : 1
  const size = 250 / factor
  const hasMedia = ['video', 'image'].some(key => key in media)
  let material, geometry,mesh
  if ('mesh' in media) {
    material = []
    if (media.mesh === 'cube') {
      material.push(
        new THREE.MeshBasicMaterial({color: 0xff0000}),
        new THREE.MeshBasicMaterial({color: 0x0000ff}),
        new THREE.MeshBasicMaterial({color: 0x00ff00}),
        new THREE.MeshBasicMaterial({color: 0xff00ff}),
        new THREE.MeshBasicMaterial({color: 0x00ffff}),
        new THREE.MeshBasicMaterial({color: 0xffff00})
      )
      geometry = new THREE.BoxGeometry(size, size, size)
    }
    if(media.mesh === 'custom'){
      const gltf = await load(`../models/${media.file}`,'gltf')
      const scale = isMarker ? 1 : 200
      mesh = gltf.scene
      mesh.scale.set(scale * mesh.scale.x, scale * mesh.scale.y, scale * mesh.scale.z)
      mesh.rotation.y = 110
    }
  }
  if (hasMedia) {
    let texture, width, height
    if ('image' in media) {
      texture = await load(media.image,'image')
      const image = texture.source.data
      width = image.width
      height = image.height
    }
    else {
      texture = new THREE.VideoTexture(video)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.colorSpace = THREE.SRGBColorSpace;
      width = video.videoWidth
      height = video.videoHeight
    }
    const mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});
    if(material && Array.isArray(material)) {
      material.splice(-1, 0, mat)
    }
    else material = mat
    if(!geometry) {
      const aspectRatio = width/height
      geometry = new THREE.PlaneGeometry(size * aspectRatio, size, 1.0)
      material.side = THREE.DoubleSide
    }
  }
  material.depthTest = false;
  if(!mesh) mesh = new THREE.Mesh(geometry, material)
  return {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000),
    mesh
  }
}

export function getBtnTexture(isPlaying){
  return new THREE.MeshBasicMaterial({
    color: 0xffffff,
    alphaMap: new THREE.TextureLoader().load(isPlaying ? pauseAlpha : playAlpha),
    alphaTest: 0.3,
    side: THREE.DoubleSide
  })
}

export async function newEvent(event, canvas, video, hasPlayableMedia) {
  const isMarker = event.type === 'marker'
  const {scene, camera, mesh} = await initThreeJs(isMarker, event.media, video)
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  let cam, arToolkitSrc, arToolkitCtx, deviceOrientationControls, playButton
  if (hasPlayableMedia) {
    const size = isMarker ? 1 : 100
    playButton = new THREE.Mesh(new THREE.PlaneGeometry(size,size), getBtnTexture(false));
    mesh.add(playButton)
    mesh.renderOrder = 0;
    playButton.renderOrder = 1;
    playButton.isPlaying = false
    if(isMarker) {
      playButton.position.y = -5
      playButton.position.z = -6
    }
    else {
      playButton.scale.multiply(new THREE.Vector3(-1,-1,-1))
      playButton.position.y = -200
      playButton.position.z = -1
    }
  }
  if('mesh' in event.media && event.media.mesh === 'custom'){
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
    scene.add( ambientLight );
  }
  if (isMarker) {
    arToolkitSrc = new ArToolkitSource({
      sourceType: 'webcam'
    })
    arToolkitCtx = new ArToolkitContext({
      cameraParametersUrl: '../marker/camera_para.dat',
      detectionMode: 'color_and_matrix',
    })

    new ArMarkerControls(arToolkitCtx, camera, {
      type: 'pattern',
      patternUrl: `../marker/${event.file}`,
      changeMatrixMode: 'cameraTransformMatrix'
    })
    scene.visible = false
    arToolkitSrc.init(() => {
      setTimeout(() => {
        arToolkitSrc.onResizeElement()
        arToolkitSrc.copyElementSizeTo(renderer.domElement)
      }, 100)
    })
    arToolkitCtx.init(function onCompleted() {
      camera.projectionMatrix.copy(arToolkitCtx.getProjectionMatrix());
    });
    scene.add(camera)
    scene.add(mesh);
  }
  else {
    const arjs = new THREEx.LocationBased(scene, camera);
    cam = new THREEx.WebcamRenderer(renderer);
    deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);
    arjs.on('gpserror', () => {
      setToast(`Location error!`, 'negative')
    })
    const {lng,lat} = getCoordinates(event.coords)
    arjs.add(mesh,lng,lat);
    arjs.startGps()
  }
  renderer.outputEncoding = THREE.sRGBEncoding;
  return {
    renderer,
    scene,
    camera,
    cam,
    isMarker,
    arToolkitSrc,
    arToolkitCtx,
    deviceOrientationControls,
    playButton
  }
}
