function range(init, end, step) {
  return Array.from(Array(Math.floor((end - init) / step) + 1)).map((x,i) => init + i * step)
}

function combine(x, y) {
  return x.reduce(
    (ret, xi) => ret.concat(
      y.map(yi => [xi, yi])
    ),
    []
  )
}

function mapEval(points, f) {
  return points.map(p => [
    ...p,
    f(...p)
  ])
}