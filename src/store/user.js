import types from './actionTypes'

let initState = {
  platAccount: '', //账号
  nickName: '',  //昵称
  setInfo: null,
  recommendCount: 0, //推荐未读消息
  systemCount: 0, //系统未读消息
}

function user (state = initState, action) {
  switch(action.type) {
    case types.SET_USER:
      return {...state.user, ...action.data}
    default:
      return state
  }
}

export default user