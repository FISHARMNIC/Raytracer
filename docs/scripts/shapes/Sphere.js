import { Object3D } from "./Object3D.js";
import { NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Ray } from "../util/Ray.js";
export class Sphere extends Object3D {
    _radius;
    constructor(position, radius, hue) {
        super(position, hue);
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
    within_radius(point) {
        return this.radius_info(point).within_rad;
    }
    reflection(ray) {
        const normal = ray.position.sub(this.position).normalized();
        const surface_point = this.position.add(normal.to_vec3().scaled(this.radius)); // center + normal to point scaled to edge
        return super.reflection(ray, normal, surface_point);
    }
}
