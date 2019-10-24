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
import QuickLogin from './components/quickLogin';
import axios from 'axios';
import './App.css';

axios.defaults.withCredentials = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: '',
      notex2x: '',
      notes: [],
      dates: [], //need to implelment still
      baseURL: "", //http://ericnote.us:3009  //or empty quote
      passwordShown: true,
      passEntered: false,
      pass: "",
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
                        
                      <QuickLogin baseURL={this.state.baseURL} />
                                          
                      <li className="pure-menu-item" key="0">
                         <a
                          className="pure-menu-link" href={`/login`}>Login</a>
                       </li>
                       {/* {console.log(this.state.notes)} */}
                      {this.state.notes.map((note,index) =>
                       <li className="pure-menu-item" key={index}>
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
