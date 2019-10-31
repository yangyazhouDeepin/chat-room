import React, {Component} from 'react'
import '@/assets/scss/masshistory.scss'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

class MassHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  render() { 
    return (
      <div className="mass-history">
        <div className="mass-history-header">
          群发历史
          <span className="time">2019-9-10 19:02:13</span>
        </div>
        <div className="mass-history-main">
          <div className="container">
            <div className="recipients">
              <p className="m-b-10">8名收件人：</p>
              <div className="recipient-list">
                <div className="recipient-box">
                  <span className="recipient-item">ittest093</span>
                  <span className="recipient-item">ittest093</span>
                  <span className="recipient-item">ittest093</span>
                  <span className="recipient-item">ittest093</span>
                  <span className="recipient-item">ittest093</span>
                </div>
                <span className="more link" onClick={() => this.setState({visible: true})}>更多</span>
              </div>
            </div>

            <div className="mass-text">
              <p className="m-b-10">群发内容：</p>
              <div className="text">
                我将彩票返点提高为。。。<br/>
                将三方返水提高为。。。<br/><br/>
                有疑问可直接私聊
              </div>
              <div className="self-btn m-auto" onClick={() => this.props.history.push('/chat/mass')}>再发一条</div>
            </div>

          </div>
        </div>
        <div className="mass-history-footer">
          <p className="m-b-10">已读人员：</p>
          <div className="recipient-list">
            <div className="recipient-box">
              <span className="recipient-item">ittest093</span>
              <span className="recipient-item">ittest093</span>
              <span className="recipient-item">ittest093</span>
            </div>
            <span className="more link" onClick={() => this.setState({visible: true})}>更多</span>
          </div>
        </div>

        <Modal
          visible={this.state.visible}
          onCancel={() => this.setState({visible: false})}
          footer={null}
          width="310px"
          wrapClassName="mass-history-modal"
          centered={true}
        >
          <div className="modal-more">
            <div className="title">
              <h3>全部已读</h3>
            </div>
            <div className="container">
              <div className="item">ittest01</div>
              <div className="item">ittest01</div>
              <div className="item">ittest01</div> 
              <div className="item">ittest01</div>
              <div className="item">ittest01</div>
              <div className="item">ittest01</div>
              <div className="item">ittest01</div>
              <div className="item">ittest01</div>
              <div className="item">ittest01</div>
              <div className="item">ittest01</div>
            </div>
          </div>
        </Modal>

      </div>
    );
  }
}
 
export default withRouter(MassHistory);