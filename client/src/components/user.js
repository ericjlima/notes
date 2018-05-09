import React, { Component } from 'react';
import axios from 'axios';
// var custID=0;

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      customers: [],
      custID: 1,
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
      axios.get('/customers', {
        params: {
            ID: 2
        }
      })
      .then(function(response){
        console.log(response);
      })
      .catch(function(error){
        console.log(error)
      });
  }

  render() {
    return (
      <div className="user">
        <h1 className="user-title">User</h1>
        <h1>CustID</h1>
        {this.state.custID}
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

export default User;