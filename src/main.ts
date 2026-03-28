import { canvas_constants, canvas_render } from "./rendering/canvas.js";
import { Light } from "./shapes/Light.js";
import { Sphere } from "./shapes/Sphere.js";
import type { Ray } from "./util/Ray.js";
import { NormalizedVec3, Vec2, Vec3 } from "./util/Vec.js";
import { Camera } from "./world/Camera.js";
import { Scene } from "./world/Scene.js";

// const cam = new Camera(Vec3.zero(), NormalizedVec3.z_vec(), canvas_constants.size);
// const scene = new Scene(cam);
// const sphere = new Sphere(new Vec3(0, 0, 50), 10);
// const light = new Light(new Vec3(-30, -30, 30), 30, 100);
// scene.objects.add(sphere);
// scene.objects.add(light);
// scene.render();

const spheres = [
    new Sphere(new Vec3(0, 0, 50), 10),
];
const light = new Light(new Vec3(-30, -30, 30), 30, 100);


let camera_position: Vec3 = Vec3.zero();
let camera_direction: NormalizedVec3 = NormalizedVec3.z_vec();

const render_downscale: number = 4;
const camera = new Camera(camera_position, camera_direction, canvas_constants.size.scaled(1 / render_downscale));

const render_function = () => {
    canvas_render.clear();

    camera.scan((pos: Vec2, ray: Ray) => {
        let hit: boolean = false;
        let paint_brightness: number = 30;
        let paint_hue: number = 0;

        for (let age = 0; age < 200; age++) {
            spheres.forEach((sphere: Sphere) => {
                if (sphere.within_radius(ray.position)) {
                    ray = sphere.reflection(ray);
                    paint_hue = sphere.hue
                    hit = true;
                }
            });

            if (light.within_radius(ray.position)) {
                paint_brightness = 60;
                break;
            }

            ray.step();
        }

        if (hit) {
            canvas_render.draw_pixel(pos, { color: `hsl(${paint_hue}, 77%, ${paint_brightness}%)`, size: new Vec2(render_downscale, render_downscale) });
        }
    })
    console.log("DONE");
}

render_function();

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft':
            camera_direction = camera_direction.to_vec3().sub(new Vec3(Math.PI / 30, 0, 0)).normalized();
            break;
        case 'ArrowRight':
            camera_direction = camera_direction.to_vec3().add(new Vec3(Math.PI / 30, 0, 0)).normalized();
            break;

        case 'ArrowUp':
            camera_direction = camera_direction.to_vec3().sub(new Vec3(0, Math.PI / 30, 0)).normalized();
            break;
        case 'ArrowDown':
            camera_direction = camera_direction.to_vec3().add(new Vec3(0, Math.PI / 30, 0)).normalized();
            break

        case 'KeyW':
            camera_position = camera_position.add(camera_direction.to_vec3().scaled(5));
            break;
        case 'KeyS':
            camera_position = camera_position.sub(camera_direction.to_vec3().scaled(5));
            break;

        // @todo breaks when view is parallel
        case 'KeyD':
            camera_position = camera_position.add(camera_direction.to_vec3().cross(new Vec3(0, -1, 0)).scaled(5));
            break;
        case 'KeyA':
            camera_position = camera_position.sub(camera_direction.to_vec3().cross(new Vec3(0, -1, 0)).scaled(5));
            break;
    }

    camera.move_camera({ position: camera_position, normal: camera_direction });
    render_function();
})