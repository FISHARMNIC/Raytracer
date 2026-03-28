import { Ray } from "../util/Ray.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
export class Object3D {
    position;
    color;
    diffusion = 0.05;
    constructor(position, color = new ColorRGB(0.5, 0.5, 0.5)) {
        this.position = position;
        this.color = color;
    }
    generate_diffusion_noise() {
        return (Math.random() - 0.5) * this.diffusion;
    }
    check_hit(vec3) {
        return false;
    }
    reflection(ray) {
        return ray;
    }
    compute_reflection(ray, normal, surface_point) {
        const dir_v3 = ray.direction.to_vec3();
        // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
        // r = d - 2(d dot n)n where n is normal and d is incoming direction
        const reflection_vector = dir_v3.sub(normal.to_vec3().scaled(dir_v3.dot(normal) * 2)).normalized(); // @todo is .normalized() redundant?
        const diffusion_vec = new Vec3(this.generate_diffusion_noise(), this.generate_diffusion_noise(), this.generate_diffusion_noise());
        const diffused_reflection = reflection_vector.to_vec3().add(diffusion_vec).normalized();
        // pushes the vector to the radius + a little more. Prevents intersecting with it again and weird reflections
        const reflected_ray = new Ray(surface_point.add(normal.to_vec3().scaled(0.001)), // pushes off edge
        diffused_reflection);
        return reflected_ray;
    }
}
