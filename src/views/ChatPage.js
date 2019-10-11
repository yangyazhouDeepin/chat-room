import React, { Component } from 'react'
import {withRouter, Route} from 'react-router-dom'
import User from '@/components/User'
import { Input, Layout } from 'antd'
import ChatDetail from '@/views/ChatDetail'
const {Sider, Content} = Layout
const { Search } = Input

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: new Array(20).fill(1),
      activeUser: ''
    }
    this.handleSelected = this.handleSelected.bind(this)
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
            </div>
            <div className="user-list">
              {this.getUsers()}
            </div>
          </div>
        </Sider>
        <Content>
          <Route path={`/chat/:userId`}>
            <ChatDetail key={this.props.location.pathname} />
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
    return this.state.users.map((item, idx) => <User idx={idx} activeUser={this.state.activeUser === idx ? 'active' : ''} handleSelected={this.handleSelected} key={idx} />)
  }

  handleSelected(idx) {
    let path = {
      pathname: '/chat/' + idx,
      state: idx
    }
    this.props.history.push(path)
    this.setState({
      activeUser: idx
    })
  }
}
 
export default withRouter(ChatPage);