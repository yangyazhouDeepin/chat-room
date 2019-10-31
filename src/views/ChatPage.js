import React, { Component } from 'react'
import { withRouter, Route } from 'react-router-dom'
import MessageItem from '@/components/MessageItem'
import { Input, Layout } from 'antd'
import ChatDetail from '@/views/ChatDetail'
import MassDetail from '@/views/MassDetail'
import MassHistory from '@/views/MassHistory'
import util from '@/util/util'
const {Sider, Content} = Layout
const { Search } = Input

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: new Array(20).fill(1),
      activeUser: '',
      activeMassHis: false
    }
    util.bindMethod(this, ['handleSelected', 'handleMass', 'handleMassMessage'])
  }
  render() { 
    return (
      <Layout className="sub-layout">
        <Sider
          theme="light"
          className="sub-nav"
        >
          <div className="main">
            <div className="wrap">
              <Search />
              <div className="mass-message m-b-10" onClick={this.handleMassMessage}>
                群发消息
              </div>
            </div>
            <div className="user-list">
              <div className="mass-message-history">
                <MessageItem isMass={true} path="/chat/masshistory" />
              </div>
              {this.getUsers()}
            </div>
          </div>
        </Sider>
        <Content>
          <Route path={`/chat/detail/:userId`}>
            <ChatDetail key={this.props.location.pathname} />
          </Route>
          <Route exact path="/chat/mass">
            <MassDetail />
          </Route>
          <Route path="/chat/masshistory">
            <MassHistory />
          </Route>
        </Content>
      </Layout>
    );
  }

  componentDidMount() {
    if (this.props.location.pathname) {
      let userID = this.props.location.pathname.split('/chat/')[1]
      this.setState({
        activeUser: Number(userID)
      })
    }
  }

  getUsers() {
    return this.state.users.map((item, idx) => <MessageItem path={'/chat/detail/' + idx} key={idx}  />)
  }

  handleMassMessage() {
    this.props.history.push('/chat/mass')
    this.setState({
      activeMassHis: false,
      activeUser: ''
    })
  }

  // 点击群发历史时触发
  handleMass() {
    this.props.history.push('/chat/masshistory')
    this.setState({
      activeUser: '',
      activeMassHis: true
    })
  }

  handleSelected(idx) {
    let path = {
      pathname: '/chat/detail/' + idx,
      state: idx
    }
    this.props.history.push(path)
    this.setState({
      activeUser: idx,
      activeMassHis: false
    })
  }
}
 
export default withRouter(ChatPage);