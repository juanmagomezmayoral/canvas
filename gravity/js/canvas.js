const gravityField = document.getElementById('gravityField')
const gravityField_ctx = gravityField.getContext('2d')
const gravity = 1.2;
const friction = 0.85;
const security = 100

gravityField.width = innerWidth -security
gravityField.height = innerHeight-security

const mouse = {
  x: innerWidth / 2,
  y: (innerHeight) / 2
}
const colours = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
const grayColours = ['#4C4C4C','#565656','#616161','#6B6B6B','#767676','#808080','#8B8B8B','#959595','#A0A0A0','#AAAAAA','#B5B5B5','#BFBFBF']
const blueColours = ['#0092FF','#0B97FE','#179BFD','#22A0FB','#2EA5FA','#39AAF9','#45AEF8','#50B3F7','#5CB8F6','#67BDF4','#73C1F3','#7EC6F2']


addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  gravityField.width = innerWidth-security
  gravityField.height = innerHeight-security

  init()
})

// Objects
class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy    
    this.radius = radius
    this.color = color
  }

  draw() {
    gravityField_ctx.beginPath()
    gravityField_ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    gravityField_ctx.fillStyle = this.color
    gravityField_ctx.fill()
    gravityField_ctx.closePath()
   
  }

  update() {
    if (this.y + this.radius + this.dy > gravityField.height){
      this.dy = -this.dy * friction
    } else {
      this.dy += gravity
    }

    if (this.x + this.radius > gravityField.width ||
        this.x -this.radius <0){
      this.dx = -this.dx 
    }
    this.dx = this.dx*(1-friction/75)
    this.y += this.dy
    this.x += this.dx
    this.draw()
  }
}

// Implementation
let balls
function init() {
  balls = []
  let radius=0
  for (let i = 0; i < 100; i++) {
    radius = 5+Math.random()*20
    balls.push(new Ball(
      randomIntFromRange(radius, gravityField.width-radius),
      randomIntFromRange(radius, gravityField.height-radius), 
      30, 2,
      radius, 
      (i%2)?grayColours[i%(grayColours.length-1)]:blueColours[i%(blueColours.length-1)]
      )
    )
    
  }
}

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

