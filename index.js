import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import {Beam} from "./lib/PartBuilder";

let mouseIsDown = false;
let previousX = 0;
const rotationSmoothing = 0.05;

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
const beamBlue = new Beam(8, 2, 0.25, 0xabcdd1)
    .withFlanges(0.125, 1);

const beamRed = new Beam(8, 2, 0.25, 0xe38686)
    .withFlanges(0.125, 1)
    .move(0, 0, 2);

// draw the parts
const parts = [];
const objs = [];

parts.push(beamBlue);
parts.push(beamRed);

parts.forEach(part => {
    drawPart(part);
})

renderer.render(scene, camera);

function drawPart(part) {
    const drawnPart = part.draw();

    const partOutline = new THREE.LineSegments(
        new THREE.EdgesGeometry(drawnPart.geometry),
        new THREE.LineBasicMaterial({ color: 0X000000 }));

    objs.push(drawnPart);
    objs.push(partOutline);

    scene.add(drawnPart);
    scene.add(partOutline);
}

function createBeam(length, width, thickness, flangeWidth, flangeThickness, color) {
    const geometries = [];

    const webGeometry = new THREE.BoxGeometry(width, length, thickness);

    const flangeDistance = width / 2 + flangeThickness / 2 + .01;

    const ofGeometry = new THREE.BoxGeometry(flangeThickness, length, flangeWidth);
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

function handleRotation() {
    addEventListener('mousedown', (event) => {
        mouseIsDown = true;
        previousX = event.clientX;
    });

    addEventListener('mouseup', () => {
       mouseIsDown = false;
    });

    addEventListener('mousemove', (event) => {
        if (mouseIsDown) {
            const rotation = (previousX < event.clientX ? 1 : -1) * rotationSmoothing;

            objs.forEach(obj => {
               obj.rotation.y += rotation;
            });

            renderer.render(scene, camera);

            previousX = event.clientX;
        }
    });
}

handleRotation();