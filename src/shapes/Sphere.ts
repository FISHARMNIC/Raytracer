import { Object3D } from "./Object3D.js";
import type { Vec3 } from "../util/Vec.js";

export class Sphere extends Object3D
{
    radius: number;

    constructor(position: Vec3, radius: number, color?: string)
    {
        super(position, color);

        this.radius = radius;
    }
}