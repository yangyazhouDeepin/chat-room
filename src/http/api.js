const prefix = '/api'
export default (config => {
  return Object.keys(config).reduce((copy, name) => {
    copy[name] = `${prefix + config[name]}`
    return copy
  }, {})
})({
  login: '/platUser/platUserLogin',
  strangerLogin: '/platUser/strangerLogin'
})