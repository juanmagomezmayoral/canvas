var ComplexNumber = /** @class */ (function () {
    function ComplexNumber(real, imaginary) {
        var _this = this;
        this.clone = function () {
            return new ComplexNumber(_this.x, _this.y);
        };
        this.equals = function (z) {
            return (z.real() == _this.x && z.imaginary() == _this.y);
        };
        this.toPrecision = function (k) {
            _this.x.toPrecision(k);
            _this.y.toPrecision(k);
            return _this;
        };
        this.toFixed = function (k) {
            _this.x.toFixed(k);
            _this.y.toFixed(k);
            return _this;
        };
        this.toString = function (polar) {
            if (!polar) {
                var ret = '';
                if (_this.x && _this.x != 0)
                    ret += _this.x.toFixed(2);
                if (_this.x && _this.y && _this.y != 0 || _this.y < 0)
                    ret += (_this.y < 0) ? '-' : '+';
                if (_this.y && _this.y != 0) {
                    var absIm = Math.abs(_this.y);
                    if (absIm != 1)
                        ret += absIm.toFixed(2);
                    ret += 'i';
                }
                return ret || '0';
            }
            else {
                return _this.magnitude() + ' ' + _this.angle();
            }
        };
        this.real = function () { return _this.x; };
        this.imaginary = function () { return _this.y; };
        this.radius = function () { return _this.rad(); };
        this.modulus = function () { return _this.rad(); };
        this.magnitude = function () { return _this.rad(); };
        this.abs = function () { return _this.rad(); };
        this.argument = function () { return _this.arg(); };
        this.angle = function () { return _this.arg(); };
        this.phase = function () { return _this.arg(); };
        // Conjugation ////////////////////////////////////////////////////////////
        this.conjugate = function () {
            _this.y = -_this.y;
            _this.a = -_this.a;
            return _this;
        };
        this.conj = function () { return _this.conjugate(); };
        this.bar = function () { return _this.conjugate(); };
        // Invert sign ///////////////////////////////////////////////////////////
        this.negate = function () {
            _this.x = -_this.x;
            _this.y = -_this.y;
            _this.a = Math.PI + _this.a;
            return _this;
        };
        // Summation ////////////////////////////////////////////////////////////
        this.add = function (z) {
            _this.x = _this.x + z.real();
            _this.y = _this.y + z.imaginary();
            _this.r = _this.rad();
            _this.a = _this.arg();
            return _this;
        };
        this.plus = function (z) { return _this.add(z); };
        // Substraction//////////////////////////////////////////////////////////
        this.subtract = function (z) {
            _this.x = _this.x - z.real();
            _this.y = _this.y - z.imaginary();
            _this.r = _this.rad();
            _this.a = _this.arg();
            return _this;
        };
        this.minus = function (z) { return _this.subtract(z); };
        this.sub = function (z) { return _this.subtract(z); };
        // Multiplication ///////////////////////////////////////////////////////
        this.multiply = function (z) {
            var out = new ComplexNumber(z.real() * _this.x - z.imaginary() * _this.y, z.real() * _this.y + z.imaginary() * _this.x);
            _this.x = out.x;
            _this.y = out.y;
            return _this;
        };
        this.times = function (z) { return _this.multiply(z); };
        this.mult = function (z) { return _this.multiply(z); };
        // Division ///////////////////////////////////////////////////////////
        this.divide = function (z) {
            var sqMod = Math.pow(z.magnitude(), 2);
            return _this.multiply(z.conjugate()).div(sqMod);
        };
        this.dev = function (z) { return _this.divide(z); };
        // Exp and logs ///////////////////////////////////////////////////////
        this.log = function (branch) {
            if (!branch)
                branch = 0;
            _this.x = Math.log(_this.magnitude());
            _this.y = _this.argument() + branch * 2 * Math.PI;
            return _this;
        };
        this.exp = function () {
            return _this.fromPolarCoordinates(Math.exp(_this.x), _this.y);
        };
        // Powers and roots ///////////////////////////////////////////////////
        this.pow = function (z) {
            // this^z = e^(z*log(this))
            var result = z.times(_this.clone().log()).exp();
            return _this.fromRectangularCoordinates(result.x, result.y);
        };
        this.sqr = function () {
            return _this.fromRectangularCoordinates(Math.pow(_this.x, 2) - Math.pow(_this.y, 2), 2 * _this.x * _this.y);
        };
        this.powExp = function (z) {
            // z^this = e^(this*log(z))
            return _this.times(z.log()).exp();
        };
        this.sqrt = function () {
            var sgn = _this.y < 0 ? -1 : 1;
            return _this.fromRectangularCoordinates(Math.sqrt((_this.r + _this.x) / 2), sgn * Math.sqrt((_this.r - _this.x) / 2));
        };
        this.root = function (n, branch) {
            return (n == 0) ?
                _this.fromRectangularCoordinates(1, 0) :
                _this.fromPolarCoordinates(Math.exp((1 / n) * Math.log(_this.r)), (_this.a + 2 * (branch % n) * Math.PI) / n);
        };
        // Trigonometric functions ///////////////////////////////////////////
        this.sin = function () {
            return _this.fromRectangularCoordinates(Math.sin(_this.x) * _this.cosh_(_this.y), Math.cos(_this.x) * _this.sinh_(_this.y));
        };
        this.cos = function () {
            return _this.fromRectangularCoordinates(Math.cos(_this.x) * _this.cosh_(_this.y), Math.sin(_this.x) * _this.sinh_(_this.y) * -1);
        };
        this.tan = function () {
            var denominator = Math.cos(2 * _this.x) + _this.cosh_(2 * _this.y);
            return _this.fromRectangularCoordinates(Math.sin(2 * _this.x) / denominator, _this.sinh_(2 * _this.y) / denominator);
        };
        // Hyperbolic functions ///////////////////////////////////////////
        this.sinh = function () {
            return _this.fromRectangularCoordinates(_this.sinh_(_this.x) * Math.cos(_this.y), _this.cosh_(_this.x) * Math.sin(_this.y));
        };
        this.cosh = function () {
            return _this.fromRectangularCoordinates(_this.cosh_(_this.x) * Math.cos(_this.y), _this.sinh_(_this.x) * Math.sin(_this.y));
        };
        this.tanh = function () {
            var denominator = _this.cosh_(2 * _this.x) + Math.cos(2 * _this.y);
            return _this.fromRectangularCoordinates(_this.sinh_(2 * _this.x) / denominator, Math.sin(2 * _this.y) / denominator);
        };
        this.x = real;
        this.y = imaginary;
        this.r = this.rad();
        this.a = this.arg();
        return this;
    }
    ComplexNumber.prototype.fromPolarCoordinates = function (radius, argument) {
        this.x = radius * Math.cos(argument);
        this.y = radius * Math.sin(argument);
        this.r = radius;
        this.a = argument;
        return this;
    };
    ComplexNumber.prototype.fromRectangularCoordinates = function (real, imaginary) {
        this.x = real;
        this.y = imaginary;
        this.r = this.rad();
        this.a = this.arg();
        return this;
    };
    ComplexNumber.prototype.div = function (real) {
        this.x = this.x / real;
        this.y = this.y / real;
        this.r = this.rad();
        this.a = this.arg();
        return this;
    };
    ComplexNumber.prototype.sinh_ = function (x) {
        return (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / 2;
    };
    ComplexNumber.prototype.cosh_ = function (x) {
        return (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2;
    };
    // Functions form modulus //////////////////////////////////////////////////
    ComplexNumber.prototype.rad = function () {
        this.r = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        return this.r;
    };
    //Functions for argument ///////////////////////////////////////////////////
    ComplexNumber.prototype.arg = function () {
        this.a = Math.atan2(this.y, this.x);
        return this.a;
    };
    return ComplexNumber;
}());
var MandelBrot = /** @class */ (function () {
    function MandelBrot(seed, limit, iterations) {
        var _this = this;
        this.setSeed = function (seed) {
            _this.z = new ComplexNumber(0, 0);
            _this.c = seed;
            _this.o = [];
            _this.is = false;
            return _this;
        };
        this.belongsToSet = function () {
            var w = new ComplexNumber(0, 0);
            var i = 0;
            while (i < _this.n && _this.z.modulus() <= _this.l) {
                _this.o.push(_this.z.sqr().plus(_this.c).clone());
                i++;
                //console.log(this.c.toString(),this.z.toString())
                //this.o.forEach((w,i)=>console.log(i, w.toString()))
            }
            _this.is = !(_this.o.length < _this.n);
            return _this.is;
        };
        this.orbit = function () { return _this.o; };
        this.seed = function () { return _this.c; };
        this.z = new ComplexNumber(0, 0);
        this.c = seed;
        this.l = limit;
        this.n = iterations;
        this.o = [];
        this.is = false;
        return this;
    }
    return MandelBrot;
}());
var Julia = /** @class */ (function () {
    function Julia(z, root, sensibility, iterations) {
        var _this = this;
        this.setSeed = function (seed) {
            _this.z = seed;
            _this.o = [];
            _this.is = false;
            return _this;
        };
        this.belongsToSet = function () {
            var i = 0;
            _this.o.push(_this.z.clone());
            while (i < _this.maxIterations && _this.z.modulus() < _this.escapeRadius) {
                _this.o.push(_this.z.sqr().plus(_this.c).clone());
                i++;
            }
            _this.is = !(_this.o.length < _this.maxIterations);
            return _this.is;
        };
        this.orbit = function () { return _this.o; };
        this.root = function () { return _this.c; };
        this.seed = function () { return _this.o[0]; };
        this.z = z;
        this.c = root;
        this.sensibility = sensibility;
        this.escapeRadius = this.sensibility + (Math.sqrt(1 + 4 * this.c.radius()) + 1) / 2;
        this.maxIterations = iterations;
        this.o = [];
        this.is = false;
        return this;
    }
    return Julia;
}());
