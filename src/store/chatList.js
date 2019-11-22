import types from './actionTypes'

let initState = {
  list: {},
  chatList: {},
  // 自己的群发记录
  massList: []
}

function chatList(state = initState, action) {
  switch(action.type) {
    case types.SET_CHAT_LIST:
      return {...state, list: {...state.list, ...action.data}}
    case types.SET_CHAT_LIST_DETAIL:
      return {...state, chatList: {...state.chatList, ...action.data}}
    case types.SET_MASS_LIST:
      return {...state, massList: [...action.data]}
    default:
      return state
  }
}

export default chatList