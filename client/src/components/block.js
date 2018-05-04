import React, { Component } from 'react';

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 'null'
    };
  }

  render() {
    return (
      <div className="block">
        <h1 className="block-title">Block</h1>
        <p>Coming Soon</p>
      </div>
    );
  }
}

export default Block;
