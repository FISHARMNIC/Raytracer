import { canvas_render } from "../rendering/canvas.js";
import { Light } from "../shapes/Light.js";
import type { Object3D } from "../shapes/Object3D.js";
import { Sphere } from "../shapes/Sphere.js";
import { Ray } from "../util/Ray.js";
import { ColorRGB, Vec2, Vec3 } from "../util/Vec.js";
import type { Camera } from "./Camera.js";

export class Collection {
    objects: Object3D[];

    constructor(objects: Object3D[] = []) {
        this.objects = objects;
    }

    public add(obj: Object3D) {
        this.objects.push(obj);
    }

    public forEach(callback: (object: Object3D) => void) {
        this.objects.forEach(callback);
    }

    public some(callback: (object: Object3D) => boolean) {
        return this.objects.some(callback);
    }

    public amount(): number {
        return this.objects.length;
    }
}

export class LightCollection extends Collection {

    declare objects: Light[];

    constructor(objects: Light[] = []) {
        super(objects);
    }

    public forEach(callback: (light: Light) => void) {
        this.objects.forEach(callback);
    }

    public some(callback: (light: Light) => boolean) {
        return this.objects.some(callback);
    }
}

export class Scene {
    active_camera: Camera;

    objects: Collection;

    private lights: LightCollection;

    samples: number = 4;

    private downscale_vec: Vec2;


    constructor(active_camera: Camera, objects: Collection = new Collection(), downscale: number = 1) {
        this.active_camera = active_camera;
        this.objects = objects;

        this.lights = new LightCollection([...objects.objects.filter((n) => n instanceof Light)]);


        this.downscale_vec = new Vec2(downscale, downscale);
    }


    private sample(ray: Ray): {
        hit: boolean,
        color: ColorRGB,
        minimum_light_distance: number,
        final_ray: Ray,
    } {

        let hit: boolean = false;
        let paint_color: ColorRGB = new ColorRGB(1, 1, 1);
        let minimum_light_distance: number = 100;

        let final_ray: Ray = ray;

        let bounces: number = 0;

        for (; bounces < 10; bounces++) {

            let closest = 1000;
            let closest_object: null | Object3D = null;
            const dir_v3 = ray.direction.to_vec3();

            this.objects.forEach((object: Object3D) => {
                const distance = object.distance(ray);
                if (distance && distance < closest) {
                    closest = distance;
                    closest_object = object;
                    hit = true;
                }
            })

            if (closest < 1000) {
                if (closest_object! instanceof Light) {
                    minimum_light_distance = 0;
                    break;
                }

                const hit_position: Vec3 = ray.position.add(dir_v3.scaled(closest));

                const ray_at_hit: Ray = new Ray(hit_position, ray.direction);

                final_ray = ray_at_hit;

                ray = closest_object!.reflection(ray_at_hit);
                paint_color = paint_color.add(closest_object!.color).scaled(0.5);
                continue;
            }
        }

        return {
            hit, color: paint_color, minimum_light_distance, final_ray
        }

    }

    private shadow_sample(hit_ray: Ray): number {

        let lights_hit: number = 0;

        hit_ray.direction = hit_ray.direction.to_vec3().scaled(-1).normalized();

        this.lights.forEach((light: Light) => {
            const to_light = light.position.sub(hit_ray.position).normalized();

            const shadow_origin = hit_ray.position.add(hit_ray.direction.to_vec3().scaled(0.001)); // same push off to avoid double intersection
            const shadow_ray = new Ray(shadow_origin, to_light);
            
            const sample = this.sample(shadow_ray);

            if (sample.minimum_light_distance === 0) {
                lights_hit++;
            }
        });

        return lights_hit;

    }

    public render() {
        canvas_render.clear();

        /*
        @todo instead of walking, compute closest intercept
        @todo async threading 
        @todo multiple samples
        */
        this.active_camera.scan((pos: Vec2, ray: Ray) => {

            let hit = false;
            let paint_colors: ColorRGB[] = [];
            let minimum_light_distances: number[] = [];
            let shadow_info: number[] = [];

            for (let i = 0; i < this.samples; i++) {
                const sample = this.sample(ray);

                if (sample.hit) {
                    hit = true;
                }

                paint_colors.push(sample.color);
                minimum_light_distances.push(sample.minimum_light_distance);

                const shadow_sample = this.shadow_sample(sample.final_ray);
                shadow_info.push(shadow_sample);
            }

            // if(!hit)
            // {
            //     return;
            // }

            const lightness = (shadow_info.reduce((a, b) => a + b) / this.samples) / this.lights.amount();

            const paint_color = paint_colors.reduce((a, b) => a.add(b)).scaled(1 / this.samples);
            const minimum_light_distance = minimum_light_distances.reduce((a, b) => a + b) / this.samples;

            if (hit) {
                // console.log(shadowness);

                const ambient = 0.5;
                const half_am = ambient / 2;

                const brightness = (half_am + ((1 - half_am) * (100 - minimum_light_distance) / 100)) * lightness + half_am;

                const c = paint_color.scaled(brightness * 255);

                canvas_render.draw_pixel(pos, { color: `rgb(${c.x}, ${c.y}, ${c.z})`, size: this.downscale_vec });
            }
        })

        // @todo shadow. Wen at final point trace to light if hit anything then shadow?
        console.log("DONE");
    }

}