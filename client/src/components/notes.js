import React, { Component } from 'react';
import axios from 'axios';


//TODO: CLEAN UP

class notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      notes: [],
      nodeID: 1,
      create: 'null',
      apiResponse: 'null',
      verificationMessage: null,
      singleNoteData: null,
      message: null,
      value: '',
      data: 'null',
    };
  }

 componentDidMount() {
   

    fetch('/notes') 
      .then(res => res.json())
      .then(notes => this.setState({ notes }));

    axios.get(`/notes/${this.props.match.params.id}`)
    .then((response) => {
      this.setState({apiResponse: JSON.response});
      // console.log("response: ");
      // console.log(response.data.name);
      this.setState({singleNoteData: response.data.name});
      this.setState({message: response.data.message});
        this.setState({
          value: response.data.message
        });
    })
    .catch(function(error){
      console.log(error)
    });

    axios.post(`/notes/${this.props.match.params.id}`).then((response) => {
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
    axios.put(`/notes/${this.props.match.params.id}/${this.state.value}`).then((response) => {
             console.log(response);
        }).catch(function (error) {
        return JSON.stringify(error);
      });;
    e.preventDefault();
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

  htmlEntities(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  render() {
    return (
      <div className="notes">
      <h1 className="Create-title">Create</h1>
        <form method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this)}>
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
        <h1 className="notes-title">note</h1>
        <h1>NoteID</h1>
        {this.props.match.params.id}
        <h1>Message</h1>
        {this.state.message}
        <h1>All Notes</h1>
        {this.state.notes.map(note =>
            <div key={note.id}>{note.name} - {note.message}</div>
        )}
      </div>
    );
  }
}

export default notes;
