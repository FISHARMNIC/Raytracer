import { Ray } from "../util/Ray.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "../util/Vec.js";
export class Object3D {
    position;
    color;
    diffusion;
    constructor(position, color = new ColorRGB(0.5, 0.5, 0.5), diffusion = 0) {
        this.position = position;
        this.color = color;
        this.diffusion = diffusion;
    }
    check_hit(vec3) {
        return false;
    }
    get_normal(ray) {
        return Vec3.zero().normalized();
    }
    reflection(ray) {
        return ray;
    }
    distance(ray) {
        return null;
    }
    compute_reflection(surface_point_ray, normal) {
        const dir_v3 = surface_point_ray.direction.to_vec3();
        // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
        // r = d - 2(d dot n)n where n is normal and d is incoming direction
        const reflection_vector = dir_v3.sub(normal.to_vec3().scaled(dir_v3.dot(normal) * 2)).normalized(); // @todo is .normalized() redundant?
        // const diffusion_vec: Vec3 = Vec3.diffusion_vector(this.diffusion);
        // const diffused_reflection = reflection_vector.to_vec3().add(diffusion_vec).normalized();
        // pushes the vector to the radius + a little more. Prevents intersecting with it again and weird reflections
        const reflected_ray = new Ray(surface_point_ray.position.add(normal.to_vec3().scaled(0.001)), // pushes off edge
        reflection_vector);
        return reflected_ray;
    }
}
