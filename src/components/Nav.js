import React, { Component } from 'react'
import {withRouter, NavLink} from 'react-router-dom'

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
        <NavLink
          className={`nav-item ${nav.icon}`}
          key={nav.title}
          to={nav.link}
        >
          {nav.title}
        </NavLink>
      )
    })
  }

  change(idx, nav) {
    this.props.changeIndex(idx)
    this.props.history.push(nav.link)
  }
}
 
export default withRouter(Nav);