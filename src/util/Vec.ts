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

    public get width () {
        return this.x
    };

    public get height () {
        return this.y
    };

    public get depth () {
        return this.z
    };

    protected _new(x: number, y: number, z: number): this {
        return new (this.constructor as (new(x: number, y: number, z: number) => this))(x, y, z);
    }

    public add(other: Vec3_Like): this {
        return this._new(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public sub(other: Vec3_Like): this {
        return this._new(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public scaled(amt: number): this {
        return this._new(this.x * amt, this.y * amt, this.z * amt);
    }


    public dot(other: Vec3_Like): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public cross(other: Vec3_Like): Vec3 {
        return this._new(this.y * other.z - this.z * other.y, -(this.x * other.z - this.z * other.x), this.x * other.y - this.y * other.x);
    }


    public magnitude(): number {
        return Math.sqrt(this.dot(this));
    }

    public normalized(): NormalizedVec3 {
        return NormalizedVec3.unsafe_from_vec3(this.scaled(1 / this.magnitude()));
    }

    public clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    public static zero(): Vec3 {
        return new Vec3(0, 0, 0);
    }
}

export class NormalizedVec3 {
    x!: number;
    y!: number;
    z!: number;

    private _from_vec3(vec3: Vec3): void {
        this.x = vec3.x;
        this.y = vec3.y;
        this.z = vec3.z;
    }


    private constructor(vec?: Vec3)
    {
        if(vec)
        {
            this._from_vec3(vec);
        }
        else
        {
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
        return new Vec3(this.x, this.y, this.z);
    }

    public static unsafe_from_vec3(vec3: Vec3): NormalizedVec3 {
        return new NormalizedVec3(vec3);
    }
}

export class Vec2 extends Vec3{

    constructor(x: number, y: number)
    {
        super(x, y, 0);
    }

    public static zero(): Vec2 {
        return new Vec2(0, 0);
    }
}

export class Basis {
    u: Vec3;
    v: Vec3;

    constructor(u: Vec3, v: Vec3)
    {
        this.u = u;
        this.v = v;
    }
}

export class NormalizedBasis {
    u: NormalizedVec3;
    v: NormalizedVec3;

    constructor(u: NormalizedVec3, v: NormalizedVec3)
    {
        this.u = u;
        this.v = v;
    }
}