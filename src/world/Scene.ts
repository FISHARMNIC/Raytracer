import type { Object3D } from "../shapes/Object3D.js";
import type { Camera } from "./Camera.js";

export class Collection
{
    objects: Object3D[];

    constructor(objects: Object3D[] = [])
    {
        this.objects = objects;
    }

    public add(obj: Object3D) {
        this.objects.push(obj);
    }
}

export class Scene
{
    active_camera: Camera;

    objects: Collection;


    constructor(active_camera: Camera, objects: Collection = new Collection())
    {
        this.active_camera = active_camera;
        this.objects = objects;
    }

    public render()
    {
        
    }
    
}