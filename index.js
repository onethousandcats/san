import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);

camera.position.set(6, 6, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0xfefefe);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// add geometry
const beam = createBeam(10, 2, 0.25, 3, 0.125, 0x5B8A67);

// draw the parts
const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(beam.geometry),
    new THREE.LineBasicMaterial({ color: 0X000000 }));

scene.add(beam);
scene.add(outline);


renderer.render(scene, camera);

function animate() {
    beam.rotation.x += 0.003;
    beam.rotation.y += 0.004;
    beam.rotation.z += 0.005;

    outline.rotation.x += 0.003;
    outline.rotation.y += 0.004;
    outline.rotation.z += 0.005;

    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
};

function createBeam(length, width, thickness, flangeWidth, flangeThickness, color) {
    const geometries = [];

    const webGeometry = new THREE.BoxGeometry(width, length, thickness);

    const ofGeometry = new THREE.BoxGeometry(flangeThickness, length, flangeWidth);

    const flangeDistance = width / 2 + flangeThickness / 2 + .01;

    ofGeometry.translate(flangeDistance, 0, 0);

    const ifGeometry = new THREE.BoxGeometry(flangeThickness, length, flangeWidth);
    ifGeometry.translate(-flangeDistance, 0, 0);

    geometries.push(ofGeometry);
    geometries.push(ifGeometry);
    geometries.push(webGeometry);

    const material = new THREE.MeshBasicMaterial({color: color });

    const mainGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    mainGeometry.computeBoundingBox();

    return new THREE.Mesh(mainGeometry, material);
}

// animate();