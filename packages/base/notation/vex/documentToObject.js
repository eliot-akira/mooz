
export default function documentToObject(fullDoc) {

  const { backend, ...doc } = fullDoc

  const obj = copyObject(doc, {})

  if (doc.getStaveConnectors) {
    obj.staveConnectors = doc.getStaveConnectors()
  }

  return obj
}

function copyObject(obj, to) {

  if (!obj || typeof obj!=='object') return obj

  Object.keys(obj).forEach(key => {
    const val = obj[key]
    to[key] = Array.isArray(val)
      ? val.map(v => copyObject(v, {}))
      : val
  })

  return to
}
