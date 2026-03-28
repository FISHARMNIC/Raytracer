import { canvas_render } from "../rendering/canvas.js";
import type { Light } from "../shapes/Light.js";
import type { Object3D } from "../shapes/Object3D.js";
import type { Ray } from "../util/Ray.js";
import { Vec2 } from "../util/Vec.js";
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
}

export class LightCollection extends Collection {

    declare objects: Light[];

    constructor(objects: Light[] = [])
    {
        super(objects);
    }

    public some(callback: (light: Light) => boolean) {
        return this.objects.some(callback);
    }
}

export class Scene {
    active_camera: Camera;

    objects: Collection;
    lights: LightCollection;

    private downscale_vec: Vec2;


    constructor(active_camera: Camera, objects: Collection = new Collection(), lights: LightCollection = new LightCollection(), downscale: number = 1) {
        this.active_camera = active_camera;
        this.objects = objects;
        this.lights = lights;
        this.downscale_vec = new Vec2(downscale, downscale);
    }

    public render() {
        canvas_render.clear();

        this.active_camera.scan((pos: Vec2, ray: Ray) => {

            let hit: boolean = false;
            let paint_hue: number = 0;
            let minimum_light_distance: number = 100;

            let age: number = 0;
            for (; age < 200; age++) {

                this.objects.forEach((object: Object3D) => {
                    if (object.check_hit(ray.position)) {
                        ray = object.reflection(ray);
                        paint_hue = object.hue;
                        hit = true; // @ todo add color mixing
                    }
                })

                const direct_hit: boolean = this.lights.some((light: Light): boolean => {
                    const light_info = light.radius_info(ray.position);

                    if (light_info.within_rad && hit) {
                        minimum_light_distance = 0;
                        return true;
                    } else if (light_info.distance < minimum_light_distance && hit) {
                        minimum_light_distance = light_info.distance;
                    }

                    return false;
                })

                if(direct_hit)
                {
                    break;
                }

                ray.step();
            }

            if (hit) {
                canvas_render.draw_pixel(pos, { color: `hsl(${paint_hue}, 77%, ${(100 - minimum_light_distance) / 1.1}%)`, size: this.downscale_vec });
            }
        })

        // @todo shadow. Wen at final point trace to light if hit anything then shadow?
        console.log("DONE");
    }

}