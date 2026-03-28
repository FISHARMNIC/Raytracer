import { Object3D } from "./Object3D.js";
export class Light extends Object3D {
    brightness;
    constructor(position, brightness) {
        super(position);
        this.brightness = brightness;
    }
}
