import React, { Component } from 'react';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      create: '',
      data: 'null'
    };
  }

  handleCreateChange(e) {
    let value = e.target.value;
    this.setState({
      create: value
    });
  }


  handleSubmit(e) {
    this.props.bitbox.Network.addNode(this.state.node, this.state.command).then((result) => {
      this.setState({
        data: result
      })
    }, (err) => { console.log(err); });
    e.preventDefault();
  }

  render() {
    return (
      <div className="Create">
        <h1 className="Create-title">Create</h1>
        <form method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            <div className="pure-control-group">
              <div className='pure-control-group'>
                <label>Create</label>
                <input onChange={this.handleCreateChange.bind(this)} id="create" type="text" placeholder="Create"/>
              </div>
            </div>
            <div className="pure-controls">
              <button type="submit" className="pure-button pure-button-primary">Submit</button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Create;
