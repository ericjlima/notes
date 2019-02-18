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

axios.defaults.withCredentials = true;

class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      activeMenu: '',
      notex2x: '',
      notes: [],
      dates: [], //need to implelment still
      baseURL: "http://el89.us:3009", //http://el89.us:3009
    }
  }

  componentDidMount(){
    fetch(`${this.state.baseURL}/api/notes`)
    .then(res => res.json())
    .then(notes => this.setState({ notes }));

    //TODO: get the below code to function more as a list. Think about doing a fetch instead of a get.
    axios.get(`${this.state.baseURL}/api/notes/a`)
    .then((response) => {
      console.log(response.data.date_modified);
      let strippedDateCreated = response.data.date_created.replace(/T/g,' ').replace(/Z/g,'');
      strippedDateCreated = strippedDateCreated.substring(0, strippedDateCreated.indexOf('.'));
      let strippedDateModified = response.data.date_modified.replace(/T/g,' ').replace(/Z/g,'');
      strippedDateModified = strippedDateModified.substring(0, strippedDateModified.indexOf('.'));

      this.setState({
        // apiResponse: JSON.response, //need this?
        // singleNoteData: response.data.name, //need this?
        dateModified: strippedDateModified, 
        dateCreated: strippedDateCreated,
        value: unescape(response.data.message),
        privateMode: response.data.private,
        //message: response.data.message
      }
      , function(){
        if(response.data.private){
          this.setState({message: "", privateText: "Private On"});
        } else if(!response.data.private){
          this.setState({message: response.data.message, privateText: "Private Off"});
        }
        // console.log("privserver: "+response.data.private);
        // console.log("priv: "+this.state.privateMode);
      }
      );
      
    })
    .catch(function(error){
      console.log(error)
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
