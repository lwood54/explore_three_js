import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// vv DEBUT SETUP vv //
const gui = new dat.GUI();

////// vvvvv TEXTURES vvvvv //////
// Texture Loading Manager
const loadingManager = new THREE.LoadingManager();
// Load Textures
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
// Gradient Textures
// const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;
// matcaps
// const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

const environmentMaps = cubeTextureLoader.load([
  "/textures/environmentMaps/4-coast/px.png",
  "/textures/environmentMaps/4-coast/nx.png",
  "/textures/environmentMaps/4-coast/py.png",
  "/textures/environmentMaps/4-coast/ny.png",
  "/textures/environmentMaps/4-coast/pz.png",
  "/textures/environmentMaps/4-coast/nz.png",
  ``,
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// OBJECT

// vv BASIC MATERIAL vv //
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// // material.color.set("#0000ff");
// material.color = new THREE.Color("green");
// material.wireframe = true;
// material.opacity = 0.5; // needs material.transparent = true to work
// material.transparent = true;
// material.alphaMap = alphaTexture; // needs material.transparent = true to work
// material.side = THREE.DoubleSide; // only use DoubleSide sparingly, heavier cost of render

// vv NORMAL MATERIAL vv //
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// vv MATCAP MATERIAL vv //
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture; // can create matcaps in 3D software (like Blender), put light where you want and render
// material.matcap = gradientTexture;

// vv DEPTH MATERIAL vv //
// const material = new THREE.MeshDepthMaterial();

// vvv MATERIALS THAT REACT TO LIGHT vvv //

// vv LAMBERT MATERIAL (reacts to light) vv //
// const material = new THREE.MeshLambertMaterial();

// vv PHONG MATERIAL vv //
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color("blue");

// vv TOON MATERIAL vv //
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// ^^^^ MATERIALS THAT REACT TO LIGHT ^^^^ //

// vv STANDARD MATERIAL vv // (Supposedly the *Best* material to work with)
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7; // 0 is default
gui.add(material, "metalness").min(0).max(1).step(0.0001);
material.roughness = 0.2; // 1 is default
gui.add(material, "roughness").min(0).max(1).step(0.0001);
material.envMap = environmentMaps;
// material.map = doorColorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// gui.add(material, "displacementScale").min(0).max(10).step(0.0001);
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// const normalScaleGUI = gui.addFolder("normalScale");
// normalScaleGUI.add(material.normalScale, "x").min(0).max(10).step(0.001);
// normalScaleGUI.add(material.normalScale, "y").min(0).max(10).step(0.001);
// material.transparent = true;
// material.alphaMap = alphaTexture; // need material.transparent = true for alpha to work
////// ^^^^^ TEXTURES ^^^^^ //////

const sphere = new THREE.Mesh(
  //   new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.SphereGeometry(0.5, 64, 64),
  material
);
sphere.position.x = -1.5;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

// vv NEED TO MANUALLY SET COORDIANTES for aoMap vv //
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);

// ADD IN AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // (color, intensity)
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;
  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
