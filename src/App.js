import React from 'react';
import './App.css';
import Table from './components/Table'

const App = () =>
  (<div style={{ width: 'max-content' }}>
    <Table x={4} y={4} id={'1'} />
    <Table x={4} y={4} id={'2'} />
  </div>)


export default App;