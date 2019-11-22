import React, { Component } from 'react'
import * as qs from 'query-string'
import { login, strangerLogin } from '../../http'
import socketParams, { setParams } from '../../util/socketParams'
import Socket from '../../socket'
import _ from 'lodash' 

const SocketListener = (WrappedComponent, msgFunc, notifyFunc) => {

  return class extends Component {
    constructor(props) {
      super(props);
      this.playAudioDebounce = _.throttle(this.playAudio, 1000)
    }

    componentWillMount() {
      let params = window.sessionStorage.getItem('login')
      if (!params) {
        const query = qs.parse(this.props.location.search)
        let temp = {}
        let api = login
        if (query.pid) { // 陌生人登录
          temp.pid = query.pid
          api = strangerLogin
        } else { // 用户登录
          temp = {
            vi: 'ddddd',
            platCode: query.platCode,
            Content: JSON.stringify({platUserId: query.platUserId})
          }
        }
        api(temp)
        .then(res => {
          if (res.data.code === 200) {
            window.sessionStorage.setItem('login', JSON.stringify({userId: res.data.data.sysUserId, sessionId: res.data.data.sessionId}))
            setParams()
            this.initSocket()
            this.props.history.push('/chat')
          } else {
            msgFunc('登录失败')
          }
        })
        .catch(err => {
          msgFunc('登录失败')
        })
      } else {
        setParams()
        this.initSocket()
        this.props.history.push('/chat')
      }
    }
    handleHeartbeat () {
      this.heartTimer = setInterval(() => {
        this.socket.subSend(socketParams({code: 10071, data: {}}))
      }, 60000)
    }

    initSocket = () => {
      this.selfId = JSON.parse(socketParams()).userId
      this.socket = new Socket({
        url: this.props.common.socketUrl,
        name: 'header',
        receive: data => {
          console.log(data)
          let friend = null
          if (data.code < 0 && data.message) msgFunc('服务器异常，请联系管理员', 'error')
          switch(data.code) {
            // 登录
            case 10002:
              data.data.userId = this.selfId
              this.props.setUser(data.data)
              break
            // 获取聊天列表
          case 10012:
              let obj = {}
              data.data.forEach(item => {
                obj[item.friendId] = item
              })
              this.props.setChatList(obj)
              break
            // 获取群发列表
            case 10042:
              this.props.setMassList(data.data)
              break
            // 替换群发 tempid 为真实 id
            case 10044:
              let massList = [...this.props.massList]
              massList.filter(mass => {
                if (mass.tempId === data.data.tempId) {
                  mass.id = data.data.id
                }
              })
              this.props.setMassList(massList)
              break
            // 获取新消息 接收方为自己
            case 10025:
              this.playAudioDebounce()
              // 判断是否为好友
              friend = this.props.list[data.data.sender]
              if (friend) {
                // 更新列表数据
                friend = {...friend}
                friend.content = data.data.content
                if (friend.count === undefined) friend.count = 0
                friend.count += 1
                friend.sendTime = data.data.sendTime
                let newData = {}
                newData[friend.friendId] = friend
                this.props.setChatList(newData)
                let newList = this.props.chatList[data.data.sender] || []
                newList.push(data.data)
                let obj = {}
                obj[data.data.sender] = newList
                this.props.setChatListDetail(obj)
              } else { // 陌生人
  
              }
              break
            // 消息已阅读
            case 10028:
              if (this.props.chatList[data.data.receiver]) {
                let newList = [...this.props.chatList[data.data.receiver]]
                newList.some(item => {
                  if (item.id === data.data.id) {
                    item = Object.assign(item, data.data)
                    return true
                  }
                })
                this.props.setChatListDetail(newList)
              }
              if (this.props.list[data.data.sender]) { //对方发送的已读
                let tempId = data.data.sender
                let newObj = { ...this.props.list[tempId] }
                newObj.count -= 1
                let count = {}
                count[tempId] = newObj
                this.props.setChatList(count)
              }
              break
            // 发送新消息返回 发送方为自己
            case 10024:
              friend = this.props.list[data.data.receiver]
              if (friend) {
                friend = {...friend}
                friend.content = data.data.content
                friend.sendTime = data.data.sendTime
                friend.type = data.data.type
                let newData = {}
                newData[friend.friendId] = friend
                this.props.setChatList(newData)
              }
              break
            //获取系统消息
            case 10052:
            case 10062:
              let sys = {}
              data.data.reverse().forEach(msg => {
                sys[msg.id] = msg
              })
              if (data.code === 10052) {
                this.props.setSystemMsg(sys)
              } else {
                this.props.setExpertMsg(sys)
              }
              break;
              // 系统/专家 消息新增一条未读
            case 10053:
            case 10063:
              this.playAudioDebounce()
              let isSystem = data.code === 10053
              let newMsg = isSystem ? {...this.props.common.systemMsg} : {...this.props.common.expertMsg}
              newMsg[data.data.id] = data.data
              let newUser = {...this.props.user}
              if (isSystem) {
                this.props.setSystemMsg(newMsg)
                newUser.systemCount += 1
              } else {
                this.props.setExpertMsg(newMsg)
                newUser.recommendCount += 1
              }
              this.props.setUser(newUser)
              break
            case 10013:
              if (data.data.id === this.selfId) {
                if (data.data.music === 1) {
                  msgFunc('设置开启声音提醒成功', 'success')
                } else if (data.data.music === 0) {
                  msgFunc('设置关闭声音提醒成功', 'success')
                } else {
                  msgFunc('设置个人资料成功', 'success')
                  let newObj = {...this.props.user}
                  if (data.data.imageId) newObj.imageId = data.data.imageId
                  if (data.data.nickName) newObj.nickName = data.data.nickName
                  this.props.setUser(newObj)
                }
              }
              // 好友上下线
              else if (data.data.friendId && this.props.list[data.data.friendId]) {
                let newObj = {...this.props.list[data.data.friendId]}
                newObj.isOnline = data.data.state === 1 ? true : false
                let temp = {}
                temp[data.data.friendId] = newObj
                this.props.setChatList(temp)
              }
              // 好友修改头像
              else if (data.data.imageId !== undefined) {
                if (this.props.list[data.data.id]) {
                  let newObj = {...this.props.list[data.data.id]}
                  newObj.imageId = data.data.imageId
                  let tempObj = {}
                  tempObj[data.data.id] = newObj
                  this.props.setChatList(tempObj)
                }
              }
              break
            // 对方删除消息
            case 10031:
              if (this.props.chatList[data.data.friendId]) {
                let newList = {}
                if (data.data.msgIds.length) {
                  newList[data.data.friendId] = this.props.chatList[data.data.friendId].filter(item => !data.data.msgIds.includes(item.id))
                } else {
                  newList[data.data.friendId] = []
                }
                this.props.setChatListDetail(newList)
              }
              break
            default: return ''
          }
        },
        open: () => {
          // 登录
          this.socket.send(socketParams({code: 10001}))
          // 获取好友列表 判断 content 判断是否存在聊天记录
          this.socket.send(socketParams({code: 10011}))
          // 获取自己的群发历史
          this.socket.send(socketParams({code: 10041}))
          // 获取系统消息列表
          this.socket.send(socketParams({code: 10051}))
          // 获取专家推荐列表
          this.socket.send(socketParams({code: 10061}))
        },
        close: () => {
          notifyFunc({
            title: '错误通知',
            message: '聊天连接已断开，请重新连接'
          })
        }
      }, true)
      this.props.setSocket({socket: this.socket})
      this.handleHeartbeat()
    }

    playAudio = () => {
      let info = JSON.parse(this.props.user.setInfo || JSON.stringify({music: 0}))
      if (info.music) {
        let audioEl = document.querySelector('#audio')
        if (audioEl) audioEl.play()
      }
    }
    
    render() { 
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

}
 
export default SocketListener;