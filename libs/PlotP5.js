
const square = (x) => x * x
const vMagnitude = (v) => Math.sqrt(v.map(square).reduce((sum, x) => sum + x, 0))
const vScale = (v, s) => v.map(x => x * s)
const vNormal = (v) => vScale(v, 1 / vMagnitude(v))
const vTranslate = (v, t) => v.map((x, i) => x + t[i])
const vOpposite = (v) => v.map(x => x * -1)
const vOrthogonalAtOrigin = (v) => [v[1], v[0] * -1]

class Plot {
  constructor (width, height, p5, xMax, yMax, xMin, yMin) {
    this.p = p5
    this.width = width
    this.height = height
    this.max = {
      x: xMax || 1000,
      y: yMax || 1000
    }
    this.min = {
      x: xMin || 0,
      y: yMin || 0
    }
    this.scale = {
      x: width / (this.max.x - this.min.x),
      y: height / (this.max.y - this.min.y)
    }
  }

  scaleVector (v) {
    return [v[0] * this.scale.x, v[1] * this.scale.y]
  }

  position (v) {
    return [v[0] - this.min.x, v[1] - this.min.y]
  }

  fixY (v) {
    return [v[0], this.p.height - v[1]]
  }

  fix (v) {
    return this.fixY(this.scaleVector(this.position(v)))
  }

  line (start, end) {
    const [x1, y1] = this.fix(start)
    const [x2, y2] = this.fix(end)
    this.p.line(x1, y1, x2, y2)
  }

  text (str, anchor) {
    const [x, y] = this.fix(anchor)
    this.p.text(str, x, y)
  }

  slider (name, min, max, value, step = 1, anchor = [0, 0], width = 130) {
    const [x, y] = this.fix(anchor)
    const s = this.p.createSlider(min, max, value, step)
    s.position(x, y)
    s.style('width', `${width}px`)
    this.p.textAlign(this.p.RIGHT, this.p.TOP)
    this.text(name, [anchor[0], anchor[1]])
    return s
  }

  triangle (point1, point2, point3) {
    const [x1, y1] = this.fix(point1)
    const [x2, y2] = this.fix(point2)
    const [x3, y3] = this.fix(point3)
    this.p.triangle(
      x1,
      y1,
      x2,
      y2,
      x3,
      y3
    )
  }

  circle (point, diameter) {
    const [x, y] = this.fix(point)
    this.p.circle(x, y, diameter)
  }

  vector (end, start = [0, 0]) {
    this.p.strokeWeight(vMagnitude(vTranslate(end, vOpposite(start))) * this.scale.x * 0.03)
    this.p.stroke('#101010')
    this.line(start, end)
    if (start[0] !== 0 || start[1] !== 0) {
      end = vTranslate(end, vOpposite(start))
    }
    var n = vNormal(vOrthogonalAtOrigin(end))
    var ve = vScale(n, vMagnitude(end) * 0.05)
    var op = vOpposite(ve)
    var t = vScale(end, 0.8)
    if (start[0] !== 0 || start[1] !== 0) {
      end = vTranslate(end, start)
      ve = vTranslate(ve, start)
      op = vTranslate(op, start)
    }
    this.p.fill(0)
    this.p.noStroke()
    this.triangle(
      end,
      vTranslate(ve, t),
      vTranslate(op, t)
    )
  }

  axes (xColor, yColor) {
    const xMin = Math.floor(this.min.x)
    const yMin = Math.floor(this.min.y)
    const xMax = Math.ceil(this.max.x)
    const yMax = Math.ceil(this.max.y)
    this.p.stroke(xColor || '#990000')
    this.line([xMin, 0], [xMax, 0])
    this.p.stroke(xColor || '#009900')
    this.line([0, yMin], [0, yMax])
  }

  grid () {
    const xMin = Math.floor(this.min.x)
    const yMin = Math.floor(this.min.y)
    const xMax = Math.ceil(this.max.x)
    const yMax = Math.ceil(this.max.y)
    const size = 50
    const xSize = Math.floor(size / this.scale.x)
    const ySize = Math.floor(size / this.scale.y)

    this.p.stroke(255)
    this.p.textSize(10)
    this.p.textAlign(this.p.CENTER, this.p.TOP)
    for (let i = xMin; i < xMax; i += xSize) {
      this.line([i, yMin], [i, yMax])
      this.text(i, [i, -0.1])
    }

    this.p.textAlign(this.p.RIGHT, this.p.CENTER)
    for (let i = yMin; i < yMax; i += ySize) {
      this.line([xMin, i], [xMax, i])
      this.text(i, [-0.1, i])
    }
  }
}
