import React, { Component } from 'react';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      data: 'null'
    };
  }

  handleSearchChange(e) {
    let value = e.target.value;
    this.setState({
      search: value
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
      <div className="Search">
        <h1 className="Search-title">Search</h1>
        <form method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            <div className="pure-control-group">
              <div className='pure-control-group'>
                <label>Search</label>
                <input onChange={this.handleSearchChange.bind(this)} id="search" type="text" placeholder="Search"/>
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

export default Search;
