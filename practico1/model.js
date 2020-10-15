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
.map((v) => vScale(v,0.4))
.map((v, i) => vTranslate(v, space[i]))

console.log(vectors)
console.log(space)

let xMax = 50
let yMax = 12
let width = 400 * 50/12
let height = 400

// P5
const plot = new Plot(width, height, new p5((p) => {
  p.setup = () => {
    p.createCanvas(plot.width, plot.height)
  }
  p.draw = () => {
    p.background('#efeaef')
    plot.axes()

    vectors.map((v, i) => plot.vector(v, space[i]))
    plot.circle([30, 5], .1)
  }
}, 'diagramaDeFlujo'), xMax, yMax, -0.5, -0.5)
