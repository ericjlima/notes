import React, { Component } from 'react';
import axios from 'axios';

//TODO: CLEAN UP


// var custID=0;

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      customers: [],
      custID: 1,
      create: 'null',
      apiResponse: 'null',
      singleCustData: null,
      value: '',
      data: 'null'
    };
  }

 componentDidMount() {
   
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
    fetch('/api/customers') 
      .then(res => res.json())
      .then(customers => this.setState({ customers }));


    // axios.get(`/customers/${this.props.match.params.id}`)
    // .then((response) => {
    //   console.log(response);
    //   this.setState({apiResponse: JSON.stringify(response)});
    // })
    // .catch(function(error){
    //   console.log(error)
    // });

    axios.get(`/api/customers/${this.props.match.params.id}`)
    .then((response) => {
      this.setState({apiResponse: JSON.response});
      // console.log("response: ");
      // console.log(response.data.name);
      this.setState({singleCustData: response.data.name});
    })
    .catch(function(error){
      console.log(error)
    });

    axios.post(`/api/customers/${this.props.match.params.id}`).then((response) => {
             console.log(response);
        }).catch(function (error) {
        return JSON.stringify(error);
      });;

    
  }


  handleCreateChange(e) {
    // let value = e.target.value;
    this.setState({
      value: e.target.value
    });
  }


  handleSubmit(e) {
    // alert(this.props.match.params.id);
    axios.put(`/api/customers/${this.props.match.params.id}/${this.state.value}`).then((response) => {
             console.log(response);
        }).catch(function (error) {
        return JSON.stringify(error);
      });;
    e.preventDefault();

  }


  render() {
    return (
      <div className="customers">
      <h1 className="Create-title">Create</h1>
        <form method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            <div className="pure-control-group">
              <div className='pure-control-group'>
                <label>Create</label>
                <input onChange={this.handleCreateChange.bind(this)} id="create" type="text" value={this.state.value} placeholder="Create"/>
              </div>
            </div>
            <div className="pure-controls">
              <button type="submit" className="pure-button pure-button-primary">Submit</button>
            </div>
          </fieldset>
        </form>
        <h1 className="customers-title">Customer</h1>
        <h1>CustID</h1>
        {this.state.singleCustData}
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
