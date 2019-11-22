import React, { Component } from 'react';
import { Provider } from 'react-redux'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd'
import Nav from './components/Nav'
import ChatPage from '@/views/ChatPage'
import Book from '@/views/Book'
import MessagePage from '@/views/MessagePage'
import SetPage from '@/views/SetPage'

import store from './store'

const { Sider, Content } = Layout
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
  }

  componentWillMount() {
    // 禁止浏览器的右键事件
    window.oncontextmenu = function(ev) {
      ev.preventDefault()
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={this.props.history}>
          <Layout className="layout">
            <Sider theme="light" className="layout-sider">
              <Nav
                navList={this.state.navList}
              />
            </Sider>
            <Content>
              
              <Switch>
                <Route path="/chat">
                  <ChatPage />
                </Route>
                <Route path="/book">
                  <Book />
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
                {/* <Redirect to="/chat" /> */}
              </Switch>
            </Content>
          </Layout>
        </Router>
      </Provider>
    )
  }

}

export default App;
