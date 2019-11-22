import React, { Component,  Fragment} from 'react'
import { Icon, Upload, message } from 'antd'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { connect } from 'react-redux'
import actions from '../store/actions'
import socketParams from '../util/socketParams'

class SendMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiActive: false,
      msg: '',
      emojiStyle: {
        position: 'absolute',
        right: 0,
        bottom: '44px'
      }
    }
  }

  showEmoji = () => {
    this.setState((preState) => ({
      emojiActive: !preState.emojiActive
    }))
  }

  handleMsgChange = (e) => {
    this.setState({
      msg: e.target.value,
    })
  }

  handleMsgEnter = (evt) => {
    if (evt.keyCode === 13) {
      this.sendMsg()
    }
  }

  sendMsg = () => {
    this.props.sendMsg(this.state.msg)
    this.setState({
      msg: ''
    })
  }

  selectEmoji = (emoji) => {
    this.setState((preState) => {
      let val = preState.msg + `[${emoji.unified}]`
      return {
        msg: val,
      }
    }, () => {
      this.textInput.focus()
    })
  }

  // 添加一个文件上传的消息
  addFileMsg = (params, file) => {
    params = this.props.changeText(params)
    let chatList = [...(this.props.chatList[this.props.fid] || [])]
    chatList.push(params)
    let obj = {}
    obj[this.props.fid] = chatList
    this.props.setChatListDetail(obj)
    this.props.scrollBottom()
  }

  uploadFile = (e) => {
    if (e.target.files.length) {
      let file = e.target.files[0]
      if (this.props.fileTypes.test(file.name)) {
        let tempId = new Date().getTime().toString()
        let params = {
          content: JSON.stringify({fileName: file.name}),
          recUserId: this.props.fid,
          type: 2,
          tempId: tempId,
          sendTime: tempId
        }
        this.addFileMsg(params, file)      
        if (!this.props.storageRef) this.initStorageRef()
        let metadata = {
          contentType: 'application/zip'
        }
        let uploadTask = (this.props.storageRef || this.storageRef).child('file/' + file.name).put(file, metadata)
        let that = this
        uploadTask.on(window.firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('upload is ' + progress + '% done')
        }, error => {
          switch (error.code) {
            case 'storage/unauthorized':
              return message.error('用户无权执行所需操作,无法上传')
            case 'storage/unknown':
              return message.error('未知错误')
            default: return null
          }
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            let content = JSON.parse(params.content)
            content.link = downloadURL
            params.content = JSON.stringify(content)
            that.props.socket.subSend(socketParams({code: 10023, data: params}))
          })
        })
      } else {
        message.warning('只能传递图片，办公文件，记事本及压缩文件')
      }
    }
  }

  initStorageRef = () => {
    window.firebase.initializeApp(this.props.uploadConfig)
    window.firebase.auth().signInWithEmailAndPassword(this.props.uploadConfig.emial, this.props.uploadConfig.password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
      })
    let storage = window.firebase.storage() 
    let storageRef = storage.ref()
    this.storageRef = storageRef
    this.props.setStorageRef(storageRef)
  }

  render() { 
    return (
      <Fragment>
        { 
          this.state.emojiActive
          ? <Picker set='google' emoji='point_up' style={this.state.emojiStyle} onSelect={(emoji, ev) => this.selectEmoji(emoji, ev)}/>
          : null
        }
        <div className="send-msg">
          <span className="upload-file">
            <Icon type="plus-circle" />
            <input type="file" onChange={this.uploadFile} />
          </span>
          <input type="text" onKeyUp={this.handleMsgEnter} ref={(el) => this.textInput = el} onChange={this.handleMsgChange} value={this.state.msg} className="msg"/>
          <span className={`emoji ${this.state.emojiActive ? 'emoji-span-active' : ''}`} onClick={this.showEmoji}>
            <Icon type="smile" />
          </span>
          <span className="send" onClick={this.sendMsg}>发送</span>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  fileTypes: state.common.fileTypes,
  uploadConfig: state.common.uploadConfig,
  storegeRef: state.common.storegeRef,
  chatList: state.chatList.chatList,
  socket: state.common.socket
})

const mapDispatchToProps = dispatch => ({
  setStorageRef: data => dispatch(actions.setStorageRef(data)),
  setChatListDetail: data => dispatch(actions.setChatListDetail(data))
})
 
export default connect(mapStateToProps, mapDispatchToProps)(SendMsg);