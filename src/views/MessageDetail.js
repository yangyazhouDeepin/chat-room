import React, {Component} from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import socketParams from '../util/socketParams'
import actions from '../store/actions'
import '@/assets/scss/messagedetail.scss'

class MessageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.isSystem = this.props.match.path.indexOf('/message/') !== -1
    this.id = this.props.match.params.id
    let temp = (this.isSystem ? this.props.systemMsg[this.id] : this.props.expertMsg[this.id]) || {}
    if (temp.readStat === 0) {
      this.readNewMsg(temp)
    }
  }

  componentWillReceiveProps(nextProps) {
    let pre = (this.isSystem ? this.props.systemMsg[this.id] : this.props.expertMsg[this.id]) || {}
    let next = (this.isSystem ? nextProps.systemMsg[this.id] : nextProps.expertMsg[this.id]) || {}
    if (pre.readStat === 0 || next.readStat === 0) {
      this.readNewMsg(next)
    }
  }

  readNewMsg = (msg) => {
    let code = this.isSystem ? 10055 : 10065
    this.props.socket.subSend(socketParams({code: code, data: {
      groupMsgId: this.id,
      state: 1
    }}))
    let obj = {}
    obj[this.id] = {...msg}
    obj[this.id].readStat = 1
    let newUser = {...this.props.user}
    if (this.isSystem) {
      this.props.setSystemMsg(obj)
      newUser.systemCount -= 1
    } else {
      this.props.setExpertMsg(obj)
      newUser.recommendCount -= 1
    }
    this.props.setUser(newUser)
  }

  render() {
    let msg = (this.isSystem ? this.props.systemMsg[this.id] : this.props.expertMsg[this.id]) || {}
    return (
      <div className="message-detail">
        <div className="message-detail-header">
          <h3>{msg.title}</h3>
          <span className="time">2019-9-16 19:02:13</span>
        </div>
        <div className="msg-detail" dangerouslySetInnerHTML={{__html: msg.content}}></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMsg: state.common.systemMsg,
    expertMsg: state.common.expertMsg,
    socket: state.common.socket,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSystemMsg: data => dispatch(actions.setSystemMsg(data)),
    setExpertMsg: data => dispatch(actions.setExpertMsg(data)),
    setUser: data => dispatch(actions.setUser(data))
  }
}
 
export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MessageDetail);