import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import '@/assets/scss/setpage.scss'
import SetWarn from '@/views/SetWarn'
import SetUser from '@/views/SetUser'

import {Layout} from 'antd'
const {Sider, Content} = Layout

class SetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navIndex: 0
    }
    this.selectdNav = this.selectdNav.bind(this)
  }
  render() {
    return (
      <Layout className="sub-layout">
        <Sider
          theme="light"
          className="sub-nav"
        >
          <div className="set-page">
            <div className="user-detail">
              <span className="logo self"></span>
              <div className="detail">
                <p className="name">一介草民9077</p>
                <span>账号:lichen1232</span>
              </div>
            </div>
            <div className="set-navs">
              <div className={`set-nav warn ${this.state.navIndex === 0 ? 'active' : ''}`} onClick={() => this.selectdNav(0)}>提醒设置</div>
              <div className={`set-nav edit ${this.state.navIndex === 1 ? 'active' : ''}`} onClick={() => this.selectdNav(1)}>更改资料</div>
            </div>
          </div>
        </Sider>
        <Content>
          {this.getComp()}
        </Content>
      </Layout>
    );
  }

  selectdNav(idx) {
    if (this.state.navIndex !== idx) {
      this.setState({
        navIndex: idx
      })
    }
  }

  getComp() {
    if (this.state.navIndex) {
      return <SetUser />
    }
    return <SetWarn />
  }
}
 
export default withRouter(SetPage);