const limit = 2.1 
const maxIterations = 100

let MBL = [-2.2, 0.8, -1.2, 1.2] //límites del conjunto de MandelBrot
let JL = [-4,4] //límites del conjunto de Fatou/Juli 

let size = 400
let JuliaRoot= new ComplexNumber(0,0)

const setColours = [
    '#4C4C4C','#565656','#616161','#6B6B6B','#767676','#808080','#8B8B8B','#959595','#A0A0A0','#AAAAAA','#B5B5B5','#BFBFBF',
    '#0092FF','#0B97FE','#179BFD','#22A0FB','#2EA5FA','#39AAF9','#45AEF8','#50B3F7','#5CB8F6','#67BDF4','#73C1F3','#7EC6F2'
]

const orbitColor = '#FF9E27'

let spanCoordinatesMB = document.getElementById('coordinatesMB')
let spanCoordinatesJL = document.getElementById('coordinatesJL')

let container = document.getElementById('container')
let container_ctx = container.getContext('2d')

let orbits = document.getElementById('orbits')
let orbits_ctx = orbits.getContext('2d')

let parameters = document.getElementById('parameters')
let parameters_ctx = parameters.getContext('2d')

let parameters_orbits = document.getElementById('parameters_orbits')
let parameters_orbits_ctx = parameters_orbits.getContext('2d')

// ESTO sólo sirve para pintar rápido los cirsulitos sin calcularlos
const n = setColours.length
const r = 1
const d = r * 2

let off = document.getElementById('tester')
    off.width = (n+1) * d
    off.height = d
    let ctx = off.getContext('2d')

for (let i = 0; i < n+1; ++i) {
    ctx.fillStyle = (i<n)?setColours[i]:orbitColor
    ctx.beginPath()
    ctx.arc(i * d + r, r, r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
}

/////////////////////////////////

class ScreenPoint {
    constructor(x, y, minRe, maxRe, minIm, maxIm) {
      this.x = ((x-minRe)/(maxRe-minRe))*size
      this.y = (1-(y-minIm)/(maxIm-minIm))*size
    }
}

function Init(size) {
    container.width = size
    container.height = size
    drawAxis('#000000', container_ctx)

    orbits.width = size
    orbits.height = size

    parameters.width = size
    parameters.height = size
    drawAxis('#FFFFFF', parameters_ctx)

    parameters_orbits.width = size
    parameters_orbits.height = size
}

function getComplexCoordinates(screenx, screeny, minRe, maxRe, minIm, maxIm, pCtx) {
    return new ComplexNumber(
        (maxRe-minRe)*(screenx/pCtx.canvas.width)+minRe,
        (maxIm-minIm)*(1-screeny/pCtx.canvas.height)+minIm
    )
}

function drawPoint(p, colorNumber, minRe, maxRe, minIm, maxIm, pCtx) {
    const point = new ScreenPoint(p.real(), p.imaginary(), minRe, maxRe, minIm, maxIm)
    pCtx.drawImage(off, colorNumber * d, 0, d, d, point.x - r, point.y - r, d, d);
}

function drawAxis(color, pCtx) {
    const w = pCtx.canvas.width
    const h = pCtx.canvas.height

    pCtx.clearRect(0, 0, w, h)
    pCtx.strokeStyle=color
    pCtx.beginPath()    
    pCtx.moveTo(0, h/2)
    pCtx.lineTo(w, h/2)
    pCtx.stroke()
    
    pCtx.moveTo(w/2, 0)
    pCtx.lineTo(w/2, h)
    pCtx.stroke()
    pCtx.closePath() 
}

function drawMaldelbrotSet(limit, maxIterations, pCtx){
    let i=0
    let j=0
    let z = new MandelBrot(getComplexCoordinates(0, 0, MBL[0],MBL[1],MBL[2],MBL[3], pCtx), limit, maxIterations)

    spanCoordinatesMB.innerHTML='Start'
    for (i=r; i<pCtx.canvas.width-r; i++) {
        for (j=r; j<(pCtx.canvas.height-r)/2; j++) {
            z.setSeed(getComplexCoordinates(i, j,MBL[0],MBL[1],MBL[2],MBL[3], pCtx))
            z.belongsToSet()
            if (z.is) {
                drawPoint(z.seed(), 0,MBL[0],MBL[1],MBL[2],MBL[3], pCtx)
                drawPoint(z.seed().conjugate(), 0,MBL[0],MBL[1],MBL[2],MBL[3], pCtx)
                //console.log(z.seed(), z.seed().conjugate())
            } else {
                drawPoint(z.seed(), 1+ (z.orbit().length)%(setColours.length-1),MBL[0],MBL[1],MBL[2],MBL[3], pCtx)
                drawPoint(z.seed().conjugate(), 1+ (z.orbit().length)%(setColours.length-1),MBL[0],MBL[1],MBL[2],MBL[3], pCtx)
            }
        }
    }
    spanCoordinatesMB.innerHTML='End'
}
function btnClicked() {
    drawMaldelbrotSet(2, 50, container_ctx)
}

function drawJuliaSet(seed, pCtx) {
    pCtx.clearRect(0,0,pCtx.canvas.width, pCtx.canvas.height)

    let z = new Julia(new ComplexNumber(0,0), seed, 0.01, maxIterations)
    JL = [-z.escapeRadius, z.escapeRadius]
    let i=0
    let j=0
    spanCoordinatesJL.innerHTML='Start'
    for (i=r; i<pCtx.canvas.width-r; i++) {
         for (j=r; j<pCtx.canvas.height-r; j++) {
            z.setSeed(getComplexCoordinates(i, j, JL[0], JL[1], JL[0], JL[1], pCtx))
            z.belongsToSet()
            if (z.is) {
                drawPoint(z.seed(), 0, JL[0], JL[1], JL[0], JL[1], pCtx)
            } else {
                drawPoint(z.seed(), 1+ (z.orbit().length)%(setColours.length-1), JL[0], JL[1], JL[0], JL[1], pCtx)
            }
        }
    }
    spanCoordinatesJL.innerHTML='End'
}

window.addEventListener('load', (event) =>{
    Init(400)
})

window.addEventListener('click', (event) =>{
    if (event.x<container.width && event.y<container.height) {
        JuliaRoot = getComplexCoordinates(event.x, event.y, MBL[0],MBL[1],MBL[2],MBL[3], container_ctx)
        drawAxis('#ff0000', parameters_ctx)
        drawJuliaSet(JuliaRoot, parameters_ctx)
    }
})

window.addEventListener('resize', (event) =>{
    size = Math.min(window.innerWidth/2, window.innerHeight/2)
    Init(size)
})
window.addEventListener('mousemove', (event) =>{
    if (event.x<orbits.width && event.y<orbits.height) {
        const screenPoint = getComplexCoordinates(event.x, event.y, MBL[0],MBL[1],MBL[2],MBL[3], container_ctx)
        let z = new MandelBrot(screenPoint, limit, 10*maxIterations)
        spanCoordinatesMB.innerHTML = screenPoint.toString()
        orbits_ctx.clearRect(0,0,orbits_ctx.canvas.width, orbits_ctx.canvas.height)
        z.belongsToSet()
        z.orbit().forEach(w=> drawPoint(w, setColours.length,MBL[0],MBL[1],MBL[2],MBL[3], orbits_ctx))
    }

    if (event.x>window.innerWidth-parameters.width && event.y<parameters.height) {
console.log('aquí?')
        const screenPoint = getComplexCoordinates(event.x-(window.innerWidth-parameters.width), event.y, 
           JL[0],JL[1],JL[0],JL[1], parameters_ctx)
           spanCoordinatesJL.innerHTML = screenPoint.toString()
           let z = new Julia(screenPoint, JuliaRoot, limit, 10*maxIterations)
           parameters_orbits_ctx.clearRect(0,0, parameters_orbits_ctx.canvas.width, parameters_orbits_ctx.canvas.height)
           z.belongsToSet()
           z.orbit().forEach(w=> drawPoint(w, setColours.length,JL[0], JL[1], JL[0], JL[1], parameters_orbits_ctx))
    }    


})

/*
function drawJuliaSet2(seed, pCtx) {
    const R = 0.5+Math.sqrt(0.25 + Math.sqrt(Math.pow(seed.real(),2)+Math.pow(seed.imaginary(),2)))
    JL = [-R,R]
    pCtx.clearRect(0,0,pCtx.canvas.width, pCtx.canvas.height)

    let i=0
    let j=0
    let k=0
    let x=0
    let y=0
    let xo=0
    let temp=0
    const M=100
    console.log(R, seed.toString())

    spanCoordinatesJL.innerHTML='Start'
    for (i=r; i<pCtx.canvas.width-r; i++) {
        xo=2*R*(i/pCtx.canvas.width)-R
        for (j=r; j<pCtx.canvas.height-r; j++) {
            x=xo
            y = 2*R*(1-j/pCtx.canvas.height)-R
            k=0
            temp=0
            while (k<M && (Math.pow(x,2)+Math.pow(y,2))<Math.pow(R,2)) {
                temp=Math.pow(x,2)-Math.pow(y,2)
                y=2*x*y + seed.imaginary()
                x=temp + seed.real()
                k++
            }
            
            if (k<M) {
                pCtx.drawImage(off, (k%(setColours.length-1)) * d, 0, d, d, i - r, j - r, d, d)
            } else {
                pCtx.drawImage(off, 24 * d, 0, d, d, i - r, j - r, d, d)
            }
        }
    }
    spanCoordinatesJL.innerHTML='End'
}

*/