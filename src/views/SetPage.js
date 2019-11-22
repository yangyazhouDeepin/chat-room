import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
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
              <span className={`logo ${this.props.user.imageId ? 'icon-logo-' + this.props.user.imageId : 'default'}`}></span>
              <div className="detail">
                <p className="name">{this.props.user.nickName || this.props.user.platAccount}</p>
                <span>账号:{this.props.user.platAccount}</span>
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

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
 
export default compose(
  withRouter,
  connect(mapStateToProps)
)(SetPage);