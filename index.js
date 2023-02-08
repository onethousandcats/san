import * as THREE from "three";
import {Beam, Bolt} from "./lib/PartBuilder";

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
    .move(0, 0, -2);

const beamRed = new Beam(8, 2, 0.25, 0xe38686)
    .withFlanges(0.125, 1);

const beamGreen = new Beam(8, 2, 0.25, 0xa9f5d8)
    .withFlanges(0.125, 1)
    .withEndPlates(0.125, 1)
    .move(0, 0, 2);

const ceeGreen = new Beam(6, 1, 0.04, 0xa9f5d8)
    .asCee()
    .move(0, 4, 2);

const zeeRed = new Beam(6, 1, 0.04, 0xe38686)
    .asZee()
    .move(0, 4, -2);

const bolt = new Bolt(0.2, 1.6, 0xfffcbd)
    .withWasher(2)
    .move(0, 3, 0);

// draw the parts
const parts = [];
const objs = [];

parts.push(beamBlue);
parts.push(beamRed);
parts.push(beamGreen);
parts.push(ceeGreen);
parts.push(zeeRed);
parts.push(bolt);

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