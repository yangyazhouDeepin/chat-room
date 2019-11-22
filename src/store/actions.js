import types from './actionTypes'
export default {
  setUser: (data) => ({type: types.SET_USER, data}),
  setSocket: data => ({type: types.SET_SOCKET, data}),
  setChatList: data => ({type: types.SET_CHAT_LIST, data}),
  setChatListDetail: data => ({type: types.SET_CHAT_LIST_DETAIL, data}),
  setMassList: data => ({type: types.SET_MASS_LIST, data}),
  setSystemMsg: data => ({type: types.SET_SYS_MSG, data}),
  setExpertMsg: data => ({type: types.SET_EXPERT_MSG, data}),
  setStorageRef: data => ({type: types.SET_STORAGE_REF, data})
}