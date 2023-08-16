import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";
import {ArMarkerControls, ArToolkitContext, ArToolkitSource} from "@ar-js-org/ar.js/three.js/build/ar-threex.js";
import {Notify} from 'quasar'
import {useStore} from "stores/useStore.js";
import * as THREE from "three";

export const OPTIONS = {
  VISUAL: 0,
  AUDIO: 1
}

export const userMediaConstraints = {
  video: {
    facingMode: 'environment'
  }
}

export function setToast(message, type = 'positive') {
  Notify.create({message, type})
}

export function changeGeometry(mesh, type) {
  mesh.geometry.dispose();
  if (type === 'box') {
    mesh.geometry = new THREE.BoxGeometry();
  }
  else if (type === 'sphere') {
    mesh.geometry = new THREE.SphereGeometry();
  }
}

export function initThreeJs(meshSize = 0.9, media) {
  let material, geometry
  if (media.type === 'mesh') {
    material = []
    if (media.geometry === 'cube') {
      material.push(
        new THREE.MeshBasicMaterial({color: 0xff0000}),
        new THREE.MeshBasicMaterial({color: 0x0000ff}),
        new THREE.MeshBasicMaterial({color: 0x00ff00}),
        new THREE.MeshBasicMaterial({color: 0xff00ff}),
        new THREE.MeshBasicMaterial({color: 0x00ffff}),
        new THREE.MeshBasicMaterial({color: 0xffff00})
      )
      geometry = new THREE.BoxGeometry(meshSize, meshSize, meshSize)
    }
  }
  else if (['video', 'image'].includes(media.type)) {
    //TODO
    material = new THREE.MeshBasicMaterial({color: 0xffff00});
    geometry = new THREE.SphereGeometry(20,meshSize * 50,1,1)
  }
  return {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000),
    mesh: new THREE.Mesh(geometry, material)
  }
}

export class Event {
  constructor(event, canvas) {
    this.event = event
    this.canvas = canvas
    this.isMarker = event.type === 'marker'
    this.cam = null
    this.arToolkitSrc = null
    this.arToolkitCtx = null
    this.deviceOrientationControls = null
    this.visible = false

    const {scene, camera, mesh} = initThreeJs(this.isMarker ? 0.9 : 100, this.event.media)
    this.scene = scene
    this.camera = camera
    this.mesh = mesh
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })
  }

  init() {
    if (this.isMarker) {
      this.arToolkitSrc = new ArToolkitSource({
        sourceType: 'webcam'
      })
      this.arToolkitCtx = new ArToolkitContext({
        cameraParametersUrl: '/marker/camera_para.dat',
        detectionMode: 'color_and_matrix',
      })

      new ArMarkerControls(this.arToolkitCtx, this.camera, {
        type: 'pattern',
        patternUrl: `/marker/${this.event.file}`,
        changeMatrixMode: 'cameraTransformMatrix'
      })
      this.scene.visible = false
      this.arToolkitSrc.init(() => {
        setTimeout(() => {
          this.arToolkitSrc.onResizeElement()
          this.arToolkitSrc.copyElementSizeTo(this.renderer.domElement)
        }, 100)
      })
      this.arToolkitCtx.init(function onCompleted() {
        this.camera.projectionMatrix.copy(this.arToolkitCtx.getProjectionMatrix());
      });
      this.scene.add(this.camera)
      this.scene.add(this.mesh);
    }
    else {
      const arjs = new THREEx.LocationBased(this.scene, this.camera);
      this.cam = new THREEx.WebcamRenderer(this.renderer);
      this.deviceOrientationControls = new THREEx.DeviceOrientationControls(this.camera);
      arjs.on('gpsupdate', position => {
        updatePosition(position.coords)
      })
      arjs.on('gpserror', () => {
        setToast(`Location error!`, 'negative')
      })
      arjs.add(this.mesh, this.event.coords.lng, this.event.coords.lat);
      arjs.startGps()
    }
    this.render.bind(this).render()
  }

  render() {
    requestAnimationFrame(this.render);
    const {clientWidth, clientHeight} = document.body
    if (!!this.canvas && (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight)) {
      this.canvas.width = clientWidth
      this.canvas.height = clientHeight
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    if (this.isMarker) {
      this.arToolkitCtx.update(this.arToolkitSrc.domElement)
    }
    else {
      this.deviceOrientationControls.update();
      this.cam.update();
    }
    this.scene.visible = this.camera.visible
    this.visible = this.scene.visible
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    console.log(this.mesh)
  }
}

export function updatePosition({lng, lat}) {
  useStore().position.lng = lng
  useStore().position.lat = lat
}

export async function newEvent(event, canvas) {
  const isMarker = event.type === 'marker'
  const {scene, camera, mesh} = initThreeJs(isMarker ? 0.9 : 100, event.media)
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  let cam, arToolkitSrc, arToolkitCtx, deviceOrientationControls, visible = false
  if (isMarker) {
    arToolkitSrc = new ArToolkitSource({
      sourceType: 'webcam'
    })
    arToolkitCtx = new ArToolkitContext({
      cameraParametersUrl: '/marker/camera_para.dat',
      detectionMode: 'color_and_matrix',
    })

    new ArMarkerControls(arToolkitCtx, camera, {
      type: 'pattern',
      patternUrl: `/marker/${event.file}`,
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
    arjs.on('gpsupdate', position => {
      updatePosition(position.coords)
    })
    arjs.on('gpserror', () => {
      setToast(`Location error!`, 'negative')
    })
    arjs.add(mesh, event.coords.lng, event.coords.lat);
    arjs.startGps()
  }
  render()

  function render() {
    requestAnimationFrame(render);
    const {clientWidth, clientHeight} = document.body
    if (!!canvas && (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
      canvas.width = clientWidth
      canvas.height = clientHeight
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    if (isMarker) {
      arToolkitCtx.update(arToolkitSrc.domElement)
    }
    else {
      deviceOrientationControls.update();
      cam.update();
    }
    scene.visible = camera.visible
    visible = scene.visible
    renderer.render(scene, camera);
  }
}
