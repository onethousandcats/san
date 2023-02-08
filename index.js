import * as THREE from "three";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);

camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0xfefefe);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// add geometry
const beam = createBeam(4, 2, 0.5, 0x5B8A67);

// light it
const ambient = new THREE.AmbientLight(0x404040, 5);
const point = new THREE.PointLight(0xE4FF00, 1, 10);
point.position.set(3, 3, 2);
scene.add(ambient);
scene.add(point);

// draw the parts
const


scene.add(beam);

renderer.render(scene, camera);

function animate() {
    beam.rotation.x += 0.003;
    beam.rotation.y += 0.004;
    beam.rotation.z += 0.005;

    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
};

function createBeam(length, width, thickness, color) {
    const webGeometry = new THREE.BoxGeometry(width, length, thickness);
    const material = new THREE.MeshStandardMaterial({color: color });

    return new THREE.Mesh(webGeometry, material);
}

//animate();