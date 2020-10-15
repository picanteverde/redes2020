const factors = [0, 0.5, 0.5, 1]

const t = (F, args, factor, param) => param[0] * F(...args.map((arg, i) => arg + factor * param[i]))

const one6th = 1 / 6

const next = (prev, k1, k2, k3, k4) => prev + one6th * (k1 + 2 * k2 + 2 * k3 + k4)

const rk = (fns, args, h) => {
  const k = factors.reduce(
    (k, factor, i) => k.concat([[h, ...fns.map((f) => t(f, args, factor, k[i]))]]),
    // [h, 0, 0, ...]
    [[h, ...fns.map(() => 0)]]
  )
  // returns a next value for each function
  return fns.map((f, i) =>
    next(
      // args[0] is x
      args[i + 1],
      ...k.slice(1).map((ki) => ki[i + 1])
    )
  )
}

const iterate = (fns, initial, h, steps) =>
  Array.from(Array(steps)).reduce(
    (values) =>
      values.concat([[values[values.length - 1][0] + h, ...rk(fns, values[values.length - 1], h)]]),
    [initial]
  )
