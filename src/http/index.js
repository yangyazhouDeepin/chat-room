import http from './http'
import apis from './api'

export const getChatList = (params = {}) => {
  return http.get(apis.getChatList, params)
}

export const addChat = (params = {}) => {
  return http.post(apis.addChat, {...params})
}

export const delChat = (params = {}) => {
  return http.get(apis.delChat, {params: {...params}})
}