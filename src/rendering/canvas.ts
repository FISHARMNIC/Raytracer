import { Vec2 } from "../util/Vec.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const size: Vec2 = new Vec2(canvas.width, canvas.height);

export const canvas_constants = {
    size
};

export const canvas_render = {
    clear: (): void => {
        ctx.clearRect(0, 0, size.width, size.height);
    },
    draw_pixel: (position: Vec2, color: string = 'black'): void => {
        ctx.fillStyle = color;
        ctx.fillRect(position.x, position.y, 1, 1);
    },
};