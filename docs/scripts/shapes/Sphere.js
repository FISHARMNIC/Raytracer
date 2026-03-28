import { Object3D } from "./Object3D.js";
export class Sphere extends Object3D {
    radius;
    constructor(position, radius, color) {
        super(position, color);
        this.radius = radius;
    }
}
