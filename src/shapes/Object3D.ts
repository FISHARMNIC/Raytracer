import { Ray } from "../util/Ray.js";
import { NormalizedVec3, Vec3 } from "../util/Vec.js";

export abstract class Object3D {
    position: Vec3;
    hue: number;
    diffusion: number = 0.05;

    constructor(position: Vec3, hue: number = 0) {
        this.position = position;
        this.hue = hue;
    }

    private generate_diffusion_noise(): number {
        return (Math.random() - 0.5) * this.diffusion;
    }

    public check_hit(vec3: Vec3): boolean {
        return false;
    }

    public reflection(ray: Ray): Ray
    {
        return ray;
    }

    protected compute_reflection(ray: Ray, normal: NormalizedVec3, surface_point: Vec3): Ray {
        const dir_v3: Vec3 = ray.direction.to_vec3();

        // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
        // r = d - 2(d dot n)n where n is normal and d is incoming direction
        const reflection_vector: NormalizedVec3 = dir_v3.sub(normal.to_vec3().scaled(dir_v3.dot(normal) * 2)).normalized(); // @todo is .normalized() redundant?

        const diffusion_vec: Vec3 = new Vec3(this.generate_diffusion_noise(), this.generate_diffusion_noise(), this.generate_diffusion_noise());
        const diffused_reflection = reflection_vector.to_vec3().add(diffusion_vec).normalized();

        // pushes the vector to the radius + a little more. Prevents intersecting with it again and weird reflections
        const reflected_ray = new Ray(
            surface_point.add(normal.to_vec3().scaled(0.001)), // pushes off edge
            diffused_reflection
        );

        return reflected_ray;
    }
}