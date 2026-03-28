import { canvas_constants, canvas_render } from "./rendering/canvas.js";
import { Light } from "./shapes/Light.js";
import { Sphere } from "./shapes/Sphere.js";
import { NormalizedVec3, Vec2, Vec3 } from "./util/Vec.js";
import { Camera } from "./world/Camera.js";
import { Scene } from "./world/Scene.js";

// const cam = new Camera(Vec3.zero(), NormalizedVec3.z_vec(), canvas_constants.size);

// const scene = new Scene(cam);

// const sphere = new Sphere(new Vec3(0, 0, 100), 10);
// const light = new Light(new Vec3(30, 30, 80), 100);

// scene.objects.add(sphere);
// scene.objects.add(light);

// scene.render();

const camera = new Camera(Vec3.zero(), NormalizedVec3.z_vec(), canvas_constants.size);

camera.scan((pos: Vec2, ray: NormalizedVec3) => {
    console.log(pos);
    if(pos.x > 100)
    {
        canvas_render.draw_pixel(pos);
    }
})

console.log("DONE")