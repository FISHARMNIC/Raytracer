import type { Ray } from "../util/Ray.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Object3D } from "./Object3D.js";

export class Triangle extends Object3D {
    v0: Vec3;
    v1: Vec3;
    v2: Vec3;

    computed: {
        e1: Vec3,
        e2: Vec3,
        normal: NormalizedVec3
    };

    constructor(points: {v0: Vec3, v1: Vec3, v2: Vec3}, color: ColorRGB, diffuse: number) {
        super(Vec3.zero(), color, diffuse);

        this.v0 = points.v0.keepalive();
        this.v1 = points.v1.keepalive();
        this.v2 = points.v2.keepalive();

        const e1 = this.v1.sub(this.v0).keepalive();
        const e2 = this.v2.sub(this.v0).keepalive();

        this.computed = {
            e1, e2,
            normal: e1.cross(e2).normalized().keepalive()
        };


    }

    public distance(ray: Ray): number | null {
        // https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm

        const dir_v3 = ray.direction.to_vec3().keepalive();

        const s = ray.position.sub(this.v0).keepalive();

        const s_cross_e1 = s.cross(this.computed.e1).keepalive();
        const d_cross_e2 = dir_v3.cross(this.computed.e2).keepalive();
        const d_cross_e2_dot_e1 = d_cross_e2.dot(this.computed.e1);

        if (Math.abs(d_cross_e2_dot_e1) < 0.0001) {
            return null; // parrallel
        }

        const t = s_cross_e1.dot(this.computed.e2) / d_cross_e2_dot_e1;
        const u = d_cross_e2.dot(s) / d_cross_e2_dot_e1;
        const v = s_cross_e1.dot(dir_v3) / d_cross_e2_dot_e1;

        if ((u < 0) || (v < 0) || ((u + v) > 1) || (t < 0)) // outside or behind
        {
            return null;
        }


        return t;
    }

    public reflection(ray: Ray): Ray {

        if (this.computed.normal.to_vec3().dot(ray.direction.to_vec3()) > 0) {
            this.computed.normal = this.computed.normal.to_vec3().scaled(-1).normalized().keepalive();
        }


        return super.compute_reflection(ray, this.computed.normal);
    }
}