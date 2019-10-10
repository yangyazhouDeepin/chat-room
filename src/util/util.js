export default {
  bindMethod(obj, methodName) {
    let type = typeof methodName
    if (Array.isArray(methodName)) type = 'array'
    switch(type) {
      case 'string':
        obj[methodName] = obj[methodName].bind(obj)
        break
      case 'array':
        methodName.forEach(method => {
          try {
            obj[method] = obj[method].bind(obj)
          } catch(err) {
            console.log(method)
          }
        })
        break
      default: return ''
    }
  }
}