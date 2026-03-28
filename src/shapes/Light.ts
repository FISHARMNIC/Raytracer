import { Object3D } from "./Object3D.js";
import type { Vec3 } from "../util/Vec.js";

export class Light extends Object3D
{
    brightness: number;

    constructor(position: Vec3, brightness: number)
    {
        super(position);
        this.brightness = brightness;
    }
}