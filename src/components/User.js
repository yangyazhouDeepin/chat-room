import React from 'react'
import { NavLink } from 'react-router-dom'
import dayjs from 'dayjs'

const User = props => {
  return (
    <NavLink to={`/book/${props.user.friendId}`} className="user-item">
      <div className={`logo ${props.user.imageId ? 'icon-logo-' + props.user.imageId : 'default'}`}></div>
      <div className="detail">
        <p className="name">{props.user.descName || props.user.platAccount}</p>
        <span className="last-time">{props.user.isOnline ? '在线' : getTime(props.user.lastOnline)}</span>
      </div>
    </NavLink>
  )
}

function getTime(time) {
  let m = Math.floor((new Date().getTime() - Number(time)) / 1000 / 60 )
  let type = m > 0 ? '' : '-'
  m = Math.abs(m)
  let temp = ''
  if (m < 2) {
    return '刚刚离开'
  } else if (m < 60) {
     temp = m + '分钟'
  } else if (m < (60 * 24)) {
    temp = Math.floor(m / 60) + '小时'
  } else if (m < (60 * 24 * 30)) {
    temp = Math.floor(m / (60 * 24)) + '天'
  } else if (m < (60 * 24 * 365)) {
    temp = Math.floor(m / (60 * 24 * 30)) + '月'
  } else {
    temp = Math.floor(m / (60 * 24 * 365)) + '年'
  }
  return `最后登录${type + temp}以前`
}

export default User