import React, { Component } from 'react';
import axios from 'axios';
var md5 = require('md5');
//TODO: finish adding https://www.youtube.com/watch?v=aT98NMdAXyk

class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      notes: [],
      nodeID: 1,
      create: 'null',
      checkPass: null,
      checkSessionID: null,
      pass: '',
      passEntered: false,
      verificationMessage: null,
      passwordEnteredMessage: null,
      verificationPassMessage: null,
      singleNoteData: null,
      message: null,
      value: '',
      data: 'null',
      timer: null,
    };
  }


  handlePassEnter(e){
    this.setState({
      pass: e.target.value
    });
  }

  
  handleSubmitPass(e) {
    axios.post(`${this.props.baseURL}/api/password`, {password: md5(this.state.pass)}).then((response) => {

             if(response.data==="logged"){
                  this.setState({ passEntered: true });
                  this.setState({
                    passwordEnteredMessage: "Password was entered.",
                    message: this.state.value
                  });
                  setTimeout(()=>{
                    this.setState({
                       passwordEnteredMessage: ""
                    });
                  },2000)
             } else {
                  this.setState({
                  passwordEnteredMessage: "Password was not entered.",
                  message: this.state.value
                });
                setTimeout(()=>{
                  this.setState({
                     passwordEnteredMessage: ""
                  });
                },2000)
             }
        }).catch(function (error) {
        return JSON.stringify(error);
    });;


      // if(md5(this.state.pass)===this.state.checkPass){
   
      // }
      // else{
   
      // }
      e.preventDefault();
  }
  render(){
    return <div>
        <form method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmitPass.bind(this)}>
          <fieldset>
            <div className="pure-control-group">
              <div className='pure-control-group'>
                <label>Password</label>
                <input onChange={this.handlePassEnter.bind(this)} id="passenter" type="text" value={this.state.pass} placeholder="Create"/>
              </div>
            </div>
            <div className="pure-controls">
              <button type="submit" className="pure-button pure-button-primary messageSubmit-button">Submit</button> <p className="passwordEnteredMessage"> {this.state.passwordEnteredMessage} </p>
            </div>
          </fieldset>
        </form>


    </div>;
  }
};
export default Password;
