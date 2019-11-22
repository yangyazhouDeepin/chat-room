import React, {Component} from 'react'
import '@/assets/scss/massdetail.scss'
import util from '@/util/util'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import socketParams from '../util/socketParams'
import {Select, Input, message} from 'antd'
import inject_unmount from '../util/inject_unmount'
import actions from '../store/actions'
const {Option} = Select
const {TextArea} = Input

@inject_unmount
class MassDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      text: ''
    }
    util.bindMethod(this, ['handleChange'])
  }

  componentWillMount() {
    if (this.props.location.state && this.props.location.state.ids) {
      this.setState({
        users: this.props.location.state.ids
      })
    }
    this.props.socket.subscriber.add('mass', (data) => {
      if (data.code === 10044) {
        this.setState({
          users: [],
          text: ''
        })
        message.success('发送成功')
      }
    })
  }
  
  getItems() {
    let items = []
    for (let fid in this.props.list) {
      items.push((
        <Option key={fid} value={fid}>
          {this.props.list[fid].descName || this.props.list[fid].platAccount}
        </Option>
      ))
    }
    return items
  }

  handleChange(items) {
    this.setState({
      users: items
    })
  }

  sendMassMsg = () => {
    if (!this.state.text.trim()) {
      return message.warning('请输入需要发送的内容')
    }
    if (!this.state.users.length) {
      return message.warning('请选择要发送的收件人')
    }
    let now = new Date().getTime()
    let data = {
      sendUserIds: this.state.users,
      readUserIds: [],
      content: this.state.text,
      type: 0,
      tempId: now.toString(),
      createDate: now
    }
    this.props.socket.subSend(socketParams({code: 10043, data}))
    let newMassList = [...this.props.massList]
    newMassList.push(data)
    this.props.setMassList(newMassList)
  }

  handleTextChange = (e) => {
    this.setState({
      text: e.target.value
    })
  } 

  render() {
    return (
      <div className="mass-detail">
        <div className="users">
          <span className="label">收件人：</span>
          <Select
            mode="multiple"
            placeholder="支持多名收件人"
            value={this.state.users}
            onChange={this.handleChange}
            style={{display: 'block', lineHeight: '38px'}}
          >
            {this.getItems()}
          </Select>
        </div>
        <div className="context">
          <TextArea value={this.state.text} onChange={this.handleTextChange} rows={10} placeholder="消息内容："></TextArea>
          <div className="warn">收件用户无法查看您任何私人信息，请放心发送</div>
        </div>
        <div className="bottom">
          <span className="self-btn" onClick={this.sendMassMsg}>确定</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.chatList.list,
    socket: state.common.socket,
    massList: state.chatList.massList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setMassList: (data) => dispatch(actions.setMassList(data))
  }
}
 
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MassDetail);