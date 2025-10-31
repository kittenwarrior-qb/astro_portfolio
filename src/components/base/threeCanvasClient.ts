import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

(function init() {
  const container = document.getElementById('three-canvas-container') as HTMLElement | null
  if (!container) return

  const scene = new THREE.Scene()

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  ;(renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.set(0, 1, 3)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = true
  controls.minDistance = 1
  controls.maxDistance = 6
  controls.minPolarAngle = Math.PI * 0.15
  controls.maxPolarAngle = Math.PI * 0.85
  controls.minAzimuthAngle = -Math.PI / 2
  controls.maxAzimuthAngle = Math.PI / 2

  scene.add(new THREE.AmbientLight(0xffffff, 1.0))
  const dir = new THREE.DirectionalLight(0xffffff, 1.0)
  dir.position.set(2, 3, 4)
  scene.add(dir)

  const clock = new THREE.Clock()
  let mixer: THREE.AnimationMixer | null = null

  const loader = new GLTFLoader()
  const base = (import.meta as any).env?.BASE_URL || '/'
  const modelUrl = base.endsWith('/') ? base + 'the_dog_song.glb' : base + '/the_dog_song.glb'
  loader.load(
    modelUrl,
    (gltf) => {
      const root = gltf.scene

      const box = new THREE.Box3().setFromObject(root)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)
      root.position.sub(center)
      scene.add(root)

      const maxDim = Math.max(size.x, size.y, size.z) || 1
      const fitDist = maxDim / (2 * Math.tan((Math.PI * camera.fov) / 360))
      camera.position.set(0, maxDim * 0.2, fitDist * 1.4)
      controls.target.set(0, 0, 0)
      controls.update()

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(root)
        gltf.animations.forEach((clip) => {
          const action = mixer!.clipAction(clip)
          action.setLoop(THREE.LoopRepeat, Infinity)
          action.play()
        })
      }
    },
    undefined,
    (err) => {
      console.error('GLB load error', { url: modelUrl, base, error: err })
    }
  )

  const onResize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', onResize)

  const tick = () => {
    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
})()
