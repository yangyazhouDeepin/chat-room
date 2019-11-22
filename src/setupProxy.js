const proxy = require('http-proxy-middleware')

module.exports = app => {
  app.use('/api', proxy({
    target: 'http://192.168.169.84:9003',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/"
    }
  }))
}