import React, {Component} from 'react'
import '@/assets/scss/setwarn.scss'
import {Checkbox} from 'antd'

class SetWarn extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
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
                <Checkbox defaultChecked={true} /> 开启声音提示
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
            <span className="self-btn cancel">取消</span>
            <span className="self-btn">确定</span>
          </div>
        </div>
      </div>
    );
  }
}
 
export default SetWarn;