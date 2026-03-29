type Vec3_Like = Vec3 | NormalizedVec3;


export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public get width() { return this.x }
    public get height() { return this.y }
    public get depth() { return this.z }

    public add(other: Vec3_Like): Vec3 {
        return __pool.next(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public sub(other: Vec3_Like): Vec3 {
        return __pool.next(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public scaled(amt: number): Vec3 {
        return __pool.next(this.x * amt, this.y * amt, this.z * amt);
    }

    public dot(other: Vec3_Like): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public cross(other: Vec3_Like): Vec3 {
        return __pool.next(
            this.y * other.z - this.z * other.y,
            -(this.x * other.z - this.z * other.x),
            this.x * other.y - this.y * other.x
        );
    }

    public distance(other: Vec3_Like): number {
        return this.sub(other).magnitude();
    }

    public magnitude(): number {
        return Math.sqrt(this.dot(this));
    }

    public normalized(): NormalizedVec3 {
        const mag = this.magnitude();
        return NormalizedVec3.unsafe_from_vec3(__pool.next(this.x / mag, this.y / mag, this.z / mag));
    }

    public keepalive(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    public clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    public static zero(): Vec3 {
        return new Vec3(0, 0, 0);
    }

    public static diffusion_vector(diffusion: number): Vec3 {
        return new Vec3(
            (Math.random() - 0.5) * diffusion,
            (Math.random() - 0.5) * diffusion,
            (Math.random() - 0.5) * diffusion
        );
    }
}


class Vec3Pool {
    private slab: Vec3[];
    private cursor: number = 0;

    constructor(size: number = 64) {
        this.slab = Array.from({ length: size }, () => new Vec3(0, 0, 0));
    }

    next(x: number, y: number, z: number): Vec3 {
        const v = this.slab[this.cursor % this.slab.length]!;
        this.cursor++;
        v.x = x;
        v.y = y;
        v.z = z;
        return v;
    }
}

export const __pool = new Vec3Pool(32);


export class NormalizedVec3 {
    private _x!: number;
    private _y!: number;
    private _z!: number;

    public get x() { return this._x; }
    public get y() { return this._y; }
    public get z() { return this._z; }

    private _from_vec3(vec3: Vec3): void {
        this._x = vec3.x;
        this._y = vec3.y;
        this._z = vec3.z;
    }

    private constructor(vec?: Vec3) {
        if (vec) {
            this._from_vec3(vec);
        } else {
            this._from_vec3(Vec3.zero());
        }
    }

    public static x_vec(): NormalizedVec3 {
        return new NormalizedVec3(new Vec3(1, 0, 0));
    }

    public static y_vec(): NormalizedVec3 {
        return new NormalizedVec3(new Vec3(0, 1, 0));
    }

    public static z_vec(): NormalizedVec3 {
        return new NormalizedVec3(new Vec3(0, 0, 1));
    }

    public to_vec3(): Vec3 {
        return __pool.next(this._x, this._y, this._z);
    }

    public static unsafe_from_vec3(vec3: Vec3): NormalizedVec3 {
        return new NormalizedVec3(vec3);
    }

    public diffused(diffusion: number): NormalizedVec3 {
        return this.to_vec3().add(Vec3.diffusion_vector(diffusion)).normalized();
    }

    public keepalive(): NormalizedVec3 {
        return NormalizedVec3.unsafe_from_vec3(new Vec3(this._x, this._y, this._z));
    }
}

export class Vec2 extends Vec3 {
    constructor(x: number, y: number) {
        super(x, y, 0);
    }

    public static zero(): Vec2 {
        return new Vec2(0, 0);
    }
}

export class Basis {
    u: Vec3;
    v: Vec3;
    constructor(u: Vec3, v: Vec3) {
        this.u = u;
        this.v = v;
    }
}

export class NormalizedBasis {
    u: NormalizedVec3;
    v: NormalizedVec3;
    constructor(u: NormalizedVec3, v: NormalizedVec3) {
        this.u = u; this.v = v;
    }
}

export class ColorRGB extends Vec3 {
    constructor(r: number, g: number, b: number) { 
        super(r, g, b); 
    }

    public add(other: Vec3_Like): ColorRGB {
        return new ColorRGB(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public scaled(amt: number): ColorRGB {
        return new ColorRGB(this.x * amt, this.y * amt, this.z * amt);
    }

    public get r() {
        return this.x;
    }

    public get g() {
        return this.y;
    }

    public get b() {
        return this.z;
    }
}