import React, {Component} from 'react'
import '@/assets/scss/setuser.scss'
import QRCode from 'qrcode.react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {message} from 'antd'

class SetUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrUrl: ''
    }
    this.copyUrl = this.copyUrl.bind(this)
  }
  render() {
    return (
      <div className="set-user">
        <div className="nickname">
          <span className="title">设置备注:</span>
          <input type="text" placeholder="请输入昵称" />
        </div>
        <div className="set-img">
          <span className="title">设置头像:</span>
          <div className="img-list">
            <div className="item active"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
            <div className="item"></div>
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
      </div>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        qrUrl: 'http://www.baidu.com'
      })
    }, 1000)
  }

  copyUrl() {
  }
}
 
export default SetUser;