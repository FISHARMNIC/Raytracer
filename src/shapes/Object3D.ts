import type { Vec3 } from "../util/Vec.js";

export class Object3D {
    position: Vec3;
    color: string;

    constructor(position: Vec3, color: string = 'black')
    {
        this.position = position;
        this.color = color;
    }
}