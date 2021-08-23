import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI({ closed: true, width: 400 });
// gui.hide();

const spin = () => {
  // NOTE: could use y: 10 (any number), but after 1 spin, it would already
  // be at y: 10. So I'm just setting it to current value plus Math.PI * 2 which means a full rotation
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  // QUESTION: how can I perform some action when this function call matches some condition?
  //   console.log("mesh.rotation.y", mesh.rotation.y);
  //   if (mesh.rotation.y > 20) {
  //     gsap.to(material, { color: 0xff0000 });
  //   }
};
// create color object just to use to tweak colors in dat.gui
const parameters = {
  color: 0x0000ff,
  spin,
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: parameters.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation (y)");
gui.add(mesh, "visible");
gui.add(material, "wireframe");
gui.addColor(parameters, "color").onChange(() => {
  // update color change
  material.color.set(parameters.color);
});
gui.add(parameters, "spin");
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
