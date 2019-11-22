import React, { Component } from 'react'
import { Icon, Modal, Button, message, Radio } from 'antd'
import '@/assets/scss/chatdetail.scss'
import {CSSTransition} from 'react-transition-group'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import socketParams from '@/util/socketParams'
import inject_unmount from '@/util/inject_unmount'
import actions from '../store/actions'
import SendMsg from '../components/SendMsg'
import dayjs from 'dayjs'
import _ from 'lodash'
import { emojiIndex  } from 'emoji-mart'
const { emojis } = emojiIndex

@inject_unmount
class ChatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 设置备注弹窗显示状态
      visible: false,
      // 清空聊天弹窗
      clearFlag: false,
      clearVal: -2,
      remarkName: '',
      delBoxStyle: {
        display: 'none'
      },
      // 当前选中的消息记录
      activeMsg: '',
      // 是否是多选
      isMultiple: false,
      multipleList: [],
      animateClass: '',
      descName: '',
      // 上次加载已完成 可以继续加载更多
      first: true
    }
    // this.scrollTop = _.throttle(this.handlerScroll, 30)
    this.addMoreThrottle = _.debounce(this.addMore, 1000)
  }

  componentDidMount() {
    this.fid = this.props.match.params.userId
    this.selfId = JSON.parse(socketParams()).userId
    this.socket = this.props.common.socket
    // 获取聊天记录
    if (!this.props.chatList[this.fid] || this.props.chatList[this.fid].length < 15) {
      let arr = this.props.chatList[this.fid] || []
      let lastMsgId = arr.length ? arr[0].id : null 
      this.socket.subSend(socketParams({code: 10021, data: {
        friendId: this.fid,
        size: 15,
        lastMsgId: lastMsgId
      }}))
    }
    this.readAll()
    this.socket.subscriber.add('chatdetail' + this.fid, (data) => {
      switch(data.code) {
        case 10022:
          return this.getChatListCallback(data.data)
        case 10024:
          return this.sendMsgCallback(data.data)
        case 10025:
          return this.receiveMsgCallback(data.data)
        case 10032:
        case 10031:
          return this.delMsgCallback(data)
        case 10027:
          return this.updateMsgStatusCallback(data.data)
        case 10029:
          return this.readAllCallback(data.data)
        case 10030:
          return this.selfReadAllCallback(data.data)
        case 10016:
          return this.updateFriendNameCallback(data.data)
        default: return null
      }
    })
    this.scrollBottom(100)
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
    this.props.common.socket.subscriber.remove('chatdetail' + this.props.match.params.userId)
  }

  readAll = () => {
    this.socket.subSend(socketParams({code: 10029, data: {
      MsgIds: [],
      friendId: this.fid
    }}))
  }

  // 获取聊天记录
  getChatListCallback = (data) => {
    if (data.friendId === this.fid) {
      let temp = this.changeEmoji(data.msgList)
      let obj = {}
      obj[this.fid] = temp.reverse()
      obj[this.fid] = obj[this.fid].concat(this.props.chatList[this.fid] || [])
      this.props.setChatListDetail(obj)
      let chatPage = { ...this.props.list[this.fid] }
      chatPage.count = 0
      let ct = {}
      ct[this.fid] = chatPage
      this.props.setChatList(ct)
    }
  }
  // 发送消息的成功回调
  sendMsgCallback = (data) => {
    if (data.receiver !== this.fid) return
    let newArr = [...(this.props.chatList[this.fid] || [])]
    newArr.some(item => {
      if (item.tempId === data.tempId) {
        item.id = data.id
        item.receiver = this.fid
        return true
      }
    })
    let obj = {}
    obj[this.fid] = newArr
    this.props.setChatListDetail(obj)
  }
  // 接收到消息回调
  receiveMsgCallback = (data) => {
    if (data.sender !== this.fid) return
    // 通知对方已阅读
    this.socket.subSend(socketParams({code: 10027, data: {
      msgId: data.id,
      receiveTime: 1,
      readTime: 1
    }}))
  }
  // 删除聊天的回调
  delMsgCallback = (data) => {
    if (data.code === 10032 && data.data.friendId !== this.fid) return
    if (data.code === 10031 && data.data.friendId !== this.selfId) return
    let list = [...this.props.chatList[this.fid]]
    let msgIds = data.data.msgIds
    // 当 msgIds 为空数组的时候 代表全部删除
    if (!msgIds.length) {
      list = []
    } else {
      list = list.filter(item => !msgIds.includes(item.id))
    }
    let obj = {}
    obj[this.fid] = list
    this.props.setChatListDetail(obj)
  }
  // 消息状态更新  推送给好友
  updateMsgStatusCallback = (data) => {
    if (data.receiver !== this.fid) return
    let obj = this.changeChatListItem(data)
    this.props.setChatListDetail(obj)
  }
  // 阅读所有信息
  readAllCallback = (data) => {
    if (data.friendId !== this.fid) return
    let newArr = (this.props.chatList[this.fid] || []).concat([])
    newArr.forEach(item => {
      item.readTime = new Date().getTime().toString()
    })
    let obj = {}
    obj[this.fid] = newArr
    this.props.setChatListDetail(obj)
  }
  // 阅读对方所有消息
  selfReadAllCallback = (data) => {
    if (!data.MsgIds.length) {
      if (this.props.list[data.friendId]) {
        let newList = {...this.props.list[data.friendId]}
        newList.count = 0
        let obj = {}
        obj[data.friendId] = newList
        this.props.setChatList(obj)
      }
    }
  }
  updateFriendNameCallback = (data) => {
    let newObj = {...this.props.list[this.fid]}
    newObj.descName = this.state.descName
    let obj = {}
    obj[this.fid] = newObj
    this.props.setChatList(obj)
    this.setState({
      descName: '',
      remarkName: '',
      visible: false
    })
  }

  changeChatListItem = (data) => {
    let id = this.props.match.params.userId
    let tempArr = [...(this.props.chatList[id] || [])]
    let index = ''
    tempArr.some((item, idx) => {
      if (item.id === data.id) {
        index = idx
      }
    })
    if (index !== '') tempArr[index] = Object.assign(tempArr[index], data)
    let obj = {}
    obj[id] = tempArr
    return obj
  }

  // 发送消息
  sendMsg = (msg, type = 0) => {
    if (!msg.trim()) {
      return message.error('请输入发送内容!')
    }
    let now = new Date().getTime().toString()
    let data = {
      recUserId: this.props.match.params.userId,
      content: msg,
      type: type,
      tempId: now,
      sendTime: now
    }
    this.props.common.socket.subSend(socketParams({code: 10023, data}))
    let temp = [...(this.props.chatList[this.fid] || [])]
    data = this.changeEmoji(data)
    temp.push(data)
    let obj = {}
    obj[this.fid] = temp
    this.props.setChatListDetail(obj)
    this.scrollBottom()
  }

  changeEmoji = (data) => {
    if (Array.isArray(data)) {
      data.forEach(item => {
        let d = dayjs(Number(item.sendTime)).format('YY.MM.DD')
        if (dayjs().format('YY.MM.DD') === d) d = '今天'
        item.group = d
        if (item.content.indexOf('[') !== -1 && item.content.indexOf(']') !== -1) {
          let temp = item.content.split('[')
          item.content = temp.reduce((pre, next) => {
            pre = this.findEmoji(pre)
            next = this.findEmoji(next)
            return pre + next
          })
        }
      })
    } else {
      let d = dayjs(Number(data.sendTime)).format('YY.MM.DD')
      if (dayjs().format('YY.MM.DD') === d) d = '今天'
      data.group = d
      if (data.content.indexOf('[') !== -1 && data.content.indexOf(']') !== -1) {
        let temp = data.content.split('[')
          data.content = temp.reduce((pre, next) => {
            pre = this.findEmoji(pre)
            next = this.findEmoji(next)
            return pre + next
          })
      }
    }
    return data
  }

  findEmoji(item) {
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

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  handleChange = (e) => {
    this.setState({
      remarkName: e.target.value
    })
  }
  handleEdit = () => {
    if (!this.state.remarkName.trim()) {
      return message.error('备注名不能为空')
    }
    this.props.common.socket.subSend(socketParams({code: 10015, data: {
      friendId: this.props.match.params.userId,
      descName: this.state.remarkName.trim()
    }}))
    this.setState({
      descName: this.state.remarkName.trim()
    })
  }

  handleBoxClick = () => {
    this.closeDel()
  }

  getChatList = () => {
    let fid = this.props.match.params.userId
    if (this.props.chatList[fid]) {
      // 获取通过日期分组后的数据
      let newList = {}
      let temp = this.changeEmoji(this.props.chatList[fid])
      temp.forEach(user => {
        if (!newList[user.group]) newList[user.group] = []
        newList[user.group].push(user)
      })
      let arr = []
      let selfLogo = this.props.user.imageId ? 'icon-logo-' + this.props.user.imageId : 'default'
      let fLogo = this.props.list[fid].imageId ? 'icon-logo-' + this.props.list[fid].imageId : 'default'
      for (let key in newList) {
        arr.push(<p className="group-date" key={key}>{key}</p>)
        let temp = newList[key].map(user => {
          let logo = user.sender === fid ? fLogo : selfLogo
          let content = user.content;
          let link = ''; 
          if (user.type !== 0 && user.type !== undefined) {
            let file = JSON.parse(user.content)
            content = file.fileName
            link = file.link
          }
          return (
            <div key={user.id || user.tempId} onClick={() => this.multipleSelect(user)} className={`user-item ${user.sender !== fid ? 'self' : 'other'} ${logo} ${this.getMultipleClass(user)}`} >
              <div className="text-container"  onMouseUp={ev => this.handleDelete(ev, user)}>
                {user.type !== 0 ? <Icon className="m-r-5" type="file" /> : null}
                {content}
                {user.type !== 0 && link ? <a className="download-link" href={link}><Icon className="m-l-5 hover-show" type="download" /></a> : null}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;
              <div className="status">
                <span className="time">
                  {dayjs(Number(user.sendTime)).format('HH:mm')}
                </span>
                {
                  user.sender !== fid
                  ? <span className={`state ${user.sendTime ? 'state-send' : ''} ${user.readTime ? 'state-read' : ''} ${!user.receiver ? 'state-sending' : ''}`}></span>
                  : null
                }
              </div>
              </div>
            </div>
          )
        })
        arr = arr.concat(temp)
      }
      return arr
    }
    return null
  }

  getMultipleClass = (user) => {
    if (this.state.isMultiple && this.state.multipleList.length) {
      let ids = this.state.multipleList.map(item => item.id)
      if (ids.includes(user.id)) {
        return 'active'
      }
    }
    return ''
  }

  // 选择删除多条聊天记录
  multipleSelect = (obj) => {
    if (this.state.isMultiple) {
      this.setState((preState) => { 
        let temp = preState.multipleList
        let flag = temp.some((item, index, arr) => {
          if (item.id === obj.id) {
            arr.splice(index, 1)
            return true
          }
          return false
        })
        if (!flag) temp.push(obj)
        return {
          multipleList: temp
        }
      })
    }
  }

  closeDel = () => {
    this.setState({
      delBoxStyle: {
        display: 'none'
      }
    })
  }
  
  handleDelMsg = (type) => {
    switch(type) {
      case 0:
        this.delMsg(this.state.activeMsg)
        break
      case 1:
        this.setState({
          isMultiple: true
        })
        break
      case 2:
        this.setState({
          clearFlag: true
        })
        break
      default: return ''
    }
  }
  // state -2 双方删除 -1 为我删除
  delMsg = (dels, state = -2) => {
    let ids = dels
    if (Array.isArray(dels)) {
      ids = dels.map(msg => msg.id)
    } else {
      ids = [dels.id]
    }
    this.props.common.socket.subSend(socketParams({code: 10031, data: {
      msgIds: ids,
      friendId: this.props.match.params.userId,
      state: state
    }}))
    
  }

  handleDelete = (ev, msg) => {
    if (ev.button === 2) {
      ev.stopPropagation()
      let left = ev.clientX - 260 - 80
      let top = ev.clientY
      this.setState({
        delBoxStyle: {
          left: left + 'px',
          top: top + 'px',
          display: 'block'
        },
        activeMsg: msg
      })
    }
  }

  // 取消删除多条聊天记录
  cancelMultiple = () => {
    this.setState({
      isMultiple: false,
      multipleList: []
    })
  }

  // 删除多条记录
  delMultiple = () => {
    this.delMsg(this.state.multipleList)
    this.cancelMultiple()
  }

  // 使容器滚动到底部
  scrollBottom = (time = 100) => {
    this.timer = setTimeout(() => {
      if (!this.chatListEl) return
      let temp = this.chatListEl.offsetHeight - this.containerEl.offsetHeight
      if (temp > 0) {
        this.containerEl.scrollTop = temp + 20
      }
    }, time)
  }

  handleScroll = (e) => {
    let top = e.target.scrollTop
    if (top < 20 && top < this.preTop) {
      this.addMoreThrottle()
    }
    this.preTop = top
  }

  addMore = () => {
    let params = {
      code: 10021,
      data: {
        friendId: this.fid,
        size: 10
      }
    }
    if (this.props.chatList[this.fid] && this.props.chatList[this.fid].length) {
      params.data.lastMsgId = this.props.chatList[this.fid][0].id
    }
    this.socket.subSend(socketParams({...params}))
  }

  dellAll = () => {
    this.socket.subSend(socketParams({code: 10031, data: {
      msgIds: [],
      friendId: this.fid,
      state: this.state.clearVal
    }}))
    this.setState({
      clearFlag: false
    })
  }

  render() {
    let id = this.props.match.params.userId
    let name = ''
    let friend = this.props.list[id]
    let logo = ''
    if (friend) {
      name = friend.descName ? friend.descName + `（${friend.platAccount}）` : friend.platAccount
      logo = friend.isOnline ? (friend.imageId ? 'icon-logo-' + friend.imageId : 'default') : (friend.imageId ? 'icon-logo-offline-' + friend.imageId : 'default-offline')
      if (friend.userType === 0) {
        name = '陌生人'
        logo = 'icon-logo-stranger'
      }
    }
    return (
      <div className="chat-detail" onMouseUp={this.handleBoxClick}>
        <div className={`chat-header ${logo}`}>
          <span className="name">
            {name}
          </span>
          <span className="remark" onClick={this.showModal}>
            <Icon type="form"></Icon>
            备注
          </span>
        </div>
        <div className="chat-container" ref={(el) => this.containerEl = el} onScroll={this.handleScroll}>
          <div className="chat-list" ref={(el) => this.chatListEl = el}>
            {this.getChatList()}
          </div>
        </div>
        <SendMsg fid={id} changeText={this.changeEmoji} scrollBottom={this.scrollBottom} sendMsg={this.sendMsg} />
        <Modal
          visible={this.state.visible}
          onOk={this.handleEdit}
          onCancel={this.hideModal}
          footer={null}
          width="332px"
          wrapClassName="reset-modal"
        >
          <div className="modal-edit">
            <h3>设置备注</h3>
            <div className="container">
              备注名： <input className="my-input" value={this.state.remarkName} onChange={this.handleChange} type="text"/>
              <div className="bottom clearfix">
                <Button className="fl" onClick={this.hideModal}>取消</Button>
                <Button className="fr" onClick={this.handleEdit} type="primary">提交</Button>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          visible={this.state.clearFlag}    
          onCancel={() => this.setState({clearFlag: false})}
          footer={null}
          width="332px"
          wrapClassName="reset-modal"
        >
          <div className="modal-edit">
            <h3>你想删除这条信息吗?</h3>
            <div className="container">
              <Radio.Group onChange={e => this.setState({clearVal: e.target.value})} value={this.state.clearVal}>
                <p className="t-l">
                  <Radio value={-1}>
                    删除记录: 我
                  </Radio>
                </p>
                <Radio value={-2}>
                  删除记录: 所有人
                </Radio>
              </Radio.Group>
              <div className="bottom clearfix">
                <Button className="fl" onClick={() => {this.setState({clearFlag: false})}}>取消</Button>
                <Button className="fr" type="primary" onClick={this.dellAll}>提交</Button>
              </div>
            </div>
          </div>
        </Modal>
        <div className="delete-container" style={this.state.delBoxStyle}>
          <div className="item" onClick={() => this.handleDelMsg(0)}>删除记录</div>
          <div className="item" onClick={() => this.handleDelMsg(1)}>删除多条</div>
          <div className="item" onClick={() => this.handleDelMsg(2)}>清空聊天记录</div>
        </div>
        <CSSTransition
          in={this.state.isMultiple && this.state.multipleList.length > 0}
          timeout={0}
          onEnter={() => this.setState({animateClass: 'fadeInDown'})}
          onExited={() => this.setState({animateClass: 'fadeOutUp'})}
        >
          <div className={`multiple-header animated ${this.state.animateClass}`} >
            <Button type="primary" onClick={this.delMultiple}>删除{this.state.multipleList.length}条</Button>
            <span className="cancel-multiple" onClick={this.cancelMultiple}>取消</span>
          </div>
        </CSSTransition>
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    common: state.common,
    user: state.user,
    chatList: state.chatList.chatList,
    list: state.chatList.list
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setChatListDetail: (data) => dispatch(actions.setChatListDetail(data)),
    setChatList: (data) => dispatch(actions.setChatList(data))
  }
}
 
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ChatDetail)