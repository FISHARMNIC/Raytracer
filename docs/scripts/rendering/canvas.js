import { Vec2 } from "../util/Vec.js";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const size = new Vec2(canvas.width, canvas.height);
export const canvas_constants = {
    size
};
export const canvas_render = {
    clear: () => {
        ctx.clearRect(0, 0, size.width, size.height);
    },
    draw_pixel: (position, color = 'black') => {
        ctx.fillStyle = color;
        ctx.fillRect(position.x, position.y, 1, 1);
    },
};
