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
import axios from 'axios';
import './App.css';
var sha256 = require('sha256');

axios.defaults.withCredentials = true;

class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      activeMenu: '',
      notex2x: '',
      notes: [],
      dates: [], //need to implelment still
      baseURL: "", //http://el89.us:3009  //or empty quote
      passwordShown: true,
      passEntered: false,
      pass: "",
    }
  }

  componentDidMount(){
    fetch(`${this.state.baseURL}/api/notes`)
    .then(res => res.json())
    .then(notes => this.setState({ notes }));


      axios.get(`${this.state.baseURL}/api/password/${this.state.pass}`).then((response) => {
      if(response.data.logged){
          this.setState({ passEntered: true, passwordShown: false, checkPass: response.data.password, checkSessionID: response.data.sessionID});
        }
        }).catch(function (error) {
        return JSON.stringify(error);
      });

  }
    
    
  handlePassEnter(e){
    this.setState({
      pass: e.target.value
    });
  }

  handleSubmitPass(e) {
    axios.post(`${this.state.baseURL}/api/password`, {password: sha256(this.state.pass)}).then((response) => {
             if(response.data==="logged"){
                  this.setState({ passEntered: true });
                  this.setState({
                    message: this.state.value,
                    passwordShown: false,
                  });
             } else {
                  this.setState({
                     incorrectPassword: "You've entered an incorrect password.",
                     message: this.state.value
                });
                setTimeout(()=>{
                  this.setState({
                    incorrectPassword: "",
                    verificationMessage: ""
                  });
                },2000)

             }
        }).catch(function (error) {
        return JSON.stringify(error);
    });
      e.preventDefault();
  }
    
    handleLogout(){
        axios.post(`${this.state.baseURL}/api/password/logout`).then((response) => {
            window.location.reload();
             
        }).catch(function (error) {
        return JSON.stringify(error);
    });
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
      
    var passwordShown = {
      display: this.state.passwordShown ? "block" : "none"
    };
      
    var hidden = {
      display: this.state.passwordShown ? "none" : "block"
    }
      
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
                        
                        
                        <form style={ passwordShown } method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmitPass.bind(this)}>
          <fieldset className="quickLog">
            <div className="pure-control-group">
              <div className='pure-control-group'>
                <input onChange={this.handlePassEnter.bind(this)} id="quickpassenter" type="password" value={this.state.pass} placeholder="Quick Login"/>
                  <p className="verificationMessage"> {this.state.incorrectPassword} </p>
              </div>
            </div>
          </fieldset>
        </form><button style={ hidden } className="pure-button quickLog pure-button-primary logout-button" onClick={this.handleLogout.bind(this)}>Logout</button>
                        
                        
                        
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
