import { canvas_render } from "../rendering/canvas.js";
import { Light } from "../shapes/Light.js";
import { Sphere } from "../shapes/Sphere.js";
import { Ray } from "../util/Ray.js";
import { ColorRGB, Vec2, Vec3 } from "../util/Vec.js";
export class Collection {
    objects;
    constructor(objects = []) {
        this.objects = objects;
    }
    add(obj) {
        this.objects.push(obj);
    }
    forEach(callback) {
        this.objects.forEach(callback);
    }
    some(callback) {
        return this.objects.some(callback);
    }
    amount() {
        return this.objects.length;
    }
}
export class LightCollection extends Collection {
    constructor(objects = []) {
        super(objects);
    }
    forEach(callback) {
        this.objects.forEach(callback);
    }
    some(callback) {
        return this.objects.some(callback);
    }
}
export class Scene {
    active_camera;
    objects;
    lights;
    samples = 4;
    downscale_vec;
    constructor(active_camera, objects = new Collection(), downscale = 1) {
        this.active_camera = active_camera;
        this.objects = objects;
        this.lights = new LightCollection([...objects.objects.filter((n) => n instanceof Light)]);
        this.downscale_vec = new Vec2(downscale, downscale);
    }
    sample(ray) {
        let hit = false;
        let paint_color = new ColorRGB(1, 1, 1);
        let minimum_light_distance = 100;
        let final_ray = ray;
        let bounces = 0;
        for (; bounces < 10; bounces++) {
            let closest = 1000;
            let closest_object = null;
            const dir_v3 = ray.direction.to_vec3();
            this.objects.forEach((object) => {
                const distance = object.distance(ray);
                if (distance && distance < closest) {
                    closest = distance;
                    closest_object = object;
                    hit = true;
                }
            });
            if (closest < 1000) {
                if (closest_object instanceof Light) {
                    minimum_light_distance = 0;
                    break;
                }
                const hit_position = ray.position.add(dir_v3.scaled(closest));
                const ray_at_hit = new Ray(hit_position, ray.direction);
                final_ray = ray_at_hit;
                ray = closest_object.reflection(ray_at_hit);
                paint_color = paint_color.add(closest_object.color).scaled(0.5);
                continue;
            }
        }
        return {
            hit, color: paint_color, minimum_light_distance, final_ray
        };
    }
    shadow_sample(hit_ray) {
        let lights_hit = 0;
        hit_ray.direction = hit_ray.direction.to_vec3().scaled(-1).normalized();
        this.lights.forEach((light) => {
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
    render() {
        canvas_render.clear();
        /*
        @todo instead of walking, compute closest intercept
        @todo async threading
        @todo multiple samples
        */
        this.active_camera.scan((pos, ray) => {
            let hit = false;
            let paint_colors = [];
            let minimum_light_distances = [];
            let shadow_info = [];
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
        });
        // @todo shadow. Wen at final point trace to light if hit anything then shadow?
        console.log("DONE");
    }
}
