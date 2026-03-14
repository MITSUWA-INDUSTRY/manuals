import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'

const objFile = document.body.dataset.obj
const mtlFile = document.body.dataset.mtl

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
)
camera.position.set(100, 100, 100)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add(new THREE.HemisphereLight(0xffffff, 0x888888, 1.2))

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(100, 100, 100)
scene.add(light)

const mtlLoader = new MTLLoader()
const materials = await mtlLoader.loadAsync(mtlFile)
materials.preload()

const objLoader = new OBJLoader()
objLoader.setMaterials(materials)

const object = await objLoader.loadAsync(objFile)
scene.add(object)

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})