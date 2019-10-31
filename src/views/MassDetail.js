import React, {Component} from 'react'
import '@/assets/scss/massdetail.scss'
import util from '@/util/util'

import {Select, Input} from 'antd'
const {Option} = Select
const {TextArea} = Input

class MassDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
    util.bindMethod(this, ['handleChange'])
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
          <TextArea rows={10} placeholder="消息内容："></TextArea>
          <div className="warn">收件用户无法查看您任何私人信息，请放心发送</div>
        </div>
        <div className="bottom">
          <span className="self-btn cancel m-r-10">取消</span>
          <span className="self-btn">确定</span>
        </div>
      </div>
    );
  }

  getItems() {
    return ['Simon', 'Scott', 'Jude', 'Rose', 'test1', 'test2', 'test3', 'test4', 'test5'].map((item, idx) => {
      return (
        <Option key={idx} value={item}>
          {item}
        </Option>
      )
    })
  }

  handleChange(items) {
    this.setState({
      users: items
    })
  }
}
 
export default MassDetail;