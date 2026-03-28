import { canvas_constants, canvas_render } from "./rendering/canvas.js";
import { Light } from "./shapes/Light.js";
import { Plane } from "./shapes/Plane.js";
import { Sphere } from "./shapes/Sphere.js";
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
const render_downscale = 4;
const objects = [
    new Sphere(new Vec3(12.5, 0, 50), 10),
    new Sphere(new Vec3(-12.5, 0, 50), 10, 100),
    new Sphere(new Vec3(0, -20, 50), 10, 200),
    new Plane({ a: 0, b: 1, c: 1, d: -80 }, 40)
];
const light = new Light(new Vec3(-50, -50, 30), 30, 100);
const downscale_vec = new Vec2(render_downscale, render_downscale);
let camera_position = Vec3.zero();
let camera_direction = NormalizedVec3.z_vec();
const camera = new Camera(camera_position, camera_direction, canvas_constants.size.scaled(1 / render_downscale));
const render_function = () => {
    canvas_render.clear();
    camera.scan((pos, ray) => {
        let hit = false;
        let paint_hue = 0;
        let minimum_light_distance = 100;
        let age = 0;
        for (; age < 200; age++) {
            objects.forEach((object) => {
                if (object.check_hit(ray.position)) {
                    ray = object.reflection(ray);
                    paint_hue = object.hue;
                    hit = true;
                }
            });
            const light_info = light.radius_info(ray.position);
            if (light_info.within_rad && hit) {
                minimum_light_distance = 0;
                break;
            }
            else if (light_info.distance < minimum_light_distance && hit) {
                minimum_light_distance = light_info.distance;
            }
            ray.step();
        }
        if (hit) {
            canvas_render.draw_pixel(pos, { color: `hsl(${paint_hue}, 77%, ${(100 - minimum_light_distance) / 1.1}%)`, size: downscale_vec });
        }
    });
    console.log("DONE");
};
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
            break;
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
});
