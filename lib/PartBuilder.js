import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

class Part {
    constructor(color) {
        this.geometries = [];
        this.color = color;
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    move(x, y, z) {
        this.position = {
            x: x,
            y: y,
            z: z
        };

        return this;
    }

    draw() {
        const combinedGeometries = BufferGeometryUtils.mergeBufferGeometries(this.geometries);
        combinedGeometries.computeBoundingBox();

        combinedGeometries.translate(this.position.x, this.position.y, this.position.z);

        const material = new THREE.MeshBasicMaterial({color: this.color});
        const mesh = new THREE.Mesh(combinedGeometries, material);

        return mesh;
    }
}

class Beam extends Part {
    constructor(length, width, thickness, color) {
        super(color);
        const webGeometry = new THREE.BoxGeometry(length, width, thickness);
        this.geometries.push(webGeometry);

        this.web = {
            width: width,
            length: length,
            thickness: thickness
        };
    }

    withFlanges(thickness, width) {
        const flangeDistance = this.web.width / 2 + thickness / 2 + .01;

        const ofGeometry = new THREE.BoxGeometry(this.web.length, thickness, width);
        ofGeometry.translate(0, flangeDistance, 0);

        const ifGeometry = new THREE.BoxGeometry(this.web.length, thickness, width);
        ifGeometry.translate(0, -flangeDistance, 0);

        this.geometries.push(ofGeometry)
        this.geometries.push(ifGeometry);

        return this;
    }

    asCee() {
        this._drawFlanges();
        return this;
    }

    asZee() {
        this._drawFlanges(true);
        return this;
    }

    _drawFlanges(isZee = false) {
        const flangeDistance = this.web.width / 2 + this.web.thickness / 2;
        const ceeWidth = this.web.width / 2

        const sideDistance = ceeWidth / 2 - this.web.thickness / 2;

        const ofGeometry = new THREE.BoxGeometry(this.web.length, this.web.thickness, ceeWidth);
        ofGeometry.translate(0, flangeDistance, sideDistance);

        const ifGeometry = new THREE.BoxGeometry(this.web.length, this.web.thickness, ceeWidth);
        ifGeometry.translate(0, -flangeDistance, isZee ? -sideDistance : sideDistance);

        this.geometries.push(ofGeometry);
        this.geometries.push(ifGeometry);
    }

    withEndPlates(thickness, width) {
        const endPlateDistance = this.web.length / 2 + thickness / 2 + .01;

        const endPlateLeft = new THREE.BoxGeometry(thickness, this.web.width, width);
        endPlateLeft.translate(endPlateDistance, 0, 0);

        const endPlateRight= new THREE.BoxGeometry(thickness, this.web.width, width);
        endPlateRight.translate(-endPlateDistance, 0, 0);

        this.geometries.push(endPlateLeft);
        this.geometries.push(endPlateRight);

        return this;
    }
}

class Bolt extends Part {
    constructor(size, length, color) {
        super(color);
        const shaftGeometry = new THREE.CylinderGeometry(size, size, length, 12);
        this.geometries.push(shaftGeometry);

        const headGeometry = new THREE.CylinderGeometry(size * 1.6, size * 1.6, size, 6);
        headGeometry.translate(0, length / 2, 0)
        this.geometries.push(headGeometry);

        const nutSize = size * 1.6;

        const nutGeometry = new THREE.CylinderGeometry(nutSize, nutSize, size, 6);
        nutGeometry.translate(0, -(length / 2 - 0.4), 0);
        this.geometries.push(nutGeometry);

        this.properties = {
            size: size,
            length: length,
            nutSize: nutSize
        };
    }

    withWasher(size) {
        const radius = this.properties.size * size;
        const washerGeometry = new THREE.CylinderGeometry(radius, radius, this.properties.size / 4, 32);
        washerGeometry.translate(0, -(this.properties.length / 2 - 0.4 - (this.properties.nutSize / 2)), 0);
        this.geometries.push(washerGeometry);

        return this;
    }
}

export { Part, Beam, Bolt };