import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Solution 2: using Three.js Clock object
// Clock
const clock = new THREE.Clock();
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

const tick = () => {
  // Clock
  //   const elapsedTime = clock.getElapsedTime();

  // Update objects
  //   mesh.rotation.y = elapsedTime * Math.PI * 2;
  //   mesh.position.y = elapsedTime;
  // combine simple math for more complex animations.
  //   mesh.position.y = Math.sin(elapsedTime);
  //   mesh.position.x = Math.cos(elapsedTime);

  // Can also animate the camera
  //   camera.position.y = Math.sin(elapsedTime);
  //   camera.position.x = Math.cos(elapsedTime);
  //   camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Solution 1 handling computers w/ different framerates
// create a delta between global time and current time,
// then adjust animation movement based on the delta
// // Global Time
// let time = Date.now();

// // Animations
// const tick = () => {
//   // Time
//   const currentTime = Date.now();
//   const deltaTime = currentTime - time;
//   time = currentTime;

//   // Update objects
//   //   mesh.rotation.reorder("YXZ");
//   mesh.rotation.y += 0.001 * deltaTime;
//   //   mesh.rotation.x -= 0.02;
//   //   mesh.rotation.z += 0.01;

//   // Render
//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };

// tick();
