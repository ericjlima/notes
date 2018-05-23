import React, { Component } from 'react';
import axios from 'axios';


class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
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
   
    // fetch('/users')
    //   .then(res => res.json())
    //   .then(users => this.setState({ users }));
    // fetch('/posts') 
    //   .then(res => res.json())
    //   .then(posts => this.setState({ posts }));


// https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
//   let data = '';
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });
//   resp.on('end', () => {
//     console.log(JSON.parse(data).explanation);
//   });
// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });

//TODO: figure out how to get proxy to work on heroku

    axios.get(`/notes/${this.props.match.params.id}`)
    .then((response) => {
      console.log(response);
      this.setState({apiResponse: JSON.stringify(response.data)});
    })


    // axios.get(`/customers/${this.props.match.params.id}`)
    // .then((response) => {
    //   console.log(response);
    //   this.setState({apiResponse: JSON.stringify(response)});
    // })
    // .catch(function(error){
    //   console.log(error)
    // });

    // axios.get(`/customers/${this.props.match.params.id}`)
    // .then((response) => {
    //   this.setState({apiResponse: JSON.response});
    //   // console.log("response: ");
    //   // console.log(response.data.name);
    //   this.setState({singleCustData: response.data.name});
    // })
    // .catch(function(error){
    //   console.log(error)
    // });

    // axios.post(`/customers/${this.props.match.params.id}`).then((response) => {
    //          console.log(response);
    //     }).catch(function (error) {
    //     return JSON.stringify(error);
    //   });;

    
  }


  handleCreateChange(e) {
    // let value = e.target.value;
    this.setState({
      value: e.target.value
    });
  }


  handleSubmit(e) {
    // alert(this.props.match.params.id);
    axios.put(`/note/${this.props.match.params.id}/${this.state.value}`).then((response) => {
             console.log(response);
        }).catch(function (error) {
        return JSON.stringify(error);
      });;
    e.preventDefault();

  }


  render() {
    return (
      <div className="block">
        <h1 className="block-title">Block</h1>
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
        <h1 className="block-title">Customer</h1>
        <h1>CustID</h1>
        {this.state.apiResponse}
        <h1>Notes</h1>
        {this.state.notes.map(note =>
          <div key={note.id}>{note.title}</div>
        )}
        <h1>Customers</h1>
        {this.state.customers.map(customer =>
            <div key={customer.id}>{customer.name}</div>
        )}
      </div>
    );
  }
}

export default Block;
