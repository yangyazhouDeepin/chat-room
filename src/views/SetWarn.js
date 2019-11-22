import React, {Component} from 'react'
import { connect } from 'react-redux'
import socketParams from '../util/socketParams'
import actions from '../store/actions'
import '@/assets/scss/setwarn.scss'
import {Checkbox} from 'antd'

class SetWarn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    }
  }

  handleChange = (e) => {
    this.setState({
      checked: e.target.checked
    })
  }

  componentDidMount() {
    if (this.props.user.setInfo) {
      this.setDefaultChecked(this.props.user.setInfo)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user.setInfo && nextProps.user.setInfo) {
      this.setDefaultChecked(nextProps.user.setInfo)
    }
  }

  setDefaultChecked = (info) => {
    info = JSON.parse(info)
    this.setState({
      checked: info.music === 1
    })
  }
  set = () => {
    this.props.socket.subSend(socketParams({code: 10013, data: {
      music: this.state.checked ? 1 : 0
    }}))
    let newUser = {...this.props.user}
    newUser.setInfo = JSON.stringify({music: this.state.checked ? 1 : 0})
    this.props.setUser(newUser)
  }

  render() { 
    return (
      <div className="set-warn">
        <div className="warn-container">
          <div className="warn-type warn-item">
            <div className="left r-2">
              提醒方式:
            </div>
            <div className="right">
              <div className="item disabled">
                <Checkbox defaultChecked={true} disabled /> 开启红点提示
              </div>
              <div className="item">
                <Checkbox checked={this.state.checked} onChange={this.handleChange} /> 开启声音提示
              </div>
            </div>
          </div>
          <div className="warn-item">
            <div className="left r-3">
              提醒类型:
            </div>
            <div className="right">
              <div className="item disabled">
                <Checkbox defaultChecked={true} disabled /> 开启系统通知提醒
              </div>
              <div className="item disabled">
                <Checkbox defaultChecked={true} disabled /> 开启专家推荐提醒
              </div>
              <div className="item disabled">
                <Checkbox defaultChecked={true} disabled /> 开启好友提醒
              </div>
            </div>
          </div>
          <div className="bottom">
            <span className="self-btn" onClick={this.set}>确定</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    socket: state.common.socket
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: data => dispatch(actions.setUser(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetWarn);