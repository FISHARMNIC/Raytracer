import { Ray } from "../util/Ray.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Object3D } from "./Object3D.js";
export class Plane extends Object3D {
    constants;
    computed_cmag;
    constructor(constants, color) {
        super(Vec3.zero(), color);
        this.constants = constants;
        this.computed_cmag = Math.sqrt(constants.a ** 2 + constants.b ** 2 + constants.c ** 2);
    }
    check_hit(point) {
        //https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_plane
        const distance = Math.abs(this.constants.a * point.x + this.constants.b * point.y + this.constants.c * point.z + this.constants.d) / this.computed_cmag;
        return distance <= 0.5;
    }
    reflection(ray) {
        const normal = new Vec3(this.constants.a / this.computed_cmag, this.constants.b / this.computed_cmag, this.constants.c / this.computed_cmag).normalized();
        // return new Ray(ray.position, Vec3.zero().normalized());
        return super.compute_reflection(ray, normal, ray.position);
    }
}
