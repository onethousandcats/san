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
}

export { Part, Beam };