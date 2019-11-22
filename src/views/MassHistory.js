import React, {Component} from 'react'
import '@/assets/scss/masshistory.scss'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import dayjs from 'dayjs'
import { compose } from 'redux'
import { connect } from 'react-redux'

class MassHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  getHistory = () => {
    let massId = this.props.match.params.id
    return this.props.massList.filter(mass => (mass.id === massId || mass.tempId === massId))[0] || null
  }

  getNameById = (fid) => {
    let obj = this.props.list[fid] || {}
    return obj.descName || obj.platAccount
  }

  sendAgain = () => {
    this.props.history.push({
      pathname: '/chat/mass',
      state: {
        ids: (this.getHistory() || {}).sendUserIds || []
      }
    })
  }

  render() {
    const chat = this.getHistory()
    const reads = chat ? chat.readUserIds.map(rid => {
      let name = this.getNameById(rid)
      return <div key={rid} className="recipient-item item">{name}</div>
    }) : []
    return (
      <div className="mass-history">
        <div className="mass-history-header">
          群发历史
          <span className="time">{chat && dayjs(Number(chat.createDate)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
        <div className="mass-history-main">
          <div className="container">
            <div className="recipients">
              <p className="m-b-10">{chat && chat.sendUserIds.length}名收件人：</p>
              <div className="recipient-list">
                <div className="recipient-box">
                  {chat && chat.sendUserIds.slice(0, 4).map(item => {
                    let name = this.getNameById(item)
                    return <span key={item} className="recipient-item">{name}</span>}
                  )}
                </div>
                {
                  chat && chat.sendUserIds.length > 4 ? <span className="more link" onClick={() => this.setState({visible: true})}>更多</span> : null
                }
                
              </div>
            </div>

            <div className="mass-text">
              <p className="m-b-10">群发内容：</p>
              <div className="text" dangerouslySetInnerHTML={{__html: chat ? chat.content : ''}}></div>
              <div className="self-btn m-auto" onClick={this.sendAgain}>再发一条</div>
            </div>

          </div>
        </div>
        <div className="mass-history-footer">
          <p className="m-b-10">已读人员：</p>
          <div className="recipient-list">
            <div className="recipient-box">
              {reads.slice(0, 2)}
            </div>
            {reads.length > 2 ? <span className="more link" onClick={() => this.setState({visible: true})}>更多</span> : null}
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
              {reads}
            </div>
          </div>
        </Modal>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    massList: state.chatList.massList,
    list: state.chatList.list
  }
}
 
export default compose(
  withRouter,
  connect(mapStateToProps)
)(MassHistory);