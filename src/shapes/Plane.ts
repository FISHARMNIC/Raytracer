import { Ray } from "../util/Ray.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
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

    constructor(constants: Plane_Constants, color: ColorRGB, diffuse: number) {
        super(Vec3.zero(), color, diffuse);
        this.constants = constants;

        this.computed_cmag = Math.sqrt(constants.a ** 2 + constants.b ** 2 + constants.c ** 2);
    }

    public check_hit(point: Vec3): boolean {
        //https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_plane
        const distance: number = Math.abs(this.constants.a * point.x + this.constants.b * point.y + this.constants.c * point.z + this.constants.d) / this.computed_cmag;

        return distance <= 0.5;
    }

    public get_normal(ray: Ray): NormalizedVec3 {
        let normal: NormalizedVec3 = new Vec3(
            this.constants.a / this.computed_cmag,
            this.constants.b / this.computed_cmag,
            this.constants.c / this.computed_cmag,
        ).normalized().keepalive();

        // back side. flip normal
        if (normal.to_vec3().dot(ray.direction.to_vec3()) > 0) {
            normal = normal.to_vec3().scaled(-1).normalized().keepalive();
        }

        return normal.diffused(this.diffusion).keepalive();
    }

    public reflection(ray: Ray): Ray {
        return super.compute_reflection(ray, this.get_normal(ray));
    }

    public distance(ray: Ray): number | null {
        const normal = new Vec3(this.constants.a, this.constants.b, this.constants.c);

        const denom = normal.dot(ray.direction.to_vec3());

        if (Math.abs(denom) < 0.0001) return null;

        const t = -(normal.dot(ray.position) + this.constants.d) / denom;

        return t > 0 ? t : null;
    }
}