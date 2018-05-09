import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink
} from 'react-router-dom';

import Create from './components/create';
import Tx from './components/tx';
import Address from './components/address';
import Customers from './components/customers';
import User from './components/user';
import Block from './components/block';

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
    const CreatePage = (props) => {
      return (
        <Create
          notex2x={this.state.notex2x}
        />
      );
    };
    const TxPage = (props) => {
      return (
        <Tx
          notex2x={this.state.notex2x}
        />
      );
    };
    const AddressPage = (props) => {
      return (
        <Address
          notex2x={this.state.notex2x}
        />
      );
    };
    const CustomersPage = (props) => {
      return (
        <Customers
          notex2x={this.state.notex2x}
          {...props}
        />
      );
    };
    const UserPage = (props) => {
      return (
        <User
          notex2x={this.state.notex2x}
        />
      );
    };
    const BlockPage = (props) => {
      return (
        <Block
          notex2x={this.state.notex2x}
        />
      );
    };


    return (
      <div id="layout" className={`${this.state.activeMenu}`}>
        <div id="main">
          <div className="header">
            <h1>Notex2x</h1>
            <h2>A web based interface for my personal notes :-)</h2>
            <p>Welcome to Notex2x! I hope to get each of my note pages on the left.</p>
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
                          to="/create">
                          Create
                        </NavLink>
                      </li>
                      <li className="pure-menu-item">
                        <NavLink
                          activeClassName="pure-menu-selected"
                          className="pure-menu-link"
                          to="/tx">
                          Transaction
                        </NavLink>
                      </li>
                      <li className="pure-menu-item">
                        <NavLink
                          activeClassName="pure-menu-selected"
                          className="pure-menu-link"
                          to="/address">
                          Address
                        </NavLink>
                      </li>
                      <li className="pure-menu-item">
                        <NavLink
                          activeClassName="pure-menu-selected"
                          className="pure-menu-link"
                          to="/user">
                          User
                        </NavLink>
                      </li>
                      <li className="pure-menu-item">
                        <NavLink
                          activeClassName="pure-menu-selected"
                          className="pure-menu-link"
                          to="/customers">
                          Customers
                        </NavLink>
                      </li>
                      <li className="pure-menu-item">
                        <NavLink
                          activeClassName="pure-menu-selected"
                          className="pure-menu-link"
                          to="/block">
                          Block
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>

                <Switch>
                  <Route path="/create" component={CreatePage}/>
                  <Route path="/tx" component={TxPage}/>
                  <Route path="/address" component={AddressPage}/>
                  <Route path="/user" component={UserPage}/>
                  <Route path={"/customers/:id"} name="customers" component={CustomersPage}/>
                  <Route path="/block" component={BlockPage}/>
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
