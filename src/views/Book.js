// 通讯录
import React, {Component} from 'react'
import {withRouter, Route} from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import User from '@/components/User'
import ChatDetail from '@/views/ChatDetail'
import {Input, Layout} from 'antd'
import _ from 'lodash'
const {Sider, Content} = Layout
const {Search} = Input


class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      filterText: ''
    }
    this.searchChange = _.debounce(this.filterList, 200)
  }

  getUsers() {
    let arr = []
    for(let fid in this.props.list) {
      let user = this.props.list[fid]
      let name = user.descName || user.platAccount || ''
      if (this.state.searchText !== '' && this.state.filterText !== '') {
        if (name.indexOf(this.state.filterText) === -1) {
          continue
        }
      }
      if (user.userType === 0) continue
      arr.push(<User key={fid} user={this.props.list[fid]} />)
    }
    return arr
  }

  handleChange = (e) => {
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
            <div className="wrap m-b-10">
              <Search value={this.state.searchText} onChange={this.handleChange} />
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
}

const mapStateToProps = (state) => {
  return {
    list: state.chatList.list
  }
}
 
export default compose(
  withRouter,
  connect(mapStateToProps)
)(Book);