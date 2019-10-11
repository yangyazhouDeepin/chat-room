import axios from 'axios'
import {message} from 'antd'


axios.interceptors.response.use(response => {
  if (response.code === 0) {
    message.error(response.msg)
    return Promise.reject()
  }
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
        case 400: err.message = '请求错误(400)'; break;
        case 403: err.message = '拒绝访问(403)'; break;
        case 404: err.message = '请求出错(404)'; break;
        case 408: err.message = '请求超时(408)'; break;
        case 500: err.message = '服务器错误(500)'; break;
        case 501: err.message = '服务未实现(501)'; break;
        case 502: err.message = '网络错误(502)'; break;
        case 503: err.message = '服务不可用(503)'; break;
        case 504: err.message = '网络超时(504)'; break;
        case 505: err.message = 'HTTP版本不受支持(505)'; break;
        default: err.message = `连接出错(${err.response.status})!`;
    }
  } else {
      err.message = '连接服务器失败!'
  }
  message.error(err.message);
  return Promise.reject(err);
})

export default axios