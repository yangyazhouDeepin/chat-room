import React, {Component} from 'react'
import '@/assets/scss/setuser.scss'
import QRCode from 'qrcode.react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {message} from 'antd'
import { connect } from 'react-redux'
import socketParams from '../util/socketParams'

class SetUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrUrl: '',
      imageIndex: '',
      descName: ''
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        qrUrl: 'http://www.baidu.com'
      })
    }, 1000)
    if (this.props.user.platAccount) {
      this.setUser(this.props.user)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user.platAccount) {
      this.setUser(nextProps)
    }
  }

  setUser(obj) {
    this.setState({
      imageIndex: obj.imageId,
      descName: obj.nickName
    })
  } 

  setImageIndex = (idx) => {
    this.setState({
      imageIndex: idx + 1
    })
  }

  changeNickName = (e) => {
    this.setState({
      descName: e.target.value
    })
  }

  set = () => {
    let imgChagne = this.props.user.imageId !== this.state.imageIndex
    let nickNameChange = this.props.user.nickName !== this.state.descName
    if (imgChagne || nickNameChange) {
      let params = {code: 10013, data: {}}
      if (imgChagne) params.data.imageId = this.state.imageIndex
      if (nickNameChange) params.data.nickName = this.state.descName
      this.props.socket.subSend(socketParams(params))
    }
  }

  render() {
    return (
      <div className="set-user">
        <div className="nickname">
          <span className="title">设置备注:</span>
          <input value={this.state.descName} onChange={this.changeNickName} type="text" placeholder="请输入昵称" />
        </div>
        <div className="set-img">
          <span className="title">设置头像:</span>
          <div className="img-list clearfix">
            {
              new Array(27).fill(1).map((temp, idx) => <div key={idx} onClick={() => this.setImageIndex(idx)} className={`item fl icon-logo-${idx + 1} ${this.state.imageIndex === (idx + 1) ? 'active' : ''}`}></div>)
            }
          </div>
        </div>
        <div className="tg">
          <span className="title">推广方式:</span>
          <div className="box">
            <div className="qrcode">
              <QRCode size={64} value={this.state.qrUrl}/>
            </div>
            <div className="address">
              <p>
                http://192.168.169.75:8000/xy/index.html#/ssc/150?typeName=%E5%90%8E%E4%B8%89&navName=%E5%90%8E%E4%B8%89%E7%9B%B4%E9%80%89
              </p>
              <p className="t-c c-blue" onClick={this.copyUrl}>
                <CopyToClipboard text={this.state.qrUrl}
                  onCopy={() => message.success('复制成功')}
                >
                  <button>一键复制</button>
                </CopyToClipboard>
              </p>
            </div>
          </div>
        </div>
        <div className="bottom t-c">
          <span className="self-btn" onClick={this.set}>确定</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    socket: state.common.socket
  }
}

export default connect(mapStateToProps)(SetUser);