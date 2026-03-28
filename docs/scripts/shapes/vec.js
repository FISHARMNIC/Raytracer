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
        return this.scaled(1 / this.magnitude());
    }
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
}
export class Vec2 extends Vec3 {
    constructor(x, y) {
        super(x, y, 0);
    }
}
