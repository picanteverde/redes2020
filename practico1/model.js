/**
 * Lotka Volterra model Generator - High Order function to generate
 * the model
 * @param {Number} A alpha
 * @param {*} B beta
 * @param {*} C gamma
 * @param {*} D delta
 */
const LV = (A, B, C, D) => [
  (t, r, f) => A * r - B * r * f,
  (t, r, f) => -1 * C * f + D * r * f
]

// model
let alpha = 0.1
let beta = 0.02
let gamma = 0.3
let delta = 0.01

let [R, F] = LV(alpha, beta, gamma, delta)

// numeric integration
let initial = [0, 40, 9]
let h = 2
let steps = 100

let solution = iterate([R, F], initial, h, steps)

let space = combine(range(0, 50, 1), range(0, 12, 1))

let vectors = space.map((point) => [
  R(0, point[0], point[1]),
  F(0, point[0], point[1])
])
.map((v) => vScale(v, 0.4))
.map((v, i) => vTranslate(v, space[i]))

console.log(vectors)
console.log(space)

let xMax = 52
let yMax = 15
let xMin = -1.5
let yMin = -10
let width = 500 * (xMax - xMin) / (yMax - yMin)
let height = 500

// P5
const plot = new Plot(width, height, new p5((p) => {

  p.setup = () => {
    p.createCanvas(plot.width, plot.height)
    p.background('#efeaef')
    plot.grid()
    // plot.slider('alpha', 0, 1, alpha, 0.05, [2, -1])
  }
  p.draw = () => {
    plot.axes()

    vectors.map((v, i) => plot.vector(v, space[i]))
    // Fixed points
    plot.circle([gamma / delta, alpha / beta], 10)
    plot.circle([0, 0], 10)
  }
}, 'diagramaDeFlujo'), xMax, yMax, xMin, yMin)
