export class Vec3 {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get width() {
        return this.x;
    }
    ;
    get height() {
        return this.y;
    }
    ;
    get depth() {
        return this.z;
    }
    ;
    _new(x, y, z) {
        return new this.constructor(x, y, z);
    }
    add(other) {
        return this._new(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    sub(other) {
        return this._new(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    scaled(amt) {
        return this._new(this.x * amt, this.y * amt, this.z * amt);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    cross(other) {
        return this._new(this.y * other.z - this.z * other.y, -(this.x * other.z - this.z * other.x), this.x * other.y - this.y * other.x);
    }
    magnitude() {
        return Math.sqrt(this.dot(this));
    }
    normalized() {
        return NormalizedVec3.unsafe_from_vec3(this.scaled(1 / this.magnitude()));
    }
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    static zero() {
        return new Vec3(0, 0, 0);
    }
}
export class NormalizedVec3 {
    x;
    y;
    z;
    _from_vec3(vec3) {
        this.x = vec3.x;
        this.y = vec3.y;
        this.z = vec3.z;
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
        return new Vec3(this.x, this.y, this.z);
    }
    static unsafe_from_vec3(vec3) {
        return new NormalizedVec3(vec3);
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
