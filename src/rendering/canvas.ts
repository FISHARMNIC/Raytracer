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
    draw_pixel: (position: Vec2, { color = 'black', size = new Vec2(1,1) }: { color?: string, size?: Vec2 } = {}): void => {
        ctx.fillStyle = color;
        ctx.fillRect(position.x * size.x, position.y * size.y, size.x, size.y);
    },
};