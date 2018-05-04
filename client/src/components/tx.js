import React, { Component } from 'react';

class Tx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 'null'
    };
  }

  render() {
    return (
      <div className="tx">
        <h1 className="tx-title">Transaction</h1>
        <p>Coming Soon</p>
      </div>
    );
  }
}

export default Tx;
