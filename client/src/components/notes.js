import React, { Component } from 'react';
import axios from 'axios';
var md5 = require('md5');


//TODO: CLEAN UP


class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      notes: [],
      nodeID: 1,
      create: 'null',
      checkPass: null,
      pass: '',
      passEntered: false,
      verificationMessage: null,
      passwordEnteredMessage: null,
      verificationPassMessage: null,
      singleNoteData: null,
      message: null,
      value: '',
      data: 'null',
    };
  }

 componentDidMount() {
   

    fetch('/api/notes')
      .then(res => res.json())
      .then(notes => this.setState({ notes }));

    axios.get(`/api/notes/${this.props.match.params.id}`)
    .then((response) => {
      this.setState({apiResponse: JSON.response});
      // console.log("response: ");
      // console.log(response.data.name);
      this.setState({singleNoteData: response.data.name});
      this.setState({message: response.data.message});
        this.setState({
          value: unescape(response.data.message)
        });
    })
    .catch(function(error){
      console.log(error)
    });

    axios.get(`/api/password/${this.state.pass}`).then((response) => {
              console.log("pass");
             console.log(response.data[0].password);

          this.setState({checkPass: response.data[0].password});
        }).catch(function (error) {
        return JSON.stringify(error);
      });

    axios.post(`/api/notes/${this.props.match.params.id}`).then((response) => {
      alert(this.props.match.params.id);
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

  handlePassEnter(e){
    this.setState({
      pass: e.target.value
    });
  }

  handleSubmit(e) {
      if(this.state.passEntered){

        axios.put(`/api/notes/${this.props.match.params.id}/${encodeURIComponent(this.state.value)}`).then((response) => {
                 console.log(response);
            }).catch(function (error) {
            return JSON.stringify(error);
          });;
        this.setState({
          verificationMessage: "Message was saved.",
          message: this.state.value
        });
        setTimeout(()=>{
          this.setState({
             verificationMessage: ""
          });
        },2000)
    }
    e.preventDefault(); 
  }

  handleSubmitPass(e) {
    //alert(this.state.pass);
      if(md5(this.state.pass)===this.state.checkPass){
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
      }
      else{
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
      e.preventDefault();
  }

  htmlEntities(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  render() {
    return (
      <div className="notes">
      <h1 className="Create-title">
        {this.props.match.params.id}</h1>        
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

        <form method="get" className="pure-form pure-form-aligned createNote" onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            <div className="pure-control-group">
              <div className='pure-control-group'>
                <label>Create</label>
                <textarea onChange={this.handleCreateChange.bind(this)} id="create" type="text" value={this.state.value} placeholder="Create"/>
              </div>
            </div>
            <div className="pure-controls">
              <button type="submit" className="pure-button pure-button-primary messageSubmit-button">Submit</button> <p className="verificationMessage"> {this.state.verificationMessage} </p>
            </div>
          </fieldset>
        </form>


        <h1>Message</h1>
        <div dangerouslySetInnerHTML={{ __html: unescape(this.state.message) }}/> 
        
      </div>
    );
  }
}

export default Notes;
