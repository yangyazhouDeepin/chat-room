import React from 'react'
import {NavLink} from 'react-router-dom'
import { emojiIndex  } from 'emoji-mart'
import _ from 'lodash'
import dayjs from 'dayjs'
const { emojis } = emojiIndex


function changeEmoji(data) {
  if (!data.content) return ''
  if (data.content.indexOf('[') !== -1 && data.content.indexOf(']') !== -1) {
    let temp = data.content.split('[')
    data.content = temp.reduce((pre, next) => {
      pre = findEmoji(pre)
      next = findEmoji(next)
      return pre + next
    })
  }
  return data
}

function findEmoji(item) {
  if (item.indexOf(']') !== -1) {
    let arr = item.split(']')
    let emojiUnified = arr[0]
    let emoji = _.find(emojis, {unified: emojiUnified})
    if (emoji) {
      item = emoji.native + arr[1]
    }
    return item
  }
  return item
}

const MessageItem = props => {
  const count = props.chat.count > 99 ? '99+' : props.chat.count
  const isMass = props.chat.createDate
  const isToday = dayjs(Number(isMass || props.chat.sendTime || new Date().getTime())).format('YYYY/MM/DD') === dayjs().format('YYYY/MM/DD')
  const talkDate = dayjs(Number(isMass || props.chat.sendTime || new Date().getTime())).format(isToday ? 'HH:mm' : 'MM/DD')
  let logo = ''
  let name = ''
  if (isMass) {
    logo = 'mass-logo'
    name = '群发历史'
  } else if (props.chat.friendId === props.user.sysPid) {
    logo = 'icon-logo-superior'
    if (!props.chat.isOnline) logo = 'icon-logo-superior-offline'
    name = '直属管理员'
  } else if (props.chat.imageId) {
    logo = 'icon-logo-' + props.chat.imageId
    if (!props.chat.isOnline) logo = 'icon-logo-offline-' + props.chat.imageId
  } else if (props.chat.userType === 0) {
    logo = 'icon-logo-stranger'
    if (!props.chat.isOnline) logo = 'icon-logo-stranger-offline'
    name = '陌生人'
  } else {
    logo = 'default'
    if (!props.chat.isOnline) logo = 'default-offline'
  }
  name = name || (props.chat.descName || props.chat.platAccount)
  const content = (props.chat.type !== 0 && props.chat.type !== undefined) ? JSON.parse(props.chat.content).fileName : changeEmoji(props.chat).content
  return (
    <NavLink className={`user-item`} to={props.path}>
      <div className={`logo ${logo}`}></div>
      <div className="detail">
        <p className="name">{name}</p>
        <span className="text">{content}</span>
        <div className="talk-date">
          {talkDate}
        </div>
        { count > 0 ? <div className="new-message-mark">{props.chat.count}</div> : null }
      </div>
    </NavLink>
  )
}

export default MessageItem