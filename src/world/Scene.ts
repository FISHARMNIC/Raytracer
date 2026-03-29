import { constants } from "../constants.js";
import { canvas_render } from "../rendering/canvas.js";
import { Light } from "../shapes/Light.js";
import type { Object3D } from "../shapes/Object3D.js";
import { Sphere } from "../shapes/Sphere.js";
import { Ray } from "../util/Ray.js";
import { ColorRGB, NormalizedVec3, Vec2, Vec3 } from "../util/Vec.js";
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

    samples: number = constants.SAMPLES;

    private downscale_vec: Vec2;


    constructor(active_camera: Camera, objects: Collection = new Collection(), downscale: number = 1) {
        this.active_camera = active_camera;
        this.objects = objects;

        this.lights = new LightCollection([...objects.objects.filter((n) => n instanceof Light)]);


        this.downscale_vec = new Vec2(downscale, downscale);
    }


    private sample(ray: Ray, do_shadows: boolean = true, max_bounces: number = constants.MAX_BOUNCES): {
        hit: boolean,
        color: ColorRGB,
        minimum_light_distance: number,
        lightness: number
    } {

        let hit: boolean = false;
        let paint_color: ColorRGB = new ColorRGB(1, 1, 1);
        let minimum_light_distance: number = 100;

        let lightness = 0;

        for (let bounces = 0; bounces < max_bounces; bounces++) {

            let closest = 1000;
            // @ts-ignore
            let closest_object: Object3D = null;
            const dir_v3 = ray.direction.to_vec3();

            this.objects.forEach((object: Object3D) => {
                const distance = object.distance(ray);
                if (distance && distance < closest) {
                    closest = distance;
                    closest_object = object;
                    hit = true;
                }
            })

            if (hit && closest_object) {
                if (closest_object instanceof Light) {
                    minimum_light_distance = 0;
                    break;
                }

                const hit_position: Vec3 = ray.position.add(dir_v3.scaled(closest));

                if (do_shadows) {
                    const in_shadow = this.shadow_sample(hit_position);
                    lightness += in_shadow;
                }

                // reflect and combine colors
                ray = closest_object.reflection(new Ray(hit_position, ray.direction));

                let color = closest_object!.color
                color.x = Math.sin(ray.position.x);
                color.y = Math.sin(ray.position.y);
                color.z = Math.sin(ray.position.z);

                paint_color = paint_color.add(color).scaled(0.5);

                continue;
            }
        }

        return {
            hit, color: paint_color, minimum_light_distance, lightness
        }

    }

    private shadow_sample(point: Vec3): number {
        let lights_hit = 0;

        this.lights.forEach((light: Light) => {

            const to_light = light.position.sub(point).normalized();
            // const shadow_origin = ray.position.add(ray.direction.to_vec3().scaled(0.001));
   
            const shadow_ray = new Ray(point.add(to_light.to_vec3().scaled(0.001)), to_light);
            
            const sample = this.sample(shadow_ray, false, 1);

            if (sample.minimum_light_distance == 0) {
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
            let shadow_info: number = 0;

            for (let i = 0; i < this.samples; i++) {
                const sample = this.sample(ray);

                if (sample.hit) {
                    hit = true;
                }

                paint_colors.push(sample.color);
                minimum_light_distances.push(sample.minimum_light_distance);

                shadow_info += sample.lightness;
            }

            // if(!hit)
            // {
            //     return;
            // }

            const lightness = shadow_info / (this.samples * this.lights.amount());

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