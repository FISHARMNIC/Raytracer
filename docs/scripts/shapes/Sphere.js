import { Object3D } from "./Object3D.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Ray } from "../util/Ray.js";
export class Sphere extends Object3D {
    _radius;
    constructor(position, radius, color, diffusion) {
        super(position, color, diffusion);
        this._radius = radius;
    }
    get radius() {
        return this._radius;
    }
    radius_info(point) {
        const distance = this.position.distance(point);
        const within_rad = distance <= this._radius;
        return { distance, within_rad };
    }
    check_hit(point) {
        return this.radius_info(point).within_rad;
    }
    get_normal(ray) {
        const normal = ray.position.sub(this.position).normalized();
        return normal.diffused(this.diffusion);
    }
    reflection(ray) {
        return super.compute_reflection(ray, this.get_normal(ray));
    }
    distance(ray) {
        // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
        const oc = ray.position.sub(this.position);
        const b = ray.direction.to_vec3().dot(oc) * 2;
        const c = oc.dot(oc) - (this.radius ** 2);
        const disc = b ** 2 - 4 * c;
        if (disc >= 0) {
            const disc_root = Math.sqrt(disc);
            const t1 = (-b + disc_root) / 2;
            const t2 = (-b - disc_root) / 2;
            const t = t2 > 0 ? t2 : t1;
            return t > 0 ? t : null;
        }
        return null;
    }
}
