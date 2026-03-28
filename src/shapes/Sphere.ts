import { Object3D } from "./Object3D.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Ray } from "../util/Ray.js";

export class Sphere extends Object3D {
    private _radius: number;

    constructor(position: Vec3, radius: number, color?: ColorRGB, diffusion?: number) {
        super(position, color, diffusion);

        this._radius = radius;
    }

    public get radius() {
        return this._radius;
    }

    public radius_info(point: Vec3) {
        const distance: number = this.position.distance(point);
        const within_rad: boolean = distance <= this._radius;

        return { distance, within_rad };
    }

    public check_hit(point: Vec3): boolean {
        return this.radius_info(point).within_rad;
    }

    public reflection(ray: Ray): Ray {

        const normal: NormalizedVec3 = ray.position.sub(this.position).normalized();
        const surface_point = this.position.add(normal.to_vec3().scaled(this.radius)); // center + normal to point scaled to edge

        return super.compute_reflection(ray, normal, surface_point);
    }

    public distance(ray: Ray): number | null {
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