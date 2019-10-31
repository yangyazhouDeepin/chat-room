import { combineReducers } from 'redux'
import * as actionTypes from './action-types'
import initalState from './state'

const userInfo = (state = initalState, action) {
  switch (action.type) {
    case actionTypes.STORE_UPDATE:
      return action.data
    case actionTypes.STORE_ADD:
      state.id.unshift(action.data.id)
      return state
    case actionTypes.STORE_RM:
      state.id = state.id.filter(item => {
        if (item !== action.data.id) {
          return state.id
        }
      })
      return state
    default:
      return state

  } 
}

export default combineReducers({
  userInfo
})