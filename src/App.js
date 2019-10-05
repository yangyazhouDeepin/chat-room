import React, { Component } from 'react';
import { Layout } from 'antd'
import Nav from './components/Nav'
import ChatPage from '@/views/ChatPage'
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
          comp: 'chat'
        },
        {
          title: '联系人',
          icon: 'icon-contacts',
          comp: 'contacts'
        },
        {
          title: '专家推荐',
          icon: 'icon-expert',
          comp: 'expert'
        },
        {
          title: '系统通知',
          icon: 'icon-message',
          comp: 'system-message'
        },
        {
          title: '设置',
          icon: 'icon-reset',
          comp: 'reset'
        }
      ]
    }
    this.handleChangeNavIndex = this.handleChangeNavIndex.bind(this)
  }
  render() {
    return (
      <Layout className="layout">
        <Sider theme="light" className="layout-sider">
          <Nav
            navList={this.state.navList}
            navIndex={this.state.navIndex}
            changeIndex={this.handleChangeNavIndex}
          />
        </Sider>
        <Content>
          <Layout className="sub-layout">
            <Sider
              theme="light"
              className="sub-nav"
            >
              {this.getComp()}
            </Sider>
            <Content>

            </Content>
          </Layout>
        </Content>
      </Layout>
    )
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
      default: return ''
    }
  }
}

export default App;
