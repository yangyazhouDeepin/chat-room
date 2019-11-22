
let defaultParmas = {
  // sessionId: '183009958957154304', '172855241769746432'
  // userId: '172850518157164544', '172850518157164546'
  userId: '',
  sessionId: '',
  data: {}
}

export const setParams = () => {
  let params = JSON.parse(window.sessionStorage.getItem('login'))
  defaultParmas.userId = params.userId
  defaultParmas.sessionId = params.sessionId
}

export default (params) => {
  return JSON.stringify(Object.assign(defaultParmas, params))
}