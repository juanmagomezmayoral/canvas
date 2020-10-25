//// helper objects - an screen point////

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.dr = 0
    }
    toString() { return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})` }
    slope(dx, dy) {
        this.dx = dx
        this.dy = dy
        this.dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        return this
    }
    speed(dx, dy) {
        this.dx += dx
        this.dy += dy
        return this
    }
    r() { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) }
    add(x, y) {
        this.x += x
        this.y += y
        return this
    }
}

