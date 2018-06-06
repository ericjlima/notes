import React, { Component } from 'react';
import axios from 'axios';
// var md5 = require('md5');
//TODO: finish adding https://www.youtube.com/watch?v=aT98NMdAXyk
var loggedIn = false;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	email: "",
    	password: "",
    	// loggedIn: false,
    };
  }

  componentDidMount(e) {
  }

  handleEmailChange(e) {
  	this.setState({
  		email: e.target.value
  	});
  }

  handlePassChange(e){
  	this.setState({
  		password: e.target.value
  	});
  	// alert(this.state.password);
  }

  handlePassEnter(e){
  }

  handleSubmit(e) {
  	// alert(this.state.email);
	axios.post('/api/login', {
	    email: this.state.email,
	    password: this.state.password
	  })
	  .then(function (response) {
	    console.log(response);
	    if(response.data.email === "asd"){
	    	// this.setState({
    		// 	loggedIn: true
	    	// });
	    	loggedIn = true;
	    	alert(loggedIn);
	    }
	    // window.location.href="logged";

	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  	e.preventDefault();
  }

  handleSubmitPass(e) {
  }

  htmlEntities(str) {
  }

  render() {
    return (
      <div className="login">      
	        <input type="text" size="40" onChange={this.handleEmailChange.bind(this)} placeholder="Type your email" id="email" value={this.state.email} /><br />
	        <input type="password" onChange={this.handlePassChange.bind(this)} size="40" placeholder="Type your password" id="password" value={this.state.password} /><br />
	        <input type="button" value="Submit" id="submit" onClick={this.handleSubmit.bind(this)}/>
      </div>
    );
  }
}

export default Login;
