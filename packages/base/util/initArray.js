
// Create an array of size n filled with numbers
export default function initArray(n) {
  return Array.apply(null, Array(n)).map((x, i) => i)
}