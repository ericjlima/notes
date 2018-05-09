import React, { Component } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink
} from 'react-router-dom';
// var custID=0;

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      customers: [],
      custID: 1,
      apiResponse: 'null',
      singleCustData: 'null',
      data: 'null'
    };
  }

 componentDidMount() {
   
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
    // fetch('/customers') 
    //   .then(res => res.json())
    //   .then(customers => this.setState({ customers }));

     //axios(`/customers/${custID}`, {
      // axios(`/customers`, {
        let test = 2;
      axios.get(`/customers/${this.props.match.params.id}`)
      .then((response) => {
        console.log(response);
        this.setState({apiResponse: JSON.stringify(response)});
      })
      .catch(function(error){
        console.log(error)
      });
  }

  render() {
     console.log(this.props);
    return (
      <div className="customers">
        <h1 className="customers-title">Customer</h1>
        <h1>CustID</h1>
        {this.state.apiResponse}
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
        <h1>Customers</h1>
        {this.state.customers.map(customer =>
            <div key={customer.id}>{customer.name}</div>
        )}
      </div>
    );
  }
}

export default Customers;
