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
      baseURL: "https://api.ericnote.us", //https://api.ericnote.us  //or empty quote
      notes: [],
      dates: [], //need to implelment still
      passwordShown: true,
      logged: false,
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

  generateBranchedRoutes(){
    const result = [];
    let stringRes = '/:id';

    for(let i = 1; i < 99 ; i++){
      stringRes = '/:id' + i + stringRes;
      result.unshift(<Route path={stringRes} key={i} render={(routeProps) => <Notes {...routeProps} baseURL={this.state.baseURL} key={window.location.pathname} />} />);
    }
    return result;
  }

  setLogged(val){
    this.setState({
      logged: val,
    });
  }

  render() {
    return (
      <div id="layout" className={`${this.state.activeMenu}`}>
        <div id="main">

          <div className="content">
            <Router>
              <div>
                <a href="#menu" id="menuLink" onClick={this.handleClick.bind(this)} className={`menu-link ${this.state.logged ? 'loggedIn' : ''}`}>
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
                      {this.state.notes.map((note,index) =>
                      <li className="pure-menu-item" key={index}>
                        <a className="pure-menu-link" href={`/${note.name}`}>{this.toTitleCase(note.name)}</a>
                      </li>
                      )}
                    </ul>
                  </div>
                </div>
                <Switch>
                  <Route path={"/login"} render={(routeProps) => <Login {...routeProps} />} baseURL={this.state.baseURL} />
                  {this.generateBranchedRoutes()}
                  <Route path={"/:id"}  render={(routeProps) => <Notes {...routeProps} baseURL={this.state.baseURL} setLogged={this.setLogged.bind(this)} />} />
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
