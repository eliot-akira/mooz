
export default function removeDuplicates(a) {
  let seen = {}
  return a.filter((item) =>
    !item || seen.hasOwnProperty(item) ? false : (seen[item] = true)
  )
}