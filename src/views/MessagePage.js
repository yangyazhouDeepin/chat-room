import React, {Component} from 'react'
import '@/assets/scss/messagepage.scss'
import MessageDetail from '@/views/MessageDetail'

import {withRouter, Route, NavLink} from 'react-router-dom'
import {Layout} from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
const {Sider, Content} = Layout

class MessagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getMessages() {
    let isSystem = this.props.match.path === '/message'
    let temp = isSystem ? this.props.systemMsg : this.props.expertMsg
    let arr = []
    for(let msgId in temp) {
      arr.push(temp[msgId])
    }
    arr.sort((pre, next) => Number(next.createDate) - Number(pre.createDate))
    arr = arr.map(msg => (
      <NavLink key={msg.id} to={`${isSystem ? '/message/' : '/expert/'}${msg.id}`} className={`message-item ${msg.readStat === 0 ? 'unread' : ''}`}>
        <h3 className="title">{msg.title}</h3>
        <span className="time">{dayjs(Number(msg.createDate)).format('YYYY-MM-DD HH:mm:ss')}</span>
      </NavLink>
    ))
    return arr.length ? arr : null
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
            <MessageDetail key={this.props.location.pathname} />
          </Route>
          <Route path={`/expert/:id`}>
            <MessageDetail key={this.props.location.pathname} />
          </Route>
        </Content>
      </Layout>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    systemMsg: state.common.systemMsg,
    expertMsg: state.common.expertMsg
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(MessagePage);