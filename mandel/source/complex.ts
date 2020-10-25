class ComplexNumber {
    private x: number
    private y: number
    private r: number
    private a: number

    constructor(real: number, imaginary: number) {
        this.x = real
        this.y = imaginary
        this.r = this.rad()
        this.a = this.arg()
        return this
    }

    public fromPolarCoordinates(radius: number, argument: number) {
        this.x = radius * Math.cos(argument)
        this.y = radius * Math.sin(argument)
        this.r = radius
        this.a = argument
        return this
    }

    public fromRectangularCoordinates(real: number, imaginary: number) {
        this.x = real
        this.y = imaginary
        this.r = this.rad()
        this.a = this.arg()
        return this
    }

    private div(real: number): ComplexNumber {
        this.x = this.x / real
        this.y = this.y / real
        this.r = this.rad()
        this.a = this.arg()
        return this
    }
    private sinh_(x: number) {
        return (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / 2;
    }
    private cosh_(x: number) {
        return (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2;
    }
    clone = (): ComplexNumber => {
        return new ComplexNumber(this.x, this.y)
    }
    equals = (z: ComplexNumber): boolean => {
        return (z.real() == this.x && z.imaginary() == this.y)
    }
    toPrecision = (k: number): ComplexNumber => {
        this.x.toPrecision(k)
        this.y.toPrecision(k)
        return this
    }
    toFixed = (k: number): ComplexNumber => {
        this.x.toFixed(k)
        this.y.toFixed(k)
        return this
    }

    toString = (polar?: boolean) => {
        if (!polar) {
            let ret: string = ''
            if (this.x && this.x != 0) ret += this.x.toFixed(2)
            if (this.x && this.y && this.y != 0 || this.y < 0) ret += (this.y < 0) ? '-' : '+'
            if (this.y && this.y != 0) {
                const absIm: number = Math.abs(this.y)
                if (absIm != 1) ret += absIm.toFixed(2)
                ret += 'i'
            }
            return ret || '0'

        } else {
            return this.magnitude() + ' ' + this.angle()
        }
    }

    real = (): number => this.x
    imaginary = (): number => this.y

    // Functions form modulus //////////////////////////////////////////////////
    private rad(): number {
        this.r = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
        return this.r
    }
    radius = (): number => this.rad()
    modulus = (): number => this.rad()
    magnitude = (): number => this.rad()
    abs = (): number => this.rad()

    //Functions for argument ///////////////////////////////////////////////////
    arg(): number {
        this.a = Math.atan2(this.y, this.x)
        return this.a
    }
    argument = (): number => this.arg()
    angle = (): number => this.arg()
    phase = (): number => this.arg()

    // Conjugation ////////////////////////////////////////////////////////////
    conjugate = (): ComplexNumber => {
        this.y = - this.y
        this.a = - this.a
        return this
    }
    conj = (): ComplexNumber => this.conjugate()
    bar = (): ComplexNumber => this.conjugate()

    // Invert sign ///////////////////////////////////////////////////////////
    negate = (): ComplexNumber => {
        this.x = -this.x
        this.y = - this.y
        this.a = Math.PI + this.a
        return this
    }

    // Summation ////////////////////////////////////////////////////////////
    add = (z: ComplexNumber): ComplexNumber => {
        this.x = this.x + z.real()
        this.y = this.y + z.imaginary()
        this.r = this.rad()
        this.a = this.arg()
        return this
    }
    plus = (z: ComplexNumber): ComplexNumber => this.add(z)

    // Substraction//////////////////////////////////////////////////////////
    subtract = (z: ComplexNumber): ComplexNumber => {
        this.x = this.x - z.real()
        this.y = this.y - z.imaginary()
        this.r = this.rad()
        this.a = this.arg()
        return this
    }
    minus = (z: ComplexNumber): ComplexNumber => this.subtract(z)
    sub = (z: ComplexNumber): ComplexNumber => this.subtract(z)

    // Multiplication ///////////////////////////////////////////////////////
    multiply = (z: ComplexNumber): ComplexNumber => {
        const out = new ComplexNumber(
            z.real() * this.x - z.imaginary() * this.y,
            z.real() * this.y + z.imaginary() * this.x)
        this.x = out.x
        this.y = out.y
        return this
    }
    times = (z: ComplexNumber): ComplexNumber => this.multiply(z)
    mult = (z: ComplexNumber): ComplexNumber => this.multiply(z)

    // Division ///////////////////////////////////////////////////////////
    divide = (z: ComplexNumber): ComplexNumber => {
        const sqMod = Math.pow(z.magnitude(), 2)
        return this.multiply(z.conjugate()).div(sqMod)
    }
    dev = (z: ComplexNumber): ComplexNumber => this.divide(z)

    // Exp and logs ///////////////////////////////////////////////////////
    log = (branch?: number): ComplexNumber => {
        if (!branch) branch = 0
        this.x = Math.log(this.magnitude())
        this.y = this.argument() + branch * 2 * Math.PI
        return this
    }

    exp = (): ComplexNumber => {
        return this.fromPolarCoordinates(Math.exp(this.x), this.y)
    }

    // Powers and roots ///////////////////////////////////////////////////
    pow = (z: ComplexNumber): ComplexNumber => {
        // this^z = e^(z*log(this))
        const result = z.times(this.clone().log()).exp()
        return this.fromRectangularCoordinates(result.x, result.y)
    }
    sqr = (): ComplexNumber => {
        return this.fromRectangularCoordinates(
            Math.pow(this.x, 2) - Math.pow(this.y, 2),
            2 * this.x * this.y
        )
    }
    powExp = (z: ComplexNumber): ComplexNumber => {
        // z^this = e^(this*log(z))
        return this.times(z.log()).exp()
    }

    sqrt = (): ComplexNumber => {
        const sgn = this.y < 0 ? -1 : 1
        return this.fromRectangularCoordinates(
            Math.sqrt((this.r + this.x) / 2),
            sgn * Math.sqrt((this.r - this.x) / 2)
        )
    }
    root = (n: number, branch: number): ComplexNumber => {
        return (n == 0) ?
            this.fromRectangularCoordinates(1, 0) :
            this.fromPolarCoordinates(
                Math.exp((1 / n) * Math.log(this.r)),
                (this.a + 2 * (branch % n) * Math.PI) / n)
    }
    // Trigonometric functions ///////////////////////////////////////////
    sin = (): ComplexNumber => {
        return this.fromRectangularCoordinates(
            Math.sin(this.x) * this.cosh_(this.y),
            Math.cos(this.x) * this.sinh_(this.y)
        )
    }
    cos = (): ComplexNumber => {
        return this.fromRectangularCoordinates(
            Math.cos(this.x) * this.cosh_(this.y),
            Math.sin(this.x) * this.sinh_(this.y) * -1
        )
    }
    tan = (): ComplexNumber => {
        const denominator = Math.cos(2 * this.x) + this.cosh_(2 * this.y)
        return this.fromRectangularCoordinates(
            Math.sin(2 * this.x) / denominator,
            this.sinh_(2 * this.y) / denominator
        )
    }
    // Hyperbolic functions ///////////////////////////////////////////
    sinh = (): ComplexNumber => {
        return this.fromRectangularCoordinates(
            this.sinh_(this.x) * Math.cos(this.y),
            this.cosh_(this.x) * Math.sin(this.y)
        )
    }
    cosh = (): ComplexNumber => {
        return this.fromRectangularCoordinates(
            this.cosh_(this.x) * Math.cos(this.y),
            this.sinh_(this.x) * Math.sin(this.y)
        )
    }
    tanh = (): ComplexNumber => {
        const denominator = this.cosh_(2 * this.x) + Math.cos(2 * this.y)
        return this.fromRectangularCoordinates(
            this.sinh_(2 * this.x) / denominator,
            Math.sin(2 * this.y) / denominator
        )
    }
}

class MandelBrot {
    private z: ComplexNumber
    private c: ComplexNumber
    private l: number
    private n: number
    private o: ComplexNumber[]
    public is: boolean

    constructor(seed: ComplexNumber, limit: number, iterations: number) {
        this.z = new ComplexNumber(0, 0)
        this.c = seed
        this.l = limit
        this.n = iterations
        this.o = []
        this.is = false
        return this
    }
    setSeed = (seed: ComplexNumber) => {
        this.z = new ComplexNumber(0, 0)
        this.c = seed
        this.o = []
        this.is = false
        return this
    }
    belongsToSet = (): boolean => {
        let w = new ComplexNumber(0, 0)
        let i = 0

        while (i < this.n && this.z.modulus() <= this.l) {
            this.o.push(this.z.sqr().plus(this.c).clone())
            i++
            //console.log(this.c.toString(),this.z.toString())
            //this.o.forEach((w,i)=>console.log(i, w.toString()))
        }
        this.is = !(this.o.length < this.n)
        return this.is
    }
    orbit = (): ComplexNumber[] => this.o
    seed = (): ComplexNumber => this.c

}


class Julia {
    private z: ComplexNumber
    private c: ComplexNumber
    public escapeRadius: number
    private sensibility: number
    private maxIterations: number
    private o: ComplexNumber[]
    public is: boolean

    constructor(z: ComplexNumber, root: ComplexNumber, sensibility: number, iterations: number) {
        this.z = z
        this.c = root
        this.sensibility = sensibility
        this.escapeRadius = this.sensibility + (Math.sqrt(1 + 4 * this.c.radius()) + 1) / 2;
        this.maxIterations = iterations
        this.o = []
        this.is = false
        return this
    }

    setSeed = (seed: ComplexNumber) => {
        this.z = seed
        this.o = []
        this.is = false
        return this
    }
    belongsToSet = (): boolean => {
        let i = 0
        this.o.push(this.z.clone())
        while (i < this.maxIterations && this.z.modulus() < this.escapeRadius) {
            this.o.push(this.z.sqr().plus(this.c).clone())
            i++
        }

        this.is = !(this.o.length < this.maxIterations)
        return this.is
    }
    orbit = (): ComplexNumber[] => this.o
    root = (): ComplexNumber => this.c
    seed = (): ComplexNumber => this.o[0]
}











