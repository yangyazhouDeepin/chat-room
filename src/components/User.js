import React from 'react'

const User = props => {
  return (
    <div className={`user-item ${props.activeUser}`} onClick={e => props.handleSelected(props.idx)}>
      <div className={`logo ${props.img ? '' : 'default'}`}></div>
      <div className="detail">
        <p className="name">刘行</p>
        <span className="last-time">最后登录18分钟以前</span>
      </div>
    </div>
  )
}

export default User