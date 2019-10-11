const prefix = 'http://localhost:2333/api'
export default (config => {
  return Object.keys(config).reduce((copy, name) => {
    copy[name] = `${prefix + config[name]}`
    return copy
  }, {})
})({
  getChatList: '/chat/chatList',
  addChat: '/chat/add',
  delChat: '/chat/delete'
})