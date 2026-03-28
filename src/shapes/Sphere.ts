import { Object3D } from "./Object3D.js";
import { NormalizedVec3, Vec3 } from "../util/Vec.js";
import { Ray } from "../util/Ray.js";

export class Sphere extends Object3D {
    private _radius: number;

    constructor(position: Vec3, radius: number, hue?: number) {
        super(position, hue);

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

    public within_radius(point: Vec3): boolean {
        return this.radius_info(point).within_rad;
    }

    public reflection(ray: Ray): Ray {
        const dir_v3: Vec3 = ray.direction.to_vec3();

        const normal: NormalizedVec3 = ray.position.sub(this.position).normalized();

        // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
        // r = d - 2(d dot n)n where n is normal and d is incoming direction
        const reflection_vector: NormalizedVec3 = dir_v3.sub(normal.to_vec3().scaled(dir_v3.dot(normal) * 2)).normalized(); // @todo is .normalized() redundant?

        // pushes the vector to the radius + a little more. Prevents intersecting with it again and weird reflections
        const surface_point = this.position.add(normal.to_vec3().scaled(this.radius)); // center + normal to point scaled to edge
        const reflected_ray = new Ray(
            surface_point.add(normal.to_vec3().scaled(0.001)), // pushes off edge
            reflection_vector
        );

        return reflected_ray;
    }
}