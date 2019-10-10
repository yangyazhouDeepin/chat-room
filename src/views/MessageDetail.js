import React, {Component} from 'react'
import '@/assets/scss/messagedetail.scss'

class MessageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() { 
    return (
      <div className="message-detail">
        <div className="message-detail-header">
          <h3>法国篮球甲级联赛 沙隆兰斯vs巴奥夫斯</h3>
          <span className="time">2019-9-16 19:02:13</span>
        </div>
        <div className="msg-detail" dangerouslySetInnerHTML={{__html: '测试专用'}}>

        </div>
      </div>
    );
  }
}
 
export default MessageDetail;