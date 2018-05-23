import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink
} from 'react-router-dom';


import Notes from './components/notes';

import './App.css';


class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      activeMenu: '',
      notex2x: ''
    }
  }


  handleClick() {
    if(this.state.activeMenu === 'active') {
      this.setState({
        activeMenu: ''
      });
    } else {
      this.setState({
        activeMenu: 'active'
      });
    }
  }

  render() {
    const NotesPage = (props) => {
      return (
        <Notes
          notex2x={this.state.notex2x}
          {...props}
        />
      );
    };


    return (
      <div id="layout" className={`${this.state.activeMenu}`}>
        <div id="main">
          <div className="header">
            <h1>Notes</h1>
            <h2>A web based interface to write notes! :-)</h2>
            <p>Welcome to my notes app! Click on the left to create notes.</p>
          </div>
          <div className="content">
            <Router>
              <div>
                <a href="#menu" id="menuLink" onClick={this.handleClick.bind(this)} className={`menu-link`}>
                  <span></span>
                </a>

                <div id="menu">
                  <div className="pure-menu">
                    <NavLink
                      activeClassName="pure-menu-selected"
                      className="pure-menu-heading"
                      to="/">
                      Notex2x
                    </NavLink>
                    <ul className="pure-menu-list">
                      <li className="pure-menu-item">
                        <NavLink
                          activeClassName="pure-menu-selected"
                          className="pure-menu-link"
                          to="/notes/1">
                          Click me!
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
                <Switch>
                  <Route path={"/notes/:id"} component={NotesPage} />
                  <Redirect from='*' to='/' />
                </Switch>
              </div>
            </Router>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
