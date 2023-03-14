export class Vector3 {
    constructor(public x = 0, public y = 0, public z = 0) {}

    set(x: Vector3 | Array<number> | number, y?: number, z?: number) {
        const p = parseArgs(x, y, z);
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
        return this;
    }

    copy(v: Vector3) {
        this.set(v.x, v.y, v.z);
        return this;
    }

    clone() {
        return new Vector3().copy(this);
    }

    static add(v1: Vector3, v2: Vector3, target = v1.clone()) {
        return target.set(v1).add(v2);
    }

    add(x: Vector3 | Array<number> | number, y?: number, z?: number) {
        const p = parseArgs(x, y, z);
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
        return this;
    }

    sub(v: Vector3) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    subScalar(s: number) {
        return new Vector3(this.x - s, this.y - s, this.z - s);
    }

    subInPlace(v: Vector3) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    subScalarInPlace(s: number) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
    }

    multiply(v: Vector3) {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    multiplyScalar(s: number) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    multiplyInPlace(v: Vector3) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    }

    multiplyScalarInPlace(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    normalize() {
        const length = this.length();
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    normalizeInPlace() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        this.z /= length;
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    setLength(s: number) {
        return this.normalize().multiplyScalar(s);
    }

    setLengthInPlace(s: number) {
        this.normalizeInPlace();
        this.multiplyScalarInPlace(s);
    }

    limit(s: number) {
        if (this.length() > s) {
            this.setLengthInPlace(s);
        }
    }
}

function parseArgs(x: Vector3 | Array<number> | number, y?: number, z?: number) {
    const p = { x: 0, y: 0, z: 0 };
    if (x instanceof Vector3) {
        p.x = x.x || 0;
        p.y = x.y || 0;
        p.z = x.z || 0;
    } else if (x instanceof Array) {
        p.x = x[0] || 0;
        p.y = x[1] || 0;
        p.z = x[2] || 0;
    } else if (!y && !z) {
        p.x = x || 0;
        p.y = x || 0;
        p.z = x || 0;
    } else {
        p.x = x || 0;
        p.y = y || 0;
        p.z = z || 0;
    }
    return p;
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy(v: Vector2) {
        this.set(v.x, v.y);
    }

    add(v: Vector2) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    addScalar(s: number) {
        return new Vector2(this.x + s, this.y + s);
    }

    addInPlace(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    addScalarInPlace(s: number) {
        this.x += s;
        this.y += s;
    }

    sub(v: Vector2) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    subScalar(s: number) {
        return new Vector2(this.x - s, this.y - s);
    }

    subInPlace(v: Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    }

    subScalarInPlace(s: number) {
        this.x -= s;
        this.y -= s;
    }

    multiply(v: Vector2) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    multiplyScalar(s: number) {
        return new Vector2(this.x * s, this.y * s);
    }

    multiplyInPlace(v: Vector2) {
        this.x *= v.x;
        this.y *= v.y;
    }

    multiplyScalarInPlace(s: number) {
        this.x *= s;
        this.y *= s;
    }

    normalize() {
        const length = this.length();
        return new Vector3(this.x / length, this.y / length);
    }

    normalizeInPlace() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}
