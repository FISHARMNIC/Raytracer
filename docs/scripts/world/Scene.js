export class Collection {
    objects;
    constructor(objects = []) {
        this.objects = objects;
    }
    add(obj) {
        this.objects.push(obj);
    }
}
export class Scene {
    active_camera;
    objects;
    constructor(active_camera, objects = new Collection()) {
        this.active_camera = active_camera;
        this.objects = objects;
    }
    render() {
    }
}
