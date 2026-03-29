import { Triangle } from "../shapes/Triangle.js";
import { ColorRGB, Vec3 } from "./Vec.js";
export async function parseOBJ(path, scale = 1, offset = new Vec3(0, 0, 0)) {
    const text = await (await fetch(path)).text();
    const verts = [];
    const triangles = [];
    for (const line of text.split('\n')) {
        if (line.startsWith('v ')) {
            const [x, y, z] = line.trim().split(/\s+/).slice(1, 4).map(Number);
            verts.push(new Vec3(x * scale + offset.x, y * scale + offset.y, z * scale + offset.z));
        }
        else if (line.startsWith('f ')) {
            const indices = line.trim().split(/\s+/).slice(1)
                .map(part => parseInt(part.split('/')[0] ?? '0') - 1);
            for (let i = 1; i < indices.length - 1; i++) {
                triangles.push(new Triangle({
                    v0: verts[indices[0]],
                    v1: verts[indices[i]],
                    v2: verts[indices[i + 1]]
                }, new ColorRGB(1, 0, 0), 0.5));
            }
        }
    }
    return triangles;
}
