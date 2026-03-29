import { canvas_constants } from "./rendering/canvas.js";
import { Light } from "./shapes/Light.js";
import { Plane } from "./shapes/Plane.js";
import { Sphere } from "./shapes/Sphere.js";
import { Triangle } from "./shapes/Triangle.js";
import { parseOBJ } from "./util/obj.js";
import { ColorRGB, NormalizedVec3, Vec3 } from "./util/Vec.js";
import { Camera } from "./world/Camera.js";
import { Collection, LightCollection, Scene } from "./world/Scene.js";

const render_downscale: number = 1;

const objects: Collection = new Collection([

    // back wall (z = 80, white)
    new Triangle({ v0: new Vec3(-60, -60, 80), v1: new Vec3(60, -60, 80), v2: new Vec3(-60, 60, 80) }, new ColorRGB(0.73, 0.73, 0.73), 5),
    new Triangle({ v0: new Vec3(60, -60, 80),  v1: new Vec3(60, 60, 80),  v2: new Vec3(-60, 60, 80) }, new ColorRGB(0.73, 0.73, 0.73), 5),

    // left wall (x = -60, red)
    new Triangle({ v0: new Vec3(-60, -60, 0),  v1: new Vec3(-60, -60, 80), v2: new Vec3(-60, 60, 0)  }, new ColorRGB(0.65, 0.05, 0.05), 5),
    new Triangle({ v0: new Vec3(-60, -60, 80), v1: new Vec3(-60, 60, 80),  v2: new Vec3(-60, 60, 0)  }, new ColorRGB(0.65, 0.05, 0.05), 5),

    // right wall (x = 60, green)
    new Triangle({ v0: new Vec3(60, -60, 0),  v1: new Vec3(60, 60, 0),   v2: new Vec3(60, -60, 80) }, new ColorRGB(0.12, 0.45, 0.15), 5),
    new Triangle({ v0: new Vec3(60, 60, 0),   v1: new Vec3(60, 60, 80),  v2: new Vec3(60, -60, 80) }, new ColorRGB(0.12, 0.45, 0.15), 5),

    // floor (y = 60, white)
    new Triangle({ v0: new Vec3(-60, 60, 0),  v1: new Vec3(60, 60, 0),   v2: new Vec3(-60, 60, 80) }, new ColorRGB(0.73, 0.73, 0.73), 5),
    new Triangle({ v0: new Vec3(60, 60, 0),   v1: new Vec3(60, 60, 80),  v2: new Vec3(-60, 60, 80) }, new ColorRGB(0.73, 0.73, 0.73), 5),

    // ceiling (y = -60, white)
    new Triangle({ v0: new Vec3(-60, -60, 0), v1: new Vec3(-60, -60, 80), v2: new Vec3(60, -60, 0)  }, new ColorRGB(0.73, 0.73, 0.73), 5),
    new Triangle({ v0: new Vec3(60, -60, 0),  v1: new Vec3(-60, -60, 80), v2: new Vec3(60, -60, 80) }, new ColorRGB(0.73, 0.73, 0.73), 5),

    // tall box
    // front face
    new Triangle({ v0: new Vec3(-50, 0, 25),  v1: new Vec3(-20, 0, 25),  v2: new Vec3(-50, 60, 25) }, new ColorRGB(0.73, 0.73, 0.73), 2),
    new Triangle({ v0: new Vec3(-20, 0, 25),  v1: new Vec3(-20, 60, 25), v2: new Vec3(-50, 60, 25) }, new ColorRGB(0.73, 0.73, 0.73), 2),
    // back face
    new Triangle({ v0: new Vec3(-50, 0, 55),  v1: new Vec3(-50, 60, 55), v2: new Vec3(-20, 0, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 2),
    new Triangle({ v0: new Vec3(-20, 0, 55),  v1: new Vec3(-50, 60, 55), v2: new Vec3(-20, 60, 55) }, new ColorRGB(0.73, 0.73, 0.73), 2),
    // left face
    new Triangle({ v0: new Vec3(-50, 0, 25),  v1: new Vec3(-50, 60, 25), v2: new Vec3(-50, 0, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 2),
    new Triangle({ v0: new Vec3(-50, 60, 25), v1: new Vec3(-50, 60, 55), v2: new Vec3(-50, 0, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 2),
    // right face
    new Triangle({ v0: new Vec3(-20, 0, 25),  v1: new Vec3(-20, 0, 55),  v2: new Vec3(-20, 60, 25) }, new ColorRGB(0.73, 0.73, 0.73), 2),
    new Triangle({ v0: new Vec3(-20, 0, 55),  v1: new Vec3(-20, 60, 55), v2: new Vec3(-20, 60, 25) }, new ColorRGB(0.73, 0.73, 0.73), 2),
    // top face
    new Triangle({ v0: new Vec3(-50, 0, 25),  v1: new Vec3(-20, 0, 25),  v2: new Vec3(-50, 0, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 2),
    new Triangle({ v0: new Vec3(-20, 0, 25),  v1: new Vec3(-20, 0, 55),  v2: new Vec3(-50, 0, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 2),

    // short box (right)
    // front face
    new Triangle({ v0: new Vec3(20, 30, 30),  v1: new Vec3(50, 30, 30),  v2: new Vec3(20, 60, 30)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    new Triangle({ v0: new Vec3(50, 30, 30),  v1: new Vec3(50, 60, 30),  v2: new Vec3(20, 60, 30)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    // back face
    new Triangle({ v0: new Vec3(20, 30, 55),  v1: new Vec3(20, 60, 55),  v2: new Vec3(50, 30, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    new Triangle({ v0: new Vec3(50, 30, 55),  v1: new Vec3(20, 60, 55),  v2: new Vec3(50, 60, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    // left face
    new Triangle({ v0: new Vec3(20, 30, 30),  v1: new Vec3(20, 60, 30),  v2: new Vec3(20, 30, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    new Triangle({ v0: new Vec3(20, 60, 30),  v1: new Vec3(20, 60, 55),  v2: new Vec3(20, 30, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    // right face
    new Triangle({ v0: new Vec3(50, 30, 30),  v1: new Vec3(50, 30, 55),  v2: new Vec3(50, 60, 30)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    new Triangle({ v0: new Vec3(50, 30, 55),  v1: new Vec3(50, 60, 55),  v2: new Vec3(50, 60, 30)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    // top face
    new Triangle({ v0: new Vec3(20, 30, 30),  v1: new Vec3(50, 30, 30),  v2: new Vec3(20, 30, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),
    new Triangle({ v0: new Vec3(50, 30, 30),  v1: new Vec3(50, 30, 55),  v2: new Vec3(20, 30, 55)  }, new ColorRGB(0.73, 0.73, 0.73), 0.1),

    new Light(new Vec3(0, -58, 40), 12, 200),
]);


let camera_position: Vec3 = new Vec3(0,0,-30);
let camera_direction: NormalizedVec3 = NormalizedVec3.z_vec();

// let camera_position: Vec3 = new Vec3(-29.7707124263116, 0, 12.201972948111205);
// let camera_direction: NormalizedVec3 = NormalizedVec3.unsafe_from_vec3(new Vec3(0.387870613328645,-0.10053611199492526,0.9162144276865568))

const camera = new Camera(camera_position, camera_direction, canvas_constants.size.scaled(1 / render_downscale));

const scene = new Scene(camera, objects, render_downscale);

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
    
    console.log(camera_position, camera_direction)
    scene.render();
})