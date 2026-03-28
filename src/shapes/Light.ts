import { Object3D } from "./Object3D.js";
import type { Vec3 } from "../util/Vec.js";
import { Sphere } from "./Sphere.js";

export class Light extends Sphere
{
    brightness: number;

    constructor(position: Vec3, radius: number, brightness: number)
    {
        super(position, radius);
        this.brightness = brightness;
    }
}