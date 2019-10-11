import React, {Component} from 'react'
import { Icon, Modal, Button, message, Radio } from 'antd'
import {withRouter} from 'react-router-dom'
import '@/assets/scss/chatdetail.scss'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import util from '@/util/util'
import {getChatList, addChat, delChat} from '@/http'
import {CSSTransition} from 'react-transition-group'

class ChatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 设置备注弹窗显示状态
      visible: false,
      // 清空聊天弹窗
      clearFlag: false,
      clearVal: 1,
      remarkName: '',
      delBoxStyle: {
        display: 'none'
      },
      emojiActive: false,
      emojiStyle: {
        position: 'absolute',
        right: 0,
        bottom: '44px',
        display: 'none'
      },
      msg: '',
      // 当前选中的消息记录
      activeMsg: '',
      // 是否是多选
      isMultiple: false,
      multipleList: [],
      mock: [],
      animateClass: ''
    }

    let methods = [
      'handleEdit',
      'showModal',
      'hideModal',
      'handleChange',
      'closeDel',
      'selectEmoji',
      'handleBoxClick',
      'showEmoji',
      'handleMsgChange',
      'sendMsg',
      'delMsg',
      'handleDelMsg',
      'handleMsgEnter',
      'cancelMultiple',
      'delMultiple'
    ]
    util.bindMethod(this, methods)
  }
  render() {
    return (
      <div className="chat-detail" onMouseUp={this.handleBoxClick}>
        <div className="chat-header">
          <span className="name">王军</span>
          <span className="remark" onClick={this.showModal}>
            <Icon type="form"></Icon>
            备注
          </span>
        </div>
        <div className="chat-container" ref={(el) => this.containerEl = el}>
          <div className="chat-list" ref={(el) => this.chatListEl = el}>
            {this.getChatList()}
          </div>
        </div>
        <div className="send-msg">
          <span className="upload-file">
            <Icon type="plus-circle" />
          </span>
          <input type="text" onKeyUp={this.handleMsgEnter} ref={(el) => this.textInput = el} onChange={this.handleMsgChange} value={this.state.msg} className="msg"/>
          <span className={`emoji ${this.state.emojiActive ? 'emoji-span-active' : ''}`} onClick={this.showEmoji}>
            <Icon type="smile" />
          </span>
          <span className="send" onClick={this.sendMsg}>发送</span>
        </div>
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
                  <Radio value={0}>
                    删除记录: 我
                  </Radio>
                </p>
                <Radio value={1}>
                  删除记录: 所有人
                </Radio>
              </Radio.Group>
              <div className="bottom clearfix">
                <Button className="fl" onClick={() => {this.setState({clearFlag: false})}}>取消</Button>
                <Button className="fr" type="primary">提交</Button>
              </div>
            </div>
          </div>
        </Modal>
        <div className="delete-container" style={this.state.delBoxStyle}>
          <div className="item" onClick={() => this.handleDelMsg(0)}>删除记录</div>
          <div className="item" onClick={() => this.handleDelMsg(1)}>删除多条</div>
          <div className="item" onClick={() => this.handleDelMsg(2)}>清空聊天记录</div>
        </div>
        <Picker set='google' emoji='point_up' style={this.state.emojiStyle} onSelect={(emoji, ev) => this.selectEmoji(emoji, ev)}/>
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

  componentDidMount() {
    this.getData()

  }

  getData() {
    getChatList()
      .then(res => {
        this.setState((preState) => {
          return {
            mock: res.data.data
          }
        }, () => {
          this.scrollBottom(this.containerEl, this.chatListEl)
        })
      })
  }

  showModal() {
    this.setState({
      visible: true
    })
  }

  showEmoji() {
    this.setState((preState) => {
      let obj = preState.emojiStyle
      obj.display = obj.display === 'block' ? 'none' : 'block'
      return {
        emojiStyle: obj,
        emojiActive: obj.display === 'block'
      }
    })
  }

  hideModal() {
    this.setState({
      visible: false
    })
  }

  hideEmoji() {
    this.setState((preState) => {
      let obj = preState.emojiStyle
      obj.display = 'none'
      return {
        emojiStyle: obj
      }
    })
  }

  handleChange(e) {
    this.setState({
      remarkName: e.target.value
    })
  }
  handleEdit() {
    if (!this.state.remarkName.trim()) {
      return message.error('备注名不能为空')
    }
  }

  handleBoxClick() {
    this.closeDel()
  }

  handleMsgChange(e) {
    this.setState({
      msg: e.target.value
    })
  }

  handleMsgEnter(evt) {
    if (evt.keyCode === 13) {
      this.sendMsg()
    }
  }

  getChatList() {
    return this.state.mock.map(user => {
      return (
        <div key={user._id} onClick={() => this.multipleSelect(user)} className={`user-item ${user.type ? 'default-user other' : 'self'} ${this.getMultipleClass(user)}`} >
          <div className="text-container"  onMouseUp={ev => this.handleDelete(ev, user)}>
            {user.text}
          </div>
        </div>
      )
    })
  }

  getMultipleClass(user) {
    if (this.state.isMultiple && this.state.multipleList.length) {
      let ids = this.state.multipleList.map(item => item._id)
      if (ids.includes(user._id)) {
        return 'active'
      }
      return ''
    }
    return ''
  }

  selectEmoji(emoji) {
    this.setState((preState) => {
      let val = preState.msg + emoji.native
      return {
        msg: val
      }
    }, () => {
      this.textInput.focus()
    })
  }

  // 选择删除多条聊天记录
  multipleSelect(obj) {
    if (this.state.isMultiple) {
      this.setState((preState) => { 
        let temp = preState.multipleList
        let flag = temp.some((item, index, arr) => {
          if (item._id === obj._id) {
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

  closeDel() {
    this.setState({
      delBoxStyle: {
        display: 'none'
      }
    })
  }
  // 发送消息
  sendMsg() {
    if (!this.state.msg.trim()) {
      return message.error('请输入发送内容!')
    }
    // 随机判断为自己还是对方
    let random = Number(Math.random().toFixed(1)) * 10 % 2
    let temp = {
      type: random,
      text: this.state.msg
    }
    addChat(temp)
      .then(res => {
        this.setState((preState) => {
          let val = preState.mock
          temp._id = res.data.data._id
          val.push(temp)
          return {
            mock: val,
            msg: ''
          }
        }, () => {
          this.scrollBottom(this.containerEl, this.chatListEl)
        })
      })
  }

  handleDelMsg(type) {
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

  delMsg(dels) {
    let ids = dels
    if (Array.isArray(dels)) {
      ids = dels.map(msg => msg._id).join(',')
    } else {
      ids = dels._id
    }
    delChat({ids})
      .then(res => {
        this.setState((preState) => {
          let temp = ids.split(',')
          let arr = preState.mock.filter(obj => {
            if (temp.length > 1) {
              return !temp.includes(obj._id) 
            } else if (obj._id !== ids) {
              return true
            }
          })
          return {
            mock: arr
          }
        })
      })
  }

  handleDelete(ev, msg) {
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
  cancelMultiple() {
    this.setState({
      isMultiple: false,
      multipleList: []
    })
  }

  // 删除多条记录
  delMultiple() {
    this.delMsg(this.state.multipleList)
    this.cancelMultiple()
  }

  // 容器滚动到底部
  scrollBottom(el, child) {
    let temp = child.offsetHeight - el.offsetHeight
    if (temp > 0) {
      el.scrollTop = temp + 20
    }
  }

}
 
export default ChatDetail