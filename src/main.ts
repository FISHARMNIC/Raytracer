import { canvas_constants } from "./rendering/canvas.js";
import { Light } from "./shapes/Light.js";
import { Plane } from "./shapes/Plane.js";
import { Sphere } from "./shapes/Sphere.js";
import { NormalizedVec3, Vec3 } from "./util/Vec.js";
import { Camera } from "./world/Camera.js";
import { Collection, LightCollection, Scene } from "./world/Scene.js";

const render_downscale: number = 3;

const objects: Collection =  new Collection([
    new Sphere(new Vec3(12.5, 0, 50), 10),
    new Sphere(new Vec3(-12.5, 0, 50), 10, 100),
    new Sphere(new Vec3(0, -20, 50), 10, 200),
    new Plane({ a:0, b:1, c:1, d:-80}, 40)
]);

const lights: LightCollection = new LightCollection([
    new Light(new Vec3(-50, -50, 30), 30, 100),
    // new Light(new Vec3(50, -50, 30), 30, 100),
]);

let camera_position: Vec3 = Vec3.zero();
let camera_direction: NormalizedVec3 = NormalizedVec3.z_vec();
const camera = new Camera(camera_position, camera_direction, canvas_constants.size.scaled(1 / render_downscale));

const scene = new Scene(camera, objects, lights, render_downscale);

scene.render();

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        
        // @todo this is also wrong. breaks once it goes vertical
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
    
    scene.render();
})