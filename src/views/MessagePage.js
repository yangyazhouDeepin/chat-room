import React, {Component} from 'react'
import '@/assets/scss/messagepage.scss'
import MessageDetail from '@/views/MessageDetail'

import {withRouter, Route} from 'react-router-dom'
import {Layout} from 'antd'
const {Sider, Content} = Layout

class MessagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [
        {
          id: 1,
          title: '法国篮球甲级联赛 沙隆兰斯vs巴奥夫斯',
          time: '11:15',
          status: 1 //1 已读  0未读
        },
        {
          id: 2,
          title: 'hello world',
          time: '11:19',
          status: 0 //1 已读  0未读
        },
        {
          id: 3,
          title: 'Simon King',
          time: '13:25',
          status: 2 //1 已读  0未读
        }
      ]
    }
    this.goMessageDetail = this.goMessageDetail.bind(this)
  }
  render() {
    return (
      <Layout className="sub-layout">
        <Sider
          theme="light"
          className="sub-nav"
        >
        <div className="main .message-page">
          <div className="message-list">
            {this.getMessages()}
          </div>
        </div>
        </Sider>
        <Content>
          <Route path={`/message/:id`}>
            <MessageDetail />
          </Route>
        </Content>
      </Layout>
    );
  }

  getMessages() {
    return this.state.msgList.map(msg => {
      return (
        <div key={msg.id} onClick={() => this.goMessageDetail(msg)} className={`message-item ${msg.status === 0 ? 'unread' : ''}`}>
          <h3 className="title">{msg.title}</h3>
          <span className="time">{msg.time}</span>
        </div>
      )
    })
  }

  goMessageDetail(msg) {
    let obj = {
      pathname: '/message/' + msg.id
    }
    this.props.history.push(obj)
  }
}

export default withRouter(MessagePage);