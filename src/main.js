// Boots the application.
// Responsibilities:
// - Import and initialize the scene, world, car, and input modules.
// - Start the render/update loop.
// - Wire all systems together in startup order.
// - Keep this file focused on high-level app orchestration.
// main.js
import { scene, renderer, camera } from './scene.js';
import { Car } from './car.js';

const car = new Car();

const speedHud = document.createElement('div');
speedHud.style.position = 'fixed';
speedHud.style.top = '12px';
speedHud.style.left = '12px';
speedHud.style.padding = '6px 10px';
speedHud.style.borderRadius = '8px';
speedHud.style.background = 'rgba(0, 0, 0, 0.45)';
speedHud.style.color = '#ffffff';
speedHud.style.fontFamily = 'monospace';
speedHud.style.fontSize = '14px';
speedHud.style.zIndex = '10';
document.body.appendChild(speedHud);

// The game loop — runs every frame
function loop() {
  requestAnimationFrame(loop);

  car.update();           // move car, update camera
  speedHud.textContent = `speed: ${car.speed.toFixed(3)}`;
  renderer.render(scene, camera);  // draw the frame
}

loop(); // kick it off