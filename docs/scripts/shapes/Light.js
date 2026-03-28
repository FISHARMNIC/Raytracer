import { Object3D } from "./Object3D.js";
import { Sphere } from "./Sphere.js";
export class Light extends Sphere {
    brightness;
    constructor(position, radius, brightness) {
        super(position, radius);
        this.brightness = brightness;
    }
}
