export class Ray {
    position;
    direction; // @todo increase precision
    constructor(position, direction) {
        this.position = position;
        this.direction = direction.to_vec3().scaled(0.5).normalized();
    }
    step() {
        this.position = this.position.add(this.direction);
    }
}
