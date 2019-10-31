// 通讯录
import React, {Component} from 'react'
import {withRouter, Route} from 'react-router-dom'
import User from '@/components/User'
import ChatDetail from '@/views/ChatDetail'
import {Input, Layout} from 'antd'
import util from '@/util/util'
const {Sider, Content} = Layout
const {Search} = Input


class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: new Array(20).fill(1),
      activeUser: ''
    }
    util.bindMethod(this, ['handleSelected'])
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
          <Route path={`/book/:userId`}>
            <ChatDetail />
          </Route>
        </Content>
      </Layout>
    );
  }

  componentDidMount() {
    if (this.props.location.pathname) {
      let userID = this.props.location.pathname.split('/book/')[1]
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
      pathname: '/book/' + idx,
      state: idx
    }
    this.props.history.push(path)
    this.setState({
      activeUser: idx
    })
  }
}
 
export default withRouter(Book);