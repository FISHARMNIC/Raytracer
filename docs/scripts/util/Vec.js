export class Vec3 {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get width() { return this.x; }
    get height() { return this.y; }
    get depth() { return this.z; }
    add(other) {
        return __pool.next(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    sub(other) {
        return __pool.next(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    scaled(amt) {
        return __pool.next(this.x * amt, this.y * amt, this.z * amt);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    cross(other) {
        return __pool.next(this.y * other.z - this.z * other.y, -(this.x * other.z - this.z * other.x), this.x * other.y - this.y * other.x);
    }
    distance(other) {
        return this.sub(other).magnitude();
    }
    magnitude() {
        return Math.sqrt(this.dot(this));
    }
    normalized() {
        const mag = this.magnitude();
        return NormalizedVec3.unsafe_from_vec3(__pool.next(this.x / mag, this.y / mag, this.z / mag));
    }
    keepalive() {
        return new Vec3(this.x, this.y, this.z);
    }
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    static zero() {
        return new Vec3(0, 0, 0);
    }
    static diffusion_vector(diffusion) {
        return new Vec3((Math.random() - 0.5) * diffusion, (Math.random() - 0.5) * diffusion, (Math.random() - 0.5) * diffusion);
    }
}
class Vec3Pool {
    slab;
    cursor = 0;
    constructor(size = 64) {
        this.slab = Array.from({ length: size }, () => new Vec3(0, 0, 0));
    }
    next(x, y, z) {
        const v = this.slab[this.cursor % this.slab.length];
        this.cursor++;
        v.x = x;
        v.y = y;
        v.z = z;
        return v;
    }
}
export const __pool = new Vec3Pool(2048);
export class NormalizedVec3 {
    _x;
    _y;
    _z;
    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }
    _from_vec3(vec3) {
        this._x = vec3.x;
        this._y = vec3.y;
        this._z = vec3.z;
    }
    constructor(vec) {
        if (vec) {
            this._from_vec3(vec);
        }
        else {
            this._from_vec3(Vec3.zero());
        }
    }
    static x_vec() {
        return new NormalizedVec3(new Vec3(1, 0, 0));
    }
    static y_vec() {
        return new NormalizedVec3(new Vec3(0, 1, 0));
    }
    static z_vec() {
        return new NormalizedVec3(new Vec3(0, 0, 1));
    }
    to_vec3() {
        return __pool.next(this._x, this._y, this._z);
    }
    static unsafe_from_vec3(vec3) {
        return new NormalizedVec3(vec3);
    }
    diffused(diffusion) {
        return this.to_vec3().add(Vec3.diffusion_vector(diffusion)).normalized();
    }
    keepalive() {
        return NormalizedVec3.unsafe_from_vec3(new Vec3(this._x, this._y, this._z));
    }
}
export class Vec2 extends Vec3 {
    constructor(x, y) {
        super(x, y, 0);
    }
    static zero() {
        return new Vec2(0, 0);
    }
}
export class Basis {
    u;
    v;
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }
}
export class NormalizedBasis {
    u;
    v;
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }
}
export class ColorRGB extends Vec3 {
    constructor(r, g, b) {
        super(r, g, b);
    }
    add(other) {
        return new ColorRGB(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    scaled(amt) {
        return new ColorRGB(this.x * amt, this.y * amt, this.z * amt);
    }
    get r() {
        return this.x;
    }
    get g() {
        return this.y;
    }
    get b() {
        return this.z;
    }
}
