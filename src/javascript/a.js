function create(fn, ...args) {
  const obj = {}
  Object.setPrototypeOf(obj, fn.prototype)
  const result = fn.apply(this, args)
  return result instanceof Object ? result : obj
}


const add = function a(a) {
  return function b(b) {
    return a + b
  }
}

console.log(add(1))


const currify = (fn, params = []) => {
  return (arg) => {
    const newParams = params.concat(arg)
    console.log(fn.length, 'fn.length')
    if (newParams.length === fn.length) {
      return fn(...newParams)
    } else {
      return currify(fn, newParams)
    }
  }
}

const addTwo = (a, b) => a + b
const addThree = (a, b, c) => a + b + c

console.log(currify(addTwo)(1)(2))
console.log(currify(addThree)(1)(2)(3))