import { canvas_render } from "../rendering/canvas.js";
import { Light } from "../shapes/Light.js";
import { Sphere } from "../shapes/Sphere.js";
import { Ray } from "../util/Ray.js";
import { ColorRGB, Vec2 } from "../util/Vec.js";
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
}
export class LightCollection extends Collection {
    constructor(objects = []) {
        super(objects);
    }
    some(callback) {
        return this.objects.some(callback);
    }
}
export class Scene {
    active_camera;
    objects;
    lights;
    downscale_vec;
    constructor(active_camera, objects = new Collection(), lights = new LightCollection(), downscale = 1) {
        this.active_camera = active_camera;
        this.objects = objects;
        this.lights = lights;
        this.downscale_vec = new Vec2(downscale, downscale);
    }
    render() {
        canvas_render.clear();
        /*
        @todo instead of walking, compute closest intercept
        @todo async threading
        */
        this.active_camera.scan((pos, ray) => {
            let hit = false;
            let paint_color = new ColorRGB(1, 1, 1);
            let minimum_light_distance = 100;
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
                    ray = closest_object.reflection(new Ray(hit_position, ray.direction));
                    paint_color = paint_color.add(closest_object.color).scaled(0.5);
                    continue;
                }
            }
            if (hit) {
                const ambient = 0.5;
                const brightness = ambient + ((1 - ambient) * (100 - minimum_light_distance) / 100);
                const c = paint_color.scaled(brightness * 255);
                canvas_render.draw_pixel(pos, { color: `rgb(${c.x}, ${c.y}, ${c.z})`, size: this.downscale_vec });
            }
        });
        // @todo shadow. Wen at final point trace to light if hit anything then shadow?
        console.log("DONE");
    }
}
