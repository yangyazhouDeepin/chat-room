import { combineReducers } from 'redux'
import user from './user'
import common from './comm'
import chatList from './chatList'

const reducer = combineReducers({
  user,
  common,
  chatList,
})

export default reducer