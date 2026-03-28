import { canvas_render } from "../rendering/canvas.js";
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
        this.active_camera.scan((pos, ray) => {
            let hit = false;
            let paint_color = new ColorRGB(1, 1, 1);
            let minimum_light_distance = 100;
            let age = 0;
            for (; age < 200; age++) {
                this.objects.some((object) => {
                    if (object.check_hit(ray.position)) {
                        ray = object.reflection(ray);
                        paint_color = paint_color.add(object.color).scaled(0.5);
                        hit = true;
                        return true;
                    }
                    return false;
                });
                const direct_hit = this.lights.some((light) => {
                    const light_info = light.radius_info(ray.position);
                    if (light_info.within_rad && hit) {
                        minimum_light_distance = 0;
                        return true;
                    }
                    else if (light_info.distance < minimum_light_distance && hit) {
                        minimum_light_distance = light_info.distance;
                    }
                    return false;
                });
                if (direct_hit) {
                    break;
                }
                ray.step();
            }
            if (hit) {
                const ambient = 0.2;
                const brightness = ambient + ((1 - ambient) * (100 - minimum_light_distance) / 100);
                const c = paint_color.scaled(brightness * 255);
                canvas_render.draw_pixel(pos, { color: `rgb(${c.x}, ${c.y}, ${c.z})`, size: this.downscale_vec });
            }
        });
        // @todo shadow. Wen at final point trace to light if hit anything then shadow?
        console.log("DONE");
    }
}
