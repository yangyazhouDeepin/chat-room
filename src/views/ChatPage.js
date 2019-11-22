import React, { Component } from 'react'
import { withRouter, Route } from 'react-router-dom'
import MessageItem from '@/components/MessageItem'
import { Input, Layout } from 'antd'
import ChatDetail from '@/views/ChatDetail'
import MassDetail from '@/views/MassDetail'
import MassHistory from '@/views/MassHistory'
import util from '@/util/util'
import { compose } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

const {Sider, Content} = Layout
const { Search } = Input

class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: '',
      activeMassHis: false,
      searchText: '',
      filterText: ''
    }
    util.bindMethod(this, ['handleSelected', 'handleMass', 'handleMassMessage'])
    this.searchChange = _.debounce(this.filterList, 200)
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
    let msgList = []
    for (let key in this.props.list) {
      msgList.push(this.props.list[key])
    }
    if (this.props.user.userType !== 0) {
      msgList = this.props.massList.concat(msgList).filter(item => item.content)
    }
    msgList.sort((pre, next) => Number(next.sendTime || next.createDate) - Number(pre.sendTime || pre.createDate))
    return msgList.map(chat => {
      let name = chat.descName || chat.platAccount || ''
      if (this.state.searchText !== '' && this.state.filterText !== '') {
        if (name.indexOf(this.state.filterText) === -1) {
          return null
        }
      }
      return <MessageItem user={this.props.user} path={chat.createDate ? '/chat/masshistory/' + chat.id : '/chat/detail/' + chat.friendId} key={chat.friendId || chat.id || chat.tempId} chat={chat} />
    })
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

  handleSearchChange = (e) => {
    this.setState({
      searchText: e.target.value
    })
    this.searchChange(e.target.value)
  }

  filterList = (text) => {
    this.setState({
      filterText: text
    })
  }

  render() { 
    return (
      <Layout className="sub-layout">
        <Sider
          theme="light"
          className="sub-nav"
        >
          <div className="main">
            {
              this.props.user.userType === 0 
                ? null 
                : <div className="wrap">
                    <Search value={this.state.searchText} onChange={this.handleSearchChange} />
                    <div className="mass-message m-b-10" onClick={this.handleMassMessage}>
                      群发消息
                    </div>
                  </div>
            }
            
            <div className="user-list">
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
          <Route path="/chat/masshistory/:id">
            <MassHistory />
          </Route>
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.chatList.list,
    massList: state.chatList.massList,
    user: state.user
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(ChatPage)