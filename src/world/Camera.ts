import { Ray } from "../util/Ray.js";
import { NormalizedBasis, NormalizedVec3, Vec2, Vec3 } from "../util/Vec.js";

export type Camera_Callback = (renderplane_position: Vec2, ray: Ray) => void;
export type Camera_Info = {
    position: Vec3;
    normal: NormalizedVec3;
    focal_length: number;
    width_rads: number;
    height_rads: number;
    resolution: Vec2;
};

export type Camera_Info_Partial = Partial<Camera_Info>;

export class Camera {

    // @ts-ignore
    private info: Camera_Info = {};

    // @ts-ignore
    private computed: {
        plane_origin: Vec3;
        basis: NormalizedBasis;
        bounds: Vec2;
        step: Vec2;
    } = {};

    constructor(position: Vec3, normal: NormalizedVec3, resolution: Vec2) {
        this.move_camera_all({
            position,
            normal,
            focal_length: 10,
            width_rads: Math.PI / 2,
            height_rads: Math.PI / 2,
            resolution
        });
    }

    private walking_point(offset: Vec2): Vec3 {

        // L(x,y) = P + x*u_hat + y*v_hat
        const add_x = this.computed.basis.u.to_vec3().scaled(offset.x);
        const add_y = this.computed.basis.v.to_vec3().scaled(offset.y);

        return this.computed.plane_origin.add(add_x).add(add_y);

    }

    private create_outgoing_ray(offset: Vec2): Ray {
        // Vector from camera -> walking point

        const position: Vec3 = this.walking_point(offset);
        const direction: NormalizedVec3 = position.sub(this.info.position).normalized();

        return new Ray(position, direction);
    }

    public scan(each_ray_do: Camera_Callback) {

        const scan: Vec2 = new Vec2(0, 0);

        for (scan.y = 0; scan.y < this.info.resolution.y; scan.y++) {
            for (scan.x = 0; scan.x < this.info.resolution.x; scan.x++) {

                // center pixels
                const renderplane_position = new Vec2(
                    -this.computed.bounds.x + (scan.x + 0.5) * this.computed.step.x,
                    -this.computed.bounds.y + (scan.y + 0.5) * this.computed.step.y
                );

                const ray: Ray = this.create_outgoing_ray(renderplane_position);

                // make starting from 0,0
                each_ray_do(scan, ray);
            }
        }
    }

    // type safe setup to ensure all entries get filled
    private move_camera_all(info: Camera_Info) {
        this.move_camera(info);
    }

    private compute_setup() {
        // @ todo maybe just move back out

        const generate_basis = (): NormalizedBasis => {
            // this when crossed with creates a perpendicular vector
            // the check is done so that its never parrallel with the vector that is going to be cross with it (normal)
            const t: Vec3 = Math.abs(this.info.normal.x) > 0.9 ? new Vec3(0, 1, 0) : new Vec3(1, 0, 0);

            // Creates the X basis vector, which is when multiplied with x gives a local coordinate for that X
            const t_cross_n: Vec3 = t.cross(this.info.normal);
            const u_hat: NormalizedVec3 = t_cross_n.normalized();  // -1 is just for +x going right 

            // Note in my math I swapped u and v. U is supposed to be X, Y is V
            const basis: NormalizedBasis = new NormalizedBasis(
                // does same as above but for Y basis. Note that unsafe is OK here since the vectors are perpendicular, so cross magnitude is still normalized
                NormalizedVec3.unsafe_from_vec3(this.info.normal.to_vec3().cross(u_hat)), // -1 is just for +y going down 
                NormalizedVec3.unsafe_from_vec3(u_hat.to_vec3().scaled(-1)),
            );

            this.computed.basis = basis;

            return basis;
        }

        const compute_plane_origin = (): Vec3 => {
            // Center of viewplane is focal_length units away from camera origin in the direction of view
            const plane_origin: Vec3 = this.info.position.add(this.info.normal.to_vec3().scaled(this.info.focal_length));

            this.computed.plane_origin = plane_origin;

            return plane_origin;
        }


        const generate_bounds = (): void => {
            const bounds = new Vec2(
                Math.tan(this.info.width_rads / 2),
                Math.tan(this.info.height_rads / 2)
            ).scaled(this.info.focal_length);

            console.log('CAMERA LOCAL UPPER BOUNDS (lower are negative)', bounds);

            const step = new Vec2(
                (2 * bounds.x) / this.info.resolution.x,
                (2 * bounds.y) / this.info.resolution.y
            );

            this.computed.bounds = bounds;
            this.computed.step = step;
        }

        compute_plane_origin();
        generate_basis();
        generate_bounds();

    }

    public move_camera(info: Camera_Info_Partial) {

        Object.entries(info).forEach((entry) => {
            const key = entry[0];

            (this.info[key as keyof Camera_Info] as any) = info[key as keyof Camera_Info_Partial]!;
        })

        // @ todo optimize, only needs to recompute things when certain things are changed
        this.compute_setup();

        console.log('BASIS VECTORS', this.computed.basis);
        console.log('PLANE ORIGIN', this.computed.plane_origin);

    }
}