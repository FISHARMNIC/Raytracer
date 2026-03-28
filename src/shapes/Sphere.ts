import { Object3D } from "./Object3D.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Ray } from "../util/Ray.js";

export class Sphere extends Object3D {
    private _radius: number;

    constructor(position: Vec3, radius: number, color?: ColorRGB) {
        super(position, color);

        this._radius = radius;
    }

    public get radius() {
        return this._radius;
    }

    public radius_info(point: Vec3){
        const distance: number = this.position.distance(point);
        const within_rad: boolean = distance <= this._radius;

        return {distance, within_rad};
    }

    public check_hit(point: Vec3): boolean {
        return this.radius_info(point).within_rad;
    }

    public reflection(ray: Ray): Ray {

        const normal: NormalizedVec3 = ray.position.sub(this.position).normalized();
        const surface_point = this.position.add(normal.to_vec3().scaled(this.radius)); // center + normal to point scaled to edge

        return super.compute_reflection(ray, normal, surface_point);
    }
}