import React, { Component } from 'react'
import User from '@/components/User'
import { Input } from 'antd'
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
      <div className="main">
        <div className="wrap">
          <Search />
        </div>
        <div className="user-list">
          {this.getUsers()}
        </div>
      </div>
    );
  }

  getUsers() {
    return this.state.users.map((item, idx) => <User idx={idx} activeUser={this.state.activeUser === idx ? 'active' : ''} handleSelected={this.handleSelected} key={idx} />)
  }

  handleSelected(idx) {
    this.setState({
      activeUser: idx
    })
  }
}
 
export default ChatPage;