import { canvas_render } from "../rendering/canvas.js";
import { Vec2 } from "../util/Vec.js";
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
            let paint_hue = 0;
            let minimum_light_distance = 100;
            let age = 0;
            for (; age < 200; age++) {
                this.objects.forEach((object) => {
                    if (object.check_hit(ray.position)) {
                        ray = object.reflection(ray);
                        paint_hue = object.hue;
                        hit = true;
                    }
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
                canvas_render.draw_pixel(pos, { color: `hsl(${paint_hue}, 77%, ${(100 - minimum_light_distance) / 1.1}%)`, size: this.downscale_vec });
            }
        });
        console.log("DONE");
    }
}
