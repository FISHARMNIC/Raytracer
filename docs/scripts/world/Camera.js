import { Ray } from "../util/Ray.js";
import { NormalizedBasis, NormalizedVec3, Vec2, Vec3 } from "../util/Vec.js";
export class Camera {
    // @ts-ignore
    info = {};
    // @ts-ignore
    computed = {};
    constructor(position, normal, resolution) {
        this.move_camera_all({
            position,
            normal,
            focal_length: 20,
            width_rads: Math.PI / 2,
            height_rads: Math.PI / 2,
            resolution
        });
    }
    walking_point(offset) {
        // L(x,y) = P + x*u_hat + y*v_hat
        const add_x = this.computed.basis.u.to_vec3().scaled(offset.x);
        const add_y = this.computed.basis.v.to_vec3().scaled(offset.y);
        return this.computed.plane_origin.add(add_x).add(add_y);
    }
    create_outgoing_ray(offset) {
        // Vector from camera -> walking point
        const position = this.walking_point(offset);
        const direction = position.sub(this.info.position).normalized();
        return new Ray(position, direction);
    }
    scan(each_ray_do) {
        const scan = new Vec2(0, 0);
        for (scan.y = 0; scan.y < this.info.resolution.y; scan.y++) {
            for (scan.x = 0; scan.x < this.info.resolution.x; scan.x++) {
                // center pixels
                const renderplane_position = new Vec2(-this.computed.bounds.x + (scan.x + 0.5) * this.computed.step.x, -this.computed.bounds.y + (scan.y + 0.5) * this.computed.step.y);
                const ray = this.create_outgoing_ray(renderplane_position);
                // make starting from 0,0
                each_ray_do(scan, ray);
            }
        }
    }
    // type safe setup to ensure all entries get filled
    move_camera_all(info) {
        this.move_camera(info);
    }
    compute_setup() {
        // @ todo maybe just move back out
        const generate_basis = () => {
            // this when crossed with creates a perpendicular vector
            // the check is done so that its never parrallel with the vector that is going to be cross with it (normal)
            const t = Math.abs(this.info.normal.x) > 0.9 ? new Vec3(0, 1, 0) : new Vec3(1, 0, 0);
            // Creates the X basis vector, which is when multiplied with x gives a local coordinate for that X
            const t_cross_n = t.cross(this.info.normal);
            const u_hat = t_cross_n.normalized(); // -1 is just for +x going right 
            // Note in my math I swapped u and v. U is supposed to be X, Y is V
            const basis = new NormalizedBasis(
            // does same as above but for Y basis. Note that unsafe is OK here since the vectors are perpendicular, so cross magnitude is still normalized
            NormalizedVec3.unsafe_from_vec3(this.info.normal.to_vec3().cross(u_hat)), // -1 is just for +y going down 
            NormalizedVec3.unsafe_from_vec3(u_hat.to_vec3().scaled(-1)));
            this.computed.basis = basis;
            return basis;
        };
        const compute_plane_origin = () => {
            // Center of viewplane is focal_length units away from camera origin in the direction of view
            const plane_origin = this.info.position.add(this.info.normal.to_vec3().scaled(this.info.focal_length));
            this.computed.plane_origin = plane_origin;
            return plane_origin;
        };
        const generate_bounds = () => {
            const bounds = new Vec2(Math.tan(this.info.width_rads / 2), Math.tan(this.info.height_rads / 2)).scaled(this.info.focal_length);
            console.log('CAMERA LOCAL UPPER BOUNDS (lower are negative)', bounds);
            const step = new Vec2((2 * bounds.x) / this.info.resolution.x, (2 * bounds.y) / this.info.resolution.y);
            this.computed.bounds = bounds;
            this.computed.step = step;
        };
        compute_plane_origin();
        generate_basis();
        generate_bounds();
    }
    move_camera(info) {
        Object.entries(info).forEach((entry) => {
            const key = entry[0];
            this.info[key] = info[key];
        });
        // @ todo optimize, only needs to recompute things when certain things are changed
        this.compute_setup();
        console.log('BASIS VECTORS', this.computed.basis);
        console.log('PLANE ORIGIN', this.computed.plane_origin);
    }
}
