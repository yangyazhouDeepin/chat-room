import http from './http'
import apis from './api'

export const login = (params = {}) => {
  return http.post(apis.login, params)
}

export const strangerLogin = (params = {}) => {
  return http.get(apis.strangerLogin, {params})
}