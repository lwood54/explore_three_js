import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**** ====================> TEXTURES <==================== ****/
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

/**** =====> DEBUG <===== ****/
const gui = new dat.GUI();
gui.width = 500;

/**** =====> CANVAS <===== ****/
const canvas = document.querySelector("canvas.webgl");

/**** =====> SCENE <===== ****/
const scene = new THREE.Scene();

/**** =====> LIGHTS SECTION <===== ****/
const lightsGUI = gui.addFolder("lights");
lightsGUI.closed = false;

/**** =====> AMBIENT LIGHT <===== ****/
// main
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// helper

// ambientLightGUI
const ambientGUI = lightsGUI.addFolder("ambient");
ambientGUI.add(ambientLight, "intensity").min(0).max(1).step(0.001);
ambientGUI.add(ambientLight, "visible").name("toggle: light");

/**** =====> DIRECTIONAL LIGHT <===== ****/
// main
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
// optimiz size of camera to reduce needed calculations to only cover scene
// also provides the benefit of increasing detail on shadows because the amplitude
// is a tighter fit, so it's as if we can zoom in on the objects shadowMap, resulting in more detailed shadows
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.radius = 4;
directionalLight.position.set(2, 2, -1);
scene.add(directionalLight);

// helper
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// directionalLighGUI
const directionalGUI = lightsGUI.addFolder("directional");
directionalGUI
  .add(directionalLightCameraHelper, "visible")
  .name("toggle:helper");
directionalGUI.add(directionalLight, "visible").name("toggle: light");
directionalGUI
  .add(directionalLight.shadow, "radius")
  .min(0)
  .max(20)
  .step(0.01)
  .name("shadow blur");

directionalGUI
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("directional lt intensity");
directionalGUI.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
directionalGUI.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
directionalGUI.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

/**** ====================> SPOT LIGHT <==================== ****/
// main
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.width = 1024;
spotLight.shadow.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 5;
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

// helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
spotLightCameraHelper.visible = false;

// spotLightGUI
const spotLighGUI = lightsGUI.addFolder("spot");
spotLighGUI.closed = false;
spotLighGUI.add(spotLightCameraHelper, "visible").name("toggle: helper");
// spotLighGUI.add(spotLight.shadow.camera, "fov").min(0).max(180).step(1);
spotLighGUI.add(spotLight, "visible").name("toggle: light");

/**** ====================> POINT LIGHT <==================== ****/
// main
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

scene.add(pointLight);

// helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);
pointLightCameraHelper.visible = false;

// pointLightGUI
const pointLightGUI = lightsGUI.addFolder("point");
pointLightGUI.closed = false;
pointLightGUI.add(pointLightCameraHelper, "visible").name("toggle: helper");
pointLightGUI.add(pointLight, "visible").name("toggle: light");

/**** ====================> MATERIALS <==================== ****/
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**** ====================> OBJECTS <==================== ****/
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material); // ORIGINAL
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({
//     map: bakedShadow,
//   })
// ); // ALT TECHNIQUE: to use bakedShadows (shadows basically as an image);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

/**** ====================> ALT TECHNEIQUE Sphere Shadow <==================== ****/
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.001;
scene.add(sphereShadow);

/**** ====================> SIZES <==================== ****/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**** ====================>  <==================== ****/
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

/**** ====================> CAMERA <==================== ****/
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

/**** ====================> CONTROLS <==================== ****/
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**** ====================> RENDERER <==================== ****/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// toggle whether or not scene can handle shadows
// renderer.shadowMap.enabled = true;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**** ====================> ANIMATE <==================== ****/
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // Update the shadow (if using the baked 'shadow')
  // 'baked shadow' is really using an image on flat plane and having it follow the object's movement
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 1.3;
  sphereShadow.scale.set(
    Math.sqrt(1 - sphere.position.y + 0.25) * 0.75,
    Math.sqrt(1 - sphere.position.y + 0.25) * 0.75,
    Math.sqrt(1 - sphere.position.y + 0.25) * 0.75
  );

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
