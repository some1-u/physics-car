// Three.js setup module.
// Responsibilities:
// - Create and configure the renderer.
// - Create and configure the camera.
// - Add base lighting setup (ambient, directional, etc.).
// - Handle viewport sizing and resize behavior.
// - Expose scene-related objects/helpers for other modules.
import * as THREE from 'three'

export const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb) // Sky blue background

scene.fog = new THREE.Fog(0x87ceeb,0.04,100) // Add fog for depth

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
)
const lighting = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(lighting)

const sun = new THREE.DirectionalLight(0xffffff, 0.9)
sun.position.set(15, 30, 10)
scene.add(sun)

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400),
  new THREE.MeshStandardMaterial({ color: 0x2c4a3a })
)
ground.rotation.x = -Math.PI / 2
ground.position.y = 0
scene.add(ground)

const grid = new THREE.GridHelper(400, 80, 0xffffff, 0x9bb7a7)
grid.position.y = 0.02
scene.add(grid)

export const headlight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 4, 0.5)
scene.add(headlight)
scene.add(headlight.target)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    })