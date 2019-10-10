import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

class Nav extends Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this)
  }
  render() { 
    return (
      <div className="navs">
        {this.getNavList()}
      </div>
    )
  }

  getNavList() {
    return this.props.navList.map((nav, idx) => {
      return (
        <div
          key={nav.title}
          onClick={e => this.change(idx, nav)}
          className={`nav-item ${nav.icon} ${ this.props.navIndex === idx ? "active" : '' }`}
        >
          {nav.title}
        </div>
      )
    })
  }

  change(idx, nav) {
    this.props.changeIndex(idx)
    this.props.history.push(nav.link)
  }
}
 
export default withRouter(Nav);