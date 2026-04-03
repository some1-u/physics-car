// Keyboard input state module.
// Responsibilities:
// - Track keydown/keyup events.
// - Store current pressed/released state for controls.
// - Provide a clean API for querying input each frame.
// - Keep browser event handling isolated from game logic.
const keys = {}
window.addEventListener('keydown', (e) => {
  keys[e.code] = true
})
window.addEventListener('keyup', (e) => {
  keys[e.code] = false
})

export const Input = {
  isDown(keyCode) {
    return !!keys[keyCode]
  }
}

export function isKeyPressed(keyCode) {
  return Input.isDown(keyCode)
}