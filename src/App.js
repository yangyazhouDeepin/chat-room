import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import { Layout } from 'antd'
import Nav from './components/Nav'
import ChatPage from '@/views/ChatPage'
import MessagePage from '@/views/MessagePage'
import SetPage from '@/views/SetPage'

const { Sider, Content } = Layout
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navIndex: 0,
      navList: [
        {
          title: '聊天',
          icon: 'icon-chat',
          link: '/chat'
        },
        {
          title: '联系人',
          icon: 'icon-contacts',
          link: '/book'
        },
        {
          title: '专家推荐',
          icon: 'icon-expert',
          link: '/expert'
        },
        {
          title: '系统通知',
          icon: 'icon-message',
          link: '/message'
        },
        {
          title: '设置',
          icon: 'icon-reset',
          link: '/set'
        }
      ]
    }
    this.handleChangeNavIndex = this.handleChangeNavIndex.bind(this)
  }
  render() {
    return (
      <Router history={this.props.history}>
        <Layout className="layout">
          <Sider theme="light" className="layout-sider">
            <Nav
              navList={this.state.navList}
              navIndex={this.state.navIndex}
              changeIndex={this.handleChangeNavIndex}
            />
          </Sider>
          <Content>
            <Switch>
              <Route path="/chat">
                <ChatPage />
              </Route>
              <Route path="/book">
                <ChatPage />
              </Route>
              <Route path="/expert">
                <MessagePage />
              </Route>
              <Route path="/message">
                <MessagePage />
              </Route>
              <Route path="/set">
                <SetPage />
              </Route>
              <Redirect to="/chat" />
            </Switch>
          </Content>
        </Layout>
      </Router>
    )
  }

  componentDidMount() {
    window.oncontextmenu = function(ev) {
      ev.preventDefault()
    }
  }

  handleChangeNavIndex(idx) {
    this.setState({
      navIndex: idx
    })
  }

  getComp() {
    switch(this.state.navIndex) {
      case 0:
        return <ChatPage />
      case 1:
        return <ChatPage />
      case 2:
        return <MessagePage />
      case 3:
        return <MessagePage />
      case 4:
        return <SetPage />
      default: return ''
    }
  }
}

export default App;
