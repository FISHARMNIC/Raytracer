import type { Vec3 } from "../util/Vec.js";

export class Object3D {
    position: Vec3;
    hue: number;

    constructor(position: Vec3, hue: number = 0)
    {
        this.position = position;
        this.hue = hue;
    }
}