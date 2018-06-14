import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink
} from 'react-router-dom';


import Notes from './components/notes';
import Login from './components/login';

import './App.css';


class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      activeMenu: '',
      notex2x: '',
      notes: [],
      baseURL: "http://el89.us:3009",
    }
  }

  componentDidMount(){
    fetch(`${this.state.baseURL}/api/notes`)
    .then(res => res.json())
    .then(notes => this.setState({ notes }));
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

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

  render() {
    const NotesPage = (props) => {
      return (
        <Notes
          notex2x={this.state.notex2x}
          baseURL={this.state.baseURL}
          {...props}
        />
      );
    };

    const LoginPage = (props) => {
      return (
        <Login
          notex2x={this.state.notex2x}
          baseURL={this.state.baseURL}
          {...props}
        />
      );
    };

    return (
      <div id="layout" className={`${this.state.activeMenu}`}>
        <div id="main">
          <div className="header">
            <h1>Notes</h1>
            <h2>A web based tool that I use to write notes! :-)</h2>
            <p>Welcome to my notes app! Type www.el89.us/v/[something] to visit a notes page.</p>
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
                      Eric's Notes
                    </NavLink>
                    <ul className="pure-menu-list">
                      {this.state.notes.map(note =>
                       <li className="pure-menu-item" key={note.id}>
                         <a
                          className="pure-menu-link" href={`/v/${note.name}`}>{this.toTitleCase(note.name)}</a>
                       </li>
                  )}
                    </ul>
                  </div>
                </div>
                <Switch>
                  <Route path={"/v/:id"} component={NotesPage} />
                  <Route path={"/login"} component={LoginPage} />
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
