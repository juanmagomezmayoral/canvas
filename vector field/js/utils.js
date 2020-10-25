const colours = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']
const grayColours = ['#4C4C4C','#565656','#616161','#6B6B6B','#767676','#808080','#8B8B8B','#959595','#A0A0A0','#AAAAAA','#B5B5B5','#BFBFBF']
const blueColours = ['#0092FF','#0B97FE','#179BFD','#22A0FB','#2EA5FA','#39AAF9','#45AEF8','#50B3F7','#5CB8F6','#67BDF4','#73C1F3','#7EC6F2']

//// helper functions ////
randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

randomColor = (colors) => colors[Math.floor(Math.random() * colors.length)]

distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

///// Field definition ////
/*
dx = (x,y) => 1/(1+x*x+y*y)
dy = (x,y) => x/(1+y*y)

dx = (x,y) => -y
dy = (x,y) => x

dx = (x,y) => -y
dy = (x,y) => -x
*/
 dx = (x,y) => Math.sin(2 * Math.PI* x) - Math.cos(2 * Math.PI* y) 
 dy = (x,y) => Math.sin(2 * Math.PI* x^2+y^2)



setField = (minX, maxX, minY, maxY, samples) => {
  let i , j, p
  let M = []
  let min = 1000
  let max = -1000
  const step = 1/samples
  for (i = 0; i<=samples;i++){
    x = minX*(1-step*i)+maxX*step*i
    for (j = 0; j<=samples;j++){
      y = minY*(1-step*j)+maxY*step*j
      p= new Point(x, y)
      p.slope(dx(x,y), dy(x,y))

      if (p.dr>max) max=p.dr
      if (p.dr<min) min=p.dr
      
      M.push(p)
    }
  }
  return {M, max, min}
}


/*
window.addEventListener('mousemove', (event) =>{
  const sx = event.x - OX
  const sy = OY-event.y
  const x = 2*maxX*sx/canvas.width
  const y = 2*maxY*sy/canvas.height 

  let p = new Point(x, y) // es el punto en coordenadas escaladas
  coordinates.innerHTML = p.toString()

})
*/
