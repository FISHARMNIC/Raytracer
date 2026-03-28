import type { NormalizedVec3, Vec3 } from "./Vec.js";

export class Ray
{
    position: Vec3;
    direction: NormalizedVec3; // @todo increase precision

    constructor(position: Vec3, direction: NormalizedVec3)
    {
        this.position = position;
        this.direction = direction;
    }

    public step()
    {
        this.position = this.position.add(this.direction);
    }
}