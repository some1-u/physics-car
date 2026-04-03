// car.js
import * as THREE from 'three';
import { scene, camera, headlight } from './scene.js';
import { Input } from './input.js';

export class Car {
  constructor() {
    // Visual mesh — low poly box for now
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1, 4),
      new THREE.MeshLambertMaterial({ color: 0xff4444, flatShading: true })
    );
    this.mesh.position.y = 0.5;
    scene.add(this.mesh);

    // Physics state (manual, no Rapier yet)
    this.speed = 0;
    this.angle = 0;  // which way we're facing, in radians

    // Constants — tune these for feel
    this.maxSpeed = 1;
    this.acceleration = 0.03;
    this.friction = 0.965;      // multiplied each frame, <1 means slowdown
    this.turnSpeed = 0.055;
  }

  update() {
    // --- Input ---
    const forward = Input.isDown('ArrowUp') || Input.isDown('KeyW');
    const backward = Input.isDown('ArrowDown') || Input.isDown('KeyS');
    const left = Input.isDown('ArrowLeft') || Input.isDown('KeyA');
    const right = Input.isDown('ArrowRight') || Input.isDown('KeyD');

    if (forward) this.speed += this.acceleration;
    if (backward) this.speed -= this.acceleration * 0.6;

    // Only turn if moving (feels more realistic)
    if (Math.abs(this.speed) > 0.01) {
      if (left) this.angle += this.turnSpeed * Math.sign(this.speed);
      if (right) this.angle -= this.turnSpeed * Math.sign(this.speed);
    }

    // --- Physics ---
    this.speed *= this.friction;  // natural slowdown every frame
    this.speed = Math.max(-this.maxSpeed * 0.5, Math.min(this.maxSpeed, this.speed));

    // Move in the direction we're facing
    this.mesh.position.x += Math.sin(this.angle) * this.speed;
    this.mesh.position.z += Math.cos(this.angle) * this.speed;
    this.mesh.rotation.y = this.angle;

    // --- First Person Camera ---
    this._updateCamera();

    // --- Headlights ---
    this._updateHeadlights();
  }

  _updateCamera() {
    // Sit the camera just behind the windshield, inside the car
    const camOffset = new THREE.Vector3(0, 0.6, -0.5); // up 0.6, slightly back
    camOffset.applyEuler(new THREE.Euler(0, this.angle, 0)); // rotate with car

    camera.position.copy(this.mesh.position).add(camOffset);

    // Look forward in the direction the car faces
    const lookTarget = new THREE.Vector3(
      this.mesh.position.x + Math.sin(this.angle) * 10,
      camera.position.y,
      this.mesh.position.z + Math.cos(this.angle) * 10
    );
    camera.lookAt(lookTarget);
  }

  _updateHeadlights() {
    // Headlight sits just in front of the car
    const lightPos = new THREE.Vector3(0, 0.5, 2);
    lightPos.applyEuler(new THREE.Euler(0, this.angle, 0));
    headlight.position.copy(this.mesh.position).add(lightPos);

    // Points forward
    headlight.target.position.set(
      this.mesh.position.x + Math.sin(this.angle) * 10,
      this.mesh.position.y,
      this.mesh.position.z + Math.cos(this.angle) * 10
    );
    headlight.target.updateMatrixWorld();
  }

  // Convenience getter for other systems
  get position() { return this.mesh.position; }
  get facing()   { return this.angle; }
}