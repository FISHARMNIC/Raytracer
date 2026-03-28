import { Ray } from "../util/Ray.js";
import { NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Object3D } from "./Object3D.js";

export type Plane_Constants = {
    a: number,
    b: number,
    c: number,
    d: number
};

export class Plane extends Object3D {
    private constants: Plane_Constants;

    private computed_cmag: number;

    constructor(constants: Plane_Constants, hue: number) {
        super(Vec3.zero(), hue);
        this.constants = constants;

        this.computed_cmag = Math.sqrt(constants.a ** 2 + constants.b ** 2 + constants.c ** 2);
    }

    public check_hit(point: Vec3): boolean {
        //https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_plane
        const distance: number = Math.abs(this.constants.a * point.x + this.constants.b * point.y + this.constants.c * point.z + this.constants.d) / this.computed_cmag;

        return distance <= 0.5;
    }

    public reflection(ray: Ray): Ray {
        const normal: NormalizedVec3 = new Vec3(
            this.constants.a / this.computed_cmag,
            this.constants.b / this.computed_cmag,
            this.constants.c / this.computed_cmag,
        ).normalized();

        // return reflected_ray;
        return super.reflection(ray, normal, ray.position);
    }
}