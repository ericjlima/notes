import React, { Component } from 'react';

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      data: 'null'
    };
  }

 componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() {
    return (
      <div className="address">
        <h1 className="address-title">Address</h1>
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

export default Address;
