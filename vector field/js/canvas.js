let ctx, canvas;
const O = {x:0, y:0 }
const maxX = 5
const maxY= 5

let vectorField = []

drawGrid = (gap, color, context) => {
  context.beginPath()
    for (x = gap; x < context.canvas.width; x = x + gap) {
      context.moveTo(x, 0)
      context.lineTo(x, context.canvas.height)
    }
    for (let y = gap; y < context.canvas.height; y = y + gap) {
      context.moveTo(0, y)
      context.lineTo(context.canvas.height, y)
    }
    context.strokeStyle = color
    context.stroke()
  context.closePath()
}

drawAxis = (color, margin, context) => {
  context.beginPath()
      context.moveTo(-context.canvas.width/2 + margin, 0)
      context.lineTo(context.canvas.width/2 - margin, 0)
      context.moveTo(0, -context.canvas.height/2 + margin)
      context.lineTo(0, context.canvas.height/2 - margin)
    context.strokeStyle = color
    context.stroke()
  context.closePath()
}

setCenter = (x, y, markIt, color, context) => {
  O.x = x
  O.y = y
  context.translate(x, y)
  if (markIt) {
    context.beginPath()
    context.arc(0, 0, 2, 0, Math.PI * 2, false)
    context.fillStyle = color
    context.fill()
    context.closePath()
  }
  context.scale(1, -1)
}

drawPoint = (x, y, color, fillcolor, context) => {
  context.beginPath()
  context.arc(x, y, 2, 0, Math.PI * 2, false)
  context.fillStyle = (fillcolor)?fillcolor:color
  context.fill()
  context.strokeStyle = color
  context.stroke()  
  context.closePath()
}

drawVectorField = (V, color, context)=>{
  const M = V.M
  
  M.forEach(p=>{
    const sx = 1+0.5 * p.x * canvas.width/maxX
    const sy = 1+0.5 * p.y * canvas.height/maxY
    const fx = 1+0.5 * (p.x+p.dx/(10*p.dr)) * canvas.width/maxX
    const fy = 1+0.5 * (p.y+p.dy/(10*p.dr)) * canvas.height/maxY

    context.beginPath()
    context.arc(sx, sy, 1, 0, Math.PI * 2, false)
    context.fillStyle = color
    context.fill()
    context.closePath()

    context.beginPath()
    context.moveTo(sx,sy)
    context.lineTo(fx,fy)    
    //context.lineTo(sx+p.dx/(p.dr), sy+p.dy/(p.dr))
    color = 12-Math.floor(12*p.dr/(V.max-V.min))

    context.strokeStyle = grayColours[color?color:0]
    context.stroke() 
    context.closePath()
    
  })


  
}


window.addEventListener('mousemove', (event) => {
  if (event.x <= canvas.width &&event.y <= canvas.height) {
    const sx = event.x - O.x
    const sy = O.y-event.y
    const x = 2*maxX*sx/canvas.width
    const y = 2*maxY*sy/canvas.height 

    let p = new Point(x, y) // es el punto en coordenadas escaladas
    coordinates.innerHTML = p.toString()

  }
})

window.addEventListener('click', (event) =>{
 // const sx = event.x - OX
 // const sy = OY-event.y
 // drawPoint(sx, sy, '#0092FF', '#7EC6F2', ctx)
})


document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("canvas")
  coordinates = document.getElementById("textContainer")
  ctx = canvas.getContext("2d")
  canvas.width = 800
  canvas.height = 800

  //Inicio de la pizarra
  drawGrid(20, '#BFBFBF', ctx)
  setCenter(400,400, true, '#FF9E27', ctx)
  drawAxis('#4C4C4C', 10, ctx)
  drawPoint(200, 200, '#0092FF', '#7EC6F2', ctx)

  button = document.getElementById('setField').onclick = (e)=>{
    const V = setField(-maxX, maxX, -maxY, maxY, 100)
    drawVectorField(V,'#0092FF', ctx)
  }

})


/*
// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  gravityField_ctx.clearRect(0, 0, gravityField.width, gravityField.height)

  //gravityField_ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)
  balls.forEach((ball,i) => {
    ball.update()
  })
}

init()
animate()

*/