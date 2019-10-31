import React from 'react'
import {NavLink} from 'react-router-dom'

const MessageItem = props => {
  return (
    <NavLink className={`user-item`} to={props.path}>
      <div className={`logo ${props.isMass ? 'mass-logo' : 'default'}`}></div>
      <div className="detail">
        <p className="name">{props.isMass ? '群发历史' : '刘行'}</p>
        <span className="text">我将彩票返点提高为1%，将三方返水提高为1.5%</span>
        <div className="talk-date">
          9/16
        </div>
      </div>
    </NavLink>
  )
}

export default MessageItem