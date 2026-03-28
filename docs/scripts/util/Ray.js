export class Ray {
    position;
    direction; // @todo increase precision
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }
    step() {
        this.position = this.position.add(this.direction);
    }
}
